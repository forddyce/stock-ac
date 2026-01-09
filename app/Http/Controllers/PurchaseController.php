<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_purchase', ['only' => ['index', 'show']]);
        $this->middleware('permission:create_purchase', ['only' => ['create', 'store', 'edit', 'update', 'receive', 'processReceive']]);
        $this->middleware('permission:create_purchase', ['only' => ['destroy']]);
    }

    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'warehouse', 'creator']);

        if ($search = $request->input('search')) {
            $query->where('invoice_no', 'like', "%{$search}%");
        }

        if ($fromDate = $request->input('from_date')) {
            $query->whereDate('purchase_date', '>=', $fromDate);
        }

        if ($toDate = $request->input('to_date')) {
            $query->whereDate('purchase_date', '<=', $toDate);
        }

        $sortBy = $request->input('sort_by', 'purchase_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $purchases = $query->paginate(15)->withQueryString();

        return Inertia::render('purchases/index', [
            'purchases' => $purchases,
            'filters' => $request->only(['search', 'from_date', 'to_date', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $suppliers = Supplier::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('purchases/create', [
            'warehouses' => $warehouses,
            'suppliers' => $suppliers,
            'items' => $items,
            'nextInvoiceNo' => $this->generateNextInvoiceNo(),
        ]);
    }

    private function generateNextInvoiceNo()
    {
        $today = now();
        $year = $today->format('Y');
        $dateString = $today->format('d/m/Y');

        $lastPurchase = Purchase::whereYear('purchase_date', $year)
            ->orderBy('invoice_no', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastPurchase) {
            $parts = explode('/', $lastPurchase->invoice_no);
            if (count($parts) > 0) {
                $currentNumber = (int) $parts[0];
                $nextNumber = $currentNumber + 1;
            }
        }

        return sprintf('%04d', $nextNumber) . "/BELI/{$dateString}";
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_no' => 'nullable|string|max:50|unique:purchases,invoice_no',
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'purchase_date' => 'required|date',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_ordered' => 'required|numeric|min:0.01',
            'items.*.cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $purchase = Purchase::create([
                'invoice_no' => $validated['invoice_no'] ?? null,
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'purchase_date' => $validated['purchase_date'],
                'status' => 'pending',
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $purchase->items()->create([
                    'item_id' => $item['item_id'],
                    'qty_ordered' => $item['qty_ordered'],
                    'qty_received' => 0,
                    'cost' => $item['cost'],
                    'subtotal' => $item['qty_ordered'] * $item['cost'],
                    'status' => 'pending',
                ]);
            }
        });

        return redirect('/purchases')
            ->with('success', 'Purchase created successfully.');
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'warehouse', 'creator', 'items.item']);

        return Inertia::render('purchases/show', [
            'purchase' => $purchase,
        ]);
    }

    public function edit(Purchase $purchase)
    {
        $purchase->load('items.item');
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $suppliers = Supplier::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('purchases/edit', [
            'purchase' => $purchase,
            'warehouses' => $warehouses,
            'suppliers' => $suppliers,
            'items' => $items,
        ]);
    }

    public function update(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'invoice_no' => 'nullable|string|max:50|unique:purchases,invoice_no,' . $purchase->id,
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'purchase_date' => 'required|date',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_ordered' => 'required|numeric|min:0.01',
            'items.*.cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            foreach ($purchase->items as $oldItem) {
                if ($oldItem->qty_received > 0) {
                    $warehouseItem = WarehouseItem::where([
                        'warehouse_id' => $purchase->warehouse_id,
                        'item_id' => $oldItem->item_id,
                    ])->first();

                    if ($warehouseItem) {
                        $qtyBefore = $warehouseItem->stock;
                        $warehouseItem->decrement('stock', $oldItem->qty_received);

                        ItemHistory::create([
                            'batch_id' => 'PUR-REV-' . $purchase->id . '-' . now()->format('YmdHis'),
                            'item_id' => $oldItem->item_id,
                            'warehouse_id' => $purchase->warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $purchase->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => -$oldItem->qty_received,
                            'qty_after' => $warehouseItem->stock,
                            'notes' => "Purchase {$purchase->invoice_no} updated",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            $purchase->items()->delete();

            $purchase->update([
                'invoice_no' => $validated['invoice_no'] ?? null,
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'purchase_date' => $validated['purchase_date'],
                'status' => 'pending',
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $item) {
                $purchase->items()->create([
                    'item_id' => $item['item_id'],
                    'qty_ordered' => $item['qty_ordered'],
                    'qty_received' => 0,
                    'cost' => $item['cost'],
                    'subtotal' => $item['qty_ordered'] * $item['cost'],
                    'status' => 'pending',
                ]);
            }
        });

        return redirect('/purchases')
            ->with('success', 'Purchase updated successfully.');
    }

    public function destroy(Purchase $purchase)
    {
        DB::transaction(function () use ($purchase) {
            foreach ($purchase->items as $item) {
                if ($item->qty_received > 0) {
                    $warehouseItem = WarehouseItem::where([
                        'warehouse_id' => $purchase->warehouse_id,
                        'item_id' => $item->item_id,
                    ])->first();

                    if ($warehouseItem) {
                        $qtyBefore = $warehouseItem->stock;
                        $warehouseItem->decrement('stock', $item->qty_received);

                        ItemHistory::create([
                            'batch_id' => 'PUR-DEL-' . $purchase->id . '-' . now()->format('YmdHis'),
                            'item_id' => $item->item_id,
                            'warehouse_id' => $purchase->warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $purchase->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => -$item->qty_received,
                            'qty_after' => $warehouseItem->stock,
                            'notes' => "Purchase {$purchase->invoice_no} deleted",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            $purchase->items()->delete();
            $purchase->delete();
        });

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase deleted successfully.');
    }

    public function receive(Purchase $purchase)
    {
        $purchase->load(['supplier', 'warehouse', 'items.item']);

        return Inertia::render('purchases/receive', [
            'purchase' => $purchase,
        ]);
    }

    public function processReceive(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:purchase_items,id',
            'items.*.qty_to_receive' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            $allComplete = true;

            foreach ($validated['items'] as $itemData) {
                $purchaseItem = $purchase->items()->findOrFail($itemData['id']);
                $qtyToReceive = $itemData['qty_to_receive'];

                if ($qtyToReceive > 0) {
                    $newQtyReceived = $purchaseItem->qty_received + $qtyToReceive;
                    
                    if ($newQtyReceived > $purchaseItem->qty_ordered) {
                        throw new \Exception("Cannot receive more than ordered quantity for item");
                    }

                    $warehouseItem = WarehouseItem::firstOrCreate(
                        [
                            'warehouse_id' => $purchase->warehouse_id,
                            'item_id' => $purchaseItem->item_id,
                        ],
                        ['stock' => 0]
                    );

                    $warehouseItem->increment('stock', $qtyToReceive);

                    $qtyBefore = $warehouseItem->stock - $qtyToReceive;

                    ItemHistory::create([
                        'batch_id' => 'PUR-RCV-' . $purchase->id . '-' . now()->format('YmdHis'),
                        'item_id' => $purchaseItem->item_id,
                        'warehouse_id' => $purchase->warehouse_id,
                        'transaction_type' => 'purchase',
                        'reference_id' => $purchase->id,
                        'qty_before' => $qtyBefore,
                        'qty_change' => $qtyToReceive,
                        'qty_after' => $warehouseItem->stock,
                        'notes' => "Received for purchase {$purchase->invoice_no}" . ($itemData['notes'] ? ": {$itemData['notes']}" : ''),
                        'user_id' => Auth::id(),
                    ]);

                    $purchaseItem->update([
                        'qty_received' => $newQtyReceived,
                        'status' => $newQtyReceived >= $purchaseItem->qty_ordered ? 'complete' : 'partial',
                        'notes' => $itemData['notes'] ?? $purchaseItem->notes,
                    ]);
                }

                if ($purchaseItem->fresh()->status !== 'complete') {
                    $allComplete = false;
                }
            }

            $hasPartial = $purchase->items()->where('status', 'partial')->exists();
            $hasPending = $purchase->items()->where('status', 'pending')->exists();
            
            $purchase->update([
                'status' => $allComplete ? 'complete' : ($hasPartial || !$hasPending ? 'partial' : 'pending'),
            ]);
        });

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Items received successfully.');
    }
}
