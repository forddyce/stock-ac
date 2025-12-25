<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_item_history');
    }

    public function index(Request $request)
    {
        $query = ItemHistory::with(['item', 'warehouse', 'creator']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('item', function ($itemQuery) use ($search) {
                    $itemQuery->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                })
                ->orWhere('reference_id', 'like', "%{$search}%")
                ->orWhere('batch_id', 'like', "%{$search}%");
            });
        }

        if ($fromDate = $request->input('from_date')) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate = $request->input('to_date')) {
            $query->whereDate('created_at', '<=', $toDate);
        }

        if ($transactionType = $request->input('transaction_type')) {
            $query->where('transaction_type', $transactionType);
        }

        if ($itemId = $request->input('item_id')) {
            $query->where('item_id', $itemId);
        }

        if ($warehouseId = $request->input('warehouse_id')) {
            $query->where('warehouse_id', $warehouseId);
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $histories = $query->paginate(20)->withQueryString();

        $items = Item::active()->get(['id', 'code', 'name']);
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);

        return Inertia::render('item-history/index', [
            'histories' => $histories,
            'items' => $items,
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'from_date', 'to_date', 'transaction_type', 'item_id', 'warehouse_id', 'sort_by', 'sort_order']),
        ]);
    }

    public function show($id)
    {
        $history = ItemHistory::with(['item', 'warehouse', 'creator'])->findOrFail($id);

        return Inertia::render('item-history/show', [
            'history' => $history,
        ]);
    }
}
