<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\Sale;
use App\Models\SalesPerson;
use App\Models\Warehouse;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_sale', ['only' => ['index', 'show']]);
        $this->middleware('permission:create_sale', ['only' => ['create', 'store', 'edit', 'update', 'fulfill', 'processFulfill']]);
        $this->middleware('permission:create_sale', ['only' => ['destroy']]);
    }

    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'warehouse', 'salesPerson', 'creator']);

        if ($search = $request->input('search')) {
            $query->where('invoice_no', 'like', "%{$search}%");
        }

        if ($fromDate = $request->input('from_date')) {
            $query->whereDate('sale_date', '>=', $fromDate);
        }

        if ($toDate = $request->input('to_date')) {
            $query->whereDate('sale_date', '<=', $toDate);
        }

        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($customerId = $request->input('customer_id')) {
            if ($customerId !== 'all') {
                $query->where('customer_id', $customerId);
            }
        }

        $sortBy = $request->input('sort_by', 'sale_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $sales = $query->paginate(15)->withQueryString();
        $customers = Customer::active()->get(['id', 'code', 'name']);

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => $request->only(['search', 'from_date', 'to_date', 'status', 'customer_id', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $customers = Customer::active()->get(['id', 'code', 'name']);
        $salesPersons = SalesPerson::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('sales/create', [
            'warehouses' => $warehouses,
            'customers' => $customers,
            'salesPersons' => $salesPersons,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_no' => 'nullable|string|max:100|unique:sales,invoice_no',
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'sales_person_id' => 'nullable|exists:sales_persons,id',
            'sale_date' => 'required|date',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_ordered' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $sale = Sale::create([
                'invoice_no' => $validated['invoice_no'] ?? null,
                'customer_id' => $validated['customer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'sales_person_id' => $validated['sales_person_id'] ?? null,
                'sale_date' => $validated['sale_date'],
                'status' => 'pending',
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'payment_status' => 'unpaid',
                'paid' => 0,
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            foreach ($validated['items'] as $item) {
                $sale->items()->create([
                    'item_id' => $item['item_id'],
                    'qty_ordered' => $item['qty_ordered'],
                    'qty_fulfilled' => 0,
                    'price' => $item['price'],
                    'subtotal' => $item['qty_ordered'] * $item['price'],
                    'status' => 'pending',
                ]);
            }
        });

        return redirect('/sales')
            ->with('success', 'Sale created successfully.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'warehouse', 'salesPerson', 'creator', 'items.item']);

        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }

    public function edit(Sale $sale)
    {
        $sale->load('items.item');
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $customers = Customer::active()->get(['id', 'code', 'name']);
        $salesPersons = SalesPerson::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('sales/edit', [
            'sale' => $sale,
            'warehouses' => $warehouses,
            'customers' => $customers,
            'salesPersons' => $salesPersons,
            'items' => $items,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'invoice_no' => 'nullable|string|max:100|unique:sales,invoice_no,' . $sale->id,
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'sales_person_id' => 'nullable|exists:sales_persons,id',
            'sale_date' => 'required|date',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_ordered' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $sale) {
            foreach ($sale->items as $oldItem) {
                if ($oldItem->qty_fulfilled > 0) {
                    $warehouseItem = WarehouseItem::where([
                        'warehouse_id' => $sale->warehouse_id,
                        'item_id' => $oldItem->item_id,
                    ])->first();

                    if ($warehouseItem) {
                        $qtyBefore = $warehouseItem->stock;
                        $warehouseItem->increment('stock', $oldItem->qty_fulfilled);

                        ItemHistory::create([
                            'batch_id' => 'SALE-REV-' . $sale->id . '-' . now()->format('YmdHis'),
                            'item_id' => $oldItem->item_id,
                            'warehouse_id' => $sale->warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $sale->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => $oldItem->qty_fulfilled,
                            'qty_after' => $warehouseItem->stock,
                            'notes' => "Sale {$sale->invoice_no} updated",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            $sale->items()->delete();

            $sale->update([
                'invoice_no' => $validated['invoice_no'] ?? null,
                'customer_id' => $validated['customer_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'sales_person_id' => $validated['sales_person_id'] ?? null,
                'sale_date' => $validated['sale_date'],
                'status' => 'pending',
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $item) {
                $sale->items()->create([
                    'item_id' => $item['item_id'],
                    'qty_ordered' => $item['qty_ordered'],
                    'qty_fulfilled' => 0,
                    'price' => $item['price'],
                    'subtotal' => $item['qty_ordered'] * $item['price'],
                    'status' => 'pending',
                ]);
            }
        });

        return redirect('/sales')
            ->with('success', 'Sale updated successfully.');
    }

    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->items as $item) {
                if ($item->qty_fulfilled > 0) {
                    $warehouseItem = WarehouseItem::where([
                        'warehouse_id' => $sale->warehouse_id,
                        'item_id' => $item->item_id,
                    ])->first();

                    if ($warehouseItem) {
                        $qtyBefore = $warehouseItem->stock;
                        $warehouseItem->increment('stock', $item->qty_fulfilled);

                        ItemHistory::create([
                            'batch_id' => 'SALE-DEL-' . $sale->id . '-' . now()->format('YmdHis'),
                            'item_id' => $item->item_id,
                            'warehouse_id' => $sale->warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $sale->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => $item->qty_fulfilled,
                            'qty_after' => $warehouseItem->stock,
                            'notes' => "Sale {$sale->invoice_no} deleted",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            $sale->items()->delete();
            $sale->delete();
        });

        return redirect()->route('sales.index')
            ->with('success', 'Sale deleted successfully.');
    }

    public function fulfill(Sale $sale)
    {
        $sale->load(['customer', 'warehouse', 'salesPerson', 'items.item']);

        return Inertia::render('sales/fulfill', [
            'sale' => $sale,
        ]);
    }

    public function processFulfill(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:sale_items,id',
            'items.*.qty_to_fulfill' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $sale) {
            $allComplete = true;

            foreach ($validated['items'] as $itemData) {
                $saleItem = $sale->items()->findOrFail($itemData['id']);
                $qtyToFulfill = $itemData['qty_to_fulfill'];

                if ($qtyToFulfill > 0) {
                    $newQtyFulfilled = $saleItem->qty_fulfilled + $qtyToFulfill;
                    
                    if ($newQtyFulfilled > $saleItem->qty_ordered) {
                        throw new \Exception("Cannot fulfill more than ordered quantity for item");
                    }

                    $warehouseItem = WarehouseItem::firstOrCreate(
                        [
                            'warehouse_id' => $sale->warehouse_id,
                            'item_id' => $saleItem->item_id,
                        ],
                        ['stock' => 0]
                    );

                    $qtyBefore = $warehouseItem->stock;
                    $warehouseItem->decrement('stock', $qtyToFulfill);

                    ItemHistory::create([
                        'batch_id' => 'SALE-FUL-' . $sale->id . '-' . now()->format('YmdHis'),
                        'item_id' => $saleItem->item_id,
                        'warehouse_id' => $sale->warehouse_id,
                        'transaction_type' => 'sale',
                        'reference_id' => $sale->id,
                        'qty_before' => $qtyBefore,
                        'qty_change' => -$qtyToFulfill,
                        'qty_after' => $warehouseItem->stock,
                        'notes' => "Fulfilled for sale {$sale->invoice_no}" . ($itemData['notes'] ? ": {$itemData['notes']}" : ''),
                        'user_id' => Auth::id(),
                    ]);

                    $saleItem->update([
                        'qty_fulfilled' => $newQtyFulfilled,
                        'status' => $newQtyFulfilled >= $saleItem->qty_ordered ? 'complete' : 'partial',
                        'notes' => $itemData['notes'] ?? $saleItem->notes,
                    ]);
                }

                if ($saleItem->fresh()->status !== 'complete') {
                    $allComplete = false;
                }
            }

            $hasPartial = $sale->items()->where('status', 'partial')->exists();
            $hasPending = $sale->items()->where('status', 'pending')->exists();
            
            $sale->update([
                'status' => $allComplete ? 'complete' : ($hasPartial || !$hasPending ? 'partial' : 'pending'),
            ]);
        });

        return redirect()->route('sales.show', $sale)
            ->with('success', 'Items fulfilled successfully.');
    }

    public function print(Sale $sale)
    {
        $sale->load(['customer', 'warehouse', 'salesPerson', 'items.item']);

        return view('sales.invoice', [
            'sale' => $sale,
        ]);
    }
}
