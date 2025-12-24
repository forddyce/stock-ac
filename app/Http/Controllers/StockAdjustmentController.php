<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\StockAdjustment;
use App\Models\Warehouse;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function index(Request $request)
    {
        $query = StockAdjustment::with(['warehouse', 'item', 'creator'])
            ->select('*')
            ->selectRaw('adjustment_no, warehouse_id, adjustment_date, type, MAX(created_at) as latest_created')
            ->groupBy('adjustment_no', 'warehouse_id', 'adjustment_date', 'type', 'id', 'item_id', 'qty', 'reason', 'idempotency_key', 'processed_at', 'created_by', 'created_at', 'updated_at');

        if ($search = $request->input('search')) {
            $query->where('adjustment_no', 'like', "%{$search}%");
        }

        if ($fromDate = $request->input('from_date')) {
            $query->whereDate('adjustment_date', '>=', $fromDate);
        }

        if ($toDate = $request->input('to_date')) {
            $query->whereDate('adjustment_date', '<=', $toDate);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($warehouseId = $request->input('warehouse_id')) {
            $query->where('warehouse_id', $warehouseId);
        }

        $sortBy = $request->input('sort_by', 'adjustment_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $adjustments = $query->paginate(15)->withQueryString();
        
        $groupedData = [];
        foreach ($adjustments as $adjustment) {
            if (!isset($groupedData[$adjustment->adjustment_no])) {
                $groupedData[$adjustment->adjustment_no] = [
                    'adjustment_no' => $adjustment->adjustment_no,
                    'warehouse' => $adjustment->warehouse,
                    'adjustment_date' => $adjustment->adjustment_date,
                    'type' => $adjustment->type,
                    'reason' => $adjustment->reason,
                    'created_at' => $adjustment->created_at,
                    'item_count' => 0,
                ];
            }
            $groupedData[$adjustment->adjustment_no]['item_count']++;
        }

        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);

        return Inertia::render('stock-adjustments/index', [
            'adjustments' => [
                'data' => array_values($groupedData),
                'current_page' => $adjustments->currentPage(),
                'last_page' => $adjustments->lastPage(),
                'per_page' => $adjustments->perPage(),
                'total' => $adjustments->total(),
                'links' => $adjustments->linkCollection()->toArray(),
            ],
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'from_date', 'to_date', 'type', 'warehouse_id', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);
        $items = Item::active()->get(['id', 'sku', 'name', 'unit']);

        return Inertia::render('stock-adjustments/create', [
            'warehouses' => $warehouses,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adjustment_no' => 'nullable|string|max:100|unique:stock_adjustments,adjustment_no',
            'warehouse_id' => 'required|exists:warehouses,id',
            'adjustment_date' => 'required|date',
            'type' => 'required|in:add,subtract',
            'reason' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|numeric|min:0.01',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $adjustmentNo = $validated['adjustment_no'] ?? 'ADJ-' . now()->format('YmdHis');

            foreach ($validated['items'] as $item) {
                $adjustment = StockAdjustment::create([
                    'adjustment_no' => $adjustmentNo,
                    'warehouse_id' => $validated['warehouse_id'],
                    'item_id' => $item['item_id'],
                    'type' => $validated['type'],
                    'qty' => $item['qty'],
                    'adjustment_date' => $validated['adjustment_date'],
                    'reason' => $validated['reason'],
                    'created_by' => Auth::id(),
                    'processed_at' => now(),
                ]);

                $warehouseItem = WarehouseItem::firstOrCreate(
                    [
                        'warehouse_id' => $validated['warehouse_id'],
                        'item_id' => $item['item_id'],
                    ],
                    ['qty' => 0]
                );

                if ($validated['type'] === 'add') {
                    $warehouseItem->increment('qty', $item['qty']);
                } else {
                    $warehouseItem->decrement('qty', $item['qty']);
                }

                ItemHistory::create([
                    'item_id' => $item['item_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'adjustment',
                    'reference_type' => StockAdjustment::class,
                    'reference_id' => $adjustment->id,
                    'qty' => $validated['type'] === 'add' ? $item['qty'] : -$item['qty'],
                    'balance' => $warehouseItem->qty,
                    'notes' => "Stock adjustment ({$adjustmentNo}): {$validated['reason']}",
                    'created_by' => Auth::id(),
                ]);
            }
        });

        return redirect('/stock-adjustments')
            ->with('success', 'Stock adjustment created successfully.');
    }

    public function show($adjustmentNo)
    {
        $adjustments = StockAdjustment::with(['warehouse', 'item', 'creator'])
            ->where('adjustment_no', $adjustmentNo)
            ->get();

        if ($adjustments->isEmpty()) {
            abort(404);
        }

        $adjustmentData = [
            'adjustment_no' => $adjustments->first()->adjustment_no,
            'warehouse' => $adjustments->first()->warehouse,
            'adjustment_date' => $adjustments->first()->adjustment_date,
            'type' => $adjustments->first()->type,
            'reason' => $adjustments->first()->reason,
            'creator' => $adjustments->first()->creator,
            'created_at' => $adjustments->first()->created_at,
            'items' => $adjustments->map(function ($adjustment) {
                return [
                    'id' => $adjustment->id,
                    'item_id' => $adjustment->item_id,
                    'item' => $adjustment->item,
                    'qty' => $adjustment->qty,
                ];
            }),
        ];

        return Inertia::render('stock-adjustments/show', [
            'adjustment' => $adjustmentData,
        ]);
    }
}
