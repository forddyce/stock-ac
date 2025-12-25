<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\Transfer;
use App\Models\Warehouse;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_transfer', ['only' => ['index', 'show']]);
        $this->middleware('permission:create_transfer', ['only' => ['create', 'store', 'edit', 'update', 'process', 'processTransfer']]);
        $this->middleware('permission:create_transfer', ['only' => ['destroy']]);
    }

    public function index(Request $request)
    {
        $query = Transfer::with(['fromWarehouse', 'toWarehouse', 'item', 'creator'])
            ->selectRaw('transfer_no, from_warehouse_id, to_warehouse_id, transfer_date, status, MAX(created_at) as latest_created')
            ->groupBy('transfer_no', 'from_warehouse_id', 'to_warehouse_id', 'transfer_date', 'status');

        if ($search = $request->input('search')) {
            $query->where('transfer_no', 'like', "%{$search}%");
        }

        if ($fromDate = $request->input('from_date')) {
            $query->whereDate('transfer_date', '>=', $fromDate);
        }

        if ($toDate = $request->input('to_date')) {
            $query->whereDate('transfer_date', '<=', $toDate);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($fromWarehouseId = $request->input('from_warehouse_id')) {
            $query->where('from_warehouse_id', $fromWarehouseId);
        }

        if ($toWarehouseId = $request->input('to_warehouse_id')) {
            $query->where('to_warehouse_id', $toWarehouseId);
        }

        $sortBy = $request->input('sort_by', 'transfer_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $transfers = $query->paginate(15)->withQueryString();
        
        $groupedData = [];
        foreach ($transfers as $transfer) {
            if (!isset($groupedData[$transfer->transfer_no])) {
                $groupedData[$transfer->transfer_no] = [
                    'transfer_no' => $transfer->transfer_no,
                    'from_warehouse' => $transfer->fromWarehouse,
                    'to_warehouse' => $transfer->toWarehouse,
                    'transfer_date' => $transfer->transfer_date,
                    'status' => $transfer->status,
                    'created_at' => $transfer->created_at,
                    'item_count' => 0,
                ];
            }
            $groupedData[$transfer->transfer_no]['item_count']++;
        }

        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);

        return Inertia::render('transfers/index', [
            'transfers' => [
                'data' => array_values($groupedData),
                'current_page' => $transfers->currentPage(),
                'last_page' => $transfers->lastPage(),
                'per_page' => $transfers->perPage(),
                'total' => $transfers->total(),
                'links' => $transfers->linkCollection()->toArray(),
            ],
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'from_date', 'to_date', 'status', 'from_warehouse_id', 'to_warehouse_id', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('transfers/create', [
            'warehouses' => $warehouses,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transfer_no' => 'nullable|string|max:100|unique:transfers,transfer_no',
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
            'transfer_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_requested' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($validated, $request) {
            foreach ($validated['items'] as $item) {
                Transfer::create([
                    'transfer_no' => $validated['transfer_no'] ?? 'TRF-' . now()->format('YmdHis'),
                    'from_warehouse_id' => $validated['from_warehouse_id'],
                    'to_warehouse_id' => $validated['to_warehouse_id'],
                    'item_id' => $item['item_id'],
                    'qty_requested' => $item['qty_requested'],
                    'qty_sent' => 0,
                    'qty_received' => 0,
                    'transfer_date' => $validated['transfer_date'],
                    'status' => 'pending',
                    'notes' => $validated['notes'],
                    'created_by' => Auth::id(),
                ]);
            }
        });

        return redirect('/transfers')
            ->with('success', 'Transfer created successfully.');
    }

    public function show($transferNo)
    {
        $transfers = Transfer::with(['fromWarehouse', 'toWarehouse', 'item', 'creator'])
            ->where('transfer_no', $transferNo)
            ->get();

        if ($transfers->isEmpty()) {
            abort(404);
        }

        $transferData = [
            'transfer_no' => $transfers->first()->transfer_no,
            'from_warehouse' => $transfers->first()->fromWarehouse,
            'to_warehouse' => $transfers->first()->toWarehouse,
            'transfer_date' => $transfers->first()->transfer_date,
            'status' => $transfers->first()->status,
            'notes' => $transfers->first()->notes,
            'creator' => $transfers->first()->creator,
            'created_at' => $transfers->first()->created_at,
            'items' => $transfers->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'item_id' => $transfer->item_id,
                    'item' => $transfer->item,
                    'qty_requested' => $transfer->qty_requested,
                    'qty_sent' => $transfer->qty_sent,
                    'qty_received' => $transfer->qty_received,
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                ];
            }),
        ];

        return Inertia::render('transfers/show', [
            'transfer' => $transferData,
        ]);
    }

    public function edit($transferNo)
    {
        $transfers = Transfer::with(['fromWarehouse', 'toWarehouse', 'item'])
            ->where('transfer_no', $transferNo)
            ->get();

        if ($transfers->isEmpty()) {
            abort(404);
        }

        $transferData = [
            'transfer_no' => $transfers->first()->transfer_no,
            'from_warehouse_id' => $transfers->first()->from_warehouse_id,
            'to_warehouse_id' => $transfers->first()->to_warehouse_id,
            'transfer_date' => $transfers->first()->transfer_date->format('Y-m-d'),
            'status' => $transfers->first()->status,
            'notes' => $transfers->first()->notes,
            'items' => $transfers->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'item_id' => $transfer->item_id,
                    'item' => $transfer->item,
                    'qty_requested' => $transfer->qty_requested,
                    'qty_sent' => $transfer->qty_sent,
                ];
            }),
        ];

        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'code', 'name', 'unit']);

        return Inertia::render('transfers/edit', [
            'transfer' => $transferData,
            'warehouses' => $warehouses,
            'items' => $items,
        ]);
    }

    public function update(Request $request, $transferNo)
    {
        $transfers = Transfer::where('transfer_no', $transferNo)->get();

        if ($transfers->isEmpty()) {
            abort(404);
        }

        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
            'transfer_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty_requested' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($validated, $transfers, $transferNo) {
            foreach ($transfers as $transfer) {
                if ($transfer->qty_sent > 0) {
                    $fromWarehouseItem = WarehouseItem::where([
                        'warehouse_id' => $transfer->from_warehouse_id,
                        'item_id' => $transfer->item_id,
                    ])->first();

                    if ($fromWarehouseItem) {
                        $qtyBefore = $fromWarehouseItem->stock;
                        $fromWarehouseItem->increment('stock', $transfer->qty_sent);

                        ItemHistory::create([
                            'batch_id' => 'TRF-REV-' . $transferNo . '-' . now()->format('YmdHis'),
                            'item_id' => $transfer->item_id,
                            'warehouse_id' => $transfer->from_warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $transfer->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => $transfer->qty_sent,
                            'qty_after' => $fromWarehouseItem->stock,
                            'notes' => "Transfer {$transferNo} updated",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            Transfer::where('transfer_no', $transferNo)->delete();

            foreach ($validated['items'] as $item) {
                Transfer::create([
                    'transfer_no' => $transferNo,
                    'from_warehouse_id' => $validated['from_warehouse_id'],
                    'to_warehouse_id' => $validated['to_warehouse_id'],
                    'item_id' => $item['item_id'],
                    'qty_requested' => $item['qty_requested'],
                    'qty_sent' => 0,
                    'qty_received' => 0,
                    'transfer_date' => $validated['transfer_date'],
                    'status' => 'pending',
                    'notes' => $validated['notes'],
                    'created_by' => Auth::id(),
                ]);
            }
        });

        return redirect('/transfers')
            ->with('success', 'Transfer updated successfully.');
    }

    public function destroy($transferNo)
    {
        $transfers = Transfer::where('transfer_no', $transferNo)->get();

        if ($transfers->isEmpty()) {
            abort(404);
        }

        DB::transaction(function () use ($transfers, $transferNo) {
            foreach ($transfers as $transfer) {
                if ($transfer->qty_sent > 0) {
                    $fromWarehouseItem = WarehouseItem::where([
                        'warehouse_id' => $transfer->from_warehouse_id,
                        'item_id' => $transfer->item_id,
                    ])->first();

                    if ($fromWarehouseItem) {
                        $qtyBefore = $fromWarehouseItem->stock;
                        $fromWarehouseItem->increment('stock', $transfer->qty_sent);

                        ItemHistory::create([
                            'batch_id' => 'TRF-DEL-' . $transferNo . '-' . now()->format('YmdHis'),
                            'item_id' => $transfer->item_id,
                            'warehouse_id' => $transfer->from_warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $transfer->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => $transfer->qty_sent,
                            'qty_after' => $fromWarehouseItem->stock,
                            'notes' => "Transfer {$transferNo} deleted",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }

                if ($transfer->qty_received > 0) {
                    $toWarehouseItem = WarehouseItem::where([
                        'warehouse_id' => $transfer->to_warehouse_id,
                        'item_id' => $transfer->item_id,
                    ])->first();

                    if ($toWarehouseItem) {
                        $qtyBefore = $toWarehouseItem->stock;
                        $toWarehouseItem->decrement('stock', $transfer->qty_received);

                        ItemHistory::create([
                            'batch_id' => 'TRF-DEL-' . $transferNo . '-' . now()->format('YmdHis'),
                            'item_id' => $transfer->item_id,
                            'warehouse_id' => $transfer->to_warehouse_id,
                            'transaction_type' => 'adjustment',
                            'reference_id' => $transfer->id,
                            'qty_before' => $qtyBefore,
                            'qty_change' => -$transfer->qty_received,
                            'qty_after' => $toWarehouseItem->stock,
                            'notes' => "Transfer {$transferNo} deleted",
                            'user_id' => Auth::id(),
                        ]);
                    }
                }
            }

            Transfer::where('transfer_no', $transferNo)->delete();
        });

        return redirect()->route('transfers.index')
            ->with('success', 'Transfer deleted successfully.');
    }

    public function process($transferNo)
    {
        $transfers = Transfer::with(['fromWarehouse', 'toWarehouse', 'item'])
            ->where('transfer_no', $transferNo)
            ->get();

        if ($transfers->isEmpty()) {
            abort(404);
        }

        $transferData = [
            'transfer_no' => $transfers->first()->transfer_no,
            'from_warehouse' => $transfers->first()->fromWarehouse,
            'to_warehouse' => $transfers->first()->toWarehouse,
            'transfer_date' => $transfers->first()->transfer_date,
            'status' => $transfers->first()->status,
            'notes' => $transfers->first()->notes,
            'items' => $transfers->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'item_id' => $transfer->item_id,
                    'item' => $transfer->item,
                    'qty_requested' => $transfer->qty_requested,
                    'qty_sent' => $transfer->qty_sent,
                    'qty_received' => $transfer->qty_received,
                    'status' => $transfer->status,
                ];
            }),
        ];

        return Inertia::render('transfers/process', [
            'transfer' => $transferData,
        ]);
    }

    public function processTransfer(Request $request, $transferNo)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:transfers,id',
            'items.*.qty_to_transfer' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $transferNo) {
            $allComplete = true;

            foreach ($validated['items'] as $itemData) {
                $transfer = Transfer::findOrFail($itemData['id']);
                $qtyToTransfer = $itemData['qty_to_transfer'];

                if ($qtyToTransfer > 0) {
                    $newQtySent = $transfer->qty_sent + $qtyToTransfer;
                    
                    if ($newQtySent > $transfer->qty_requested) {
                        throw new \Exception("Cannot transfer more than requested quantity");
                    }

                    $fromWarehouseItem = WarehouseItem::where([
                        'warehouse_id' => $transfer->from_warehouse_id,
                        'item_id' => $transfer->item_id,
                    ])->first();

                    if (!$fromWarehouseItem || $fromWarehouseItem->stock < $qtyToTransfer) {
                        throw new \Exception("Insufficient stock in source warehouse");
                    }

                    $fromQtyBefore = $fromWarehouseItem->stock;
                    $fromWarehouseItem->decrement('stock', $qtyToTransfer);

                    ItemHistory::create([
                        'batch_id' => 'TRF-OUT-' . $transferNo . '-' . now()->format('YmdHis'),
                        'item_id' => $transfer->item_id,
                        'warehouse_id' => $transfer->from_warehouse_id,
                        'transaction_type' => 'transfer_out',
                        'reference_id' => $transfer->id,
                        'qty_before' => $fromQtyBefore,
                        'qty_change' => -$qtyToTransfer,
                        'qty_after' => $fromWarehouseItem->stock,
                        'notes' => "Transfer out to {$transfer->toWarehouse->name} ({$transferNo})" . ($itemData['notes'] ? ": {$itemData['notes']}" : ''),
                        'user_id' => Auth::id(),
                    ]);

                    $toWarehouseItem = WarehouseItem::firstOrCreate(
                        [
                            'warehouse_id' => $transfer->to_warehouse_id,
                            'item_id' => $transfer->item_id,
                        ],
                        ['stock' => 0]
                    );

                    $toQtyBefore = $toWarehouseItem->stock;
                    $toWarehouseItem->increment('stock', $qtyToTransfer);

                    ItemHistory::create([
                        'batch_id' => 'TRF-IN-' . $transferNo . '-' . now()->format('YmdHis'),
                        'item_id' => $transfer->item_id,
                        'warehouse_id' => $transfer->to_warehouse_id,
                        'transaction_type' => 'transfer_in',
                        'reference_id' => $transfer->id,
                        'qty_before' => $toQtyBefore,
                        'qty_change' => $qtyToTransfer,
                        'qty_after' => $toWarehouseItem->stock,
                        'notes' => "Transfer in from {$transfer->fromWarehouse->name} ({$transferNo})" . ($itemData['notes'] ? ": {$itemData['notes']}" : ''),
                        'user_id' => Auth::id(),
                    ]);

                    $transfer->update([
                        'qty_sent' => $newQtySent,
                        'qty_received' => $newQtySent,
                        'status' => $newQtySent >= $transfer->qty_requested ? 'complete' : 'in_transit',
                        'notes' => $itemData['notes'] ?? $transfer->notes,
                        'processed_at' => now(),
                    ]);
                }

                if ($transfer->fresh()->status !== 'complete') {
                    $allComplete = false;
                }
            }
        });

        return redirect()->route('transfers.show', $transferNo)
            ->with('success', 'Transfer processed successfully.');
    }
}
