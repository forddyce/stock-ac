<?php

namespace App\Http\Controllers;

use App\Exports\SalesReportExport;
use App\Models\ItemHistory;
use App\Models\Sale;
use App\Models\SalesPerson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_reports', ['only' => ['salesReport', 'exportSales', 'stockReport']]);
        $this->middleware('permission:view_item_history', ['only' => ['itemHistory']]);
    }

    public function salesReport(Request $request)
    {
        $salesPersons = SalesPerson::active()->get(['id', 'code', 'name']);

        $sales = null;
        $summary = null;

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query = Sale::with(['customer', 'salesPerson', 'items.item'])
                ->whereDate('sale_date', '>=', $request->from_date)
                ->whereDate('sale_date', '<=', $request->to_date);

            if ($request->filled('sales_person_id') && $request->sales_person_id !== 'all') {
                $query->where('sales_person_id', $request->sales_person_id);
            }

            $sales = $query->orderBy('sale_date', 'desc')
                ->orderBy('invoice_no', 'desc')
                ->get();

            $summary = [
                'total_sales' => $sales->count(),
                'total_items' => $sales->sum(function ($sale) {
                    return $sale->items->sum('qty_ordered');
                }),
                'total_amount' => $sales->sum('total'),
            ];
        }

        return Inertia::render('reports/sales-report', [
            'salesPersons' => $salesPersons,
            'sales' => $sales,
            'summary' => $summary,
            'filters' => $request->only(['from_date', 'to_date', 'sales_person_id']),
        ]);
    }

    public function exportSales(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);

        $query = Sale::with(['customer', 'salesPerson', 'items.item'])
            ->whereDate('sale_date', '>=', $request->from_date)
            ->whereDate('sale_date', '<=', $request->to_date);

        if ($request->filled('sales_person_id') && $request->sales_person_id !== 'all') {
            $query->where('sales_person_id', $request->sales_person_id);
        }

        $sales = $query->orderBy('sale_date', 'desc')
            ->orderBy('invoice_no', 'desc')
            ->get();

        $filename = 'sales-report-' . $request->from_date . '-to-' . $request->to_date . '.xlsx';

        return Excel::download(new SalesReportExport($sales), $filename);
    }

    public function itemHistory(Request $request)
    {
        $items = \App\Models\Item::active()->orderBy('code')->get(['id', 'code', 'name']);
        $warehouses = \App\Models\Warehouse::active()->orderBy('code')->get(['id', 'code', 'name']);

        $query = ItemHistory::with(['item', 'warehouse', 'creator'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->filled('item_id') && $request->item_id !== 'all') {
            $query->where('item_id', $request->item_id);
        }

        if ($request->filled('warehouse_id') && $request->warehouse_id !== 'all') {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        if ($request->filled('transaction_type') && $request->transaction_type !== 'all') {
            $query->where('transaction_type', $request->transaction_type);
        }

        $history = $query->paginate(50)->withQueryString();

        return Inertia::render('reports/item-history', [
            'items' => $items,
            'warehouses' => $warehouses,
            'history' => $history,
            'filters' => $request->only(['from_date', 'to_date', 'item_id', 'warehouse_id', 'transaction_type']),
        ]);
    }

    public function stockReport(Request $request)
    {
        $query = \App\Models\WarehouseItem::with(['warehouse', 'item'])
            ->join('items', 'warehouse_items.item_id', '=', 'items.id')
            ->select('warehouse_items.*');

        if ($warehouseId = $request->input('warehouse_id')) {
            if ($warehouseId !== 'all') {
                $query->where('warehouse_items.warehouse_id', $warehouseId);
            }
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('items.code', 'like', "%{$search}%")
                    ->orWhere('items.name', 'like', "%{$search}%");
            });
        }

        $query->orderBy('items.code', 'asc');

        $stockItems = $query->paginate(20)->withQueryString();

        $warehouses = \App\Models\Warehouse::active()->get(['id', 'code', 'name']);

        $totalItems = $stockItems->total();
        $totalStock = \App\Models\WarehouseItem::when($request->input('warehouse_id'), function ($q, $warehouseId) {
            if ($warehouseId !== 'all') {
                $q->where('warehouse_id', $warehouseId);
            }
        })->sum('stock');

        return Inertia::render('reports/stock', [
            'stockItems' => $stockItems,
            'warehouses' => $warehouses,
            'totals' => [
                'totalItems' => $totalItems,
                'totalStock' => $totalStock,
            ],
            'filters' => $request->only(['warehouse_id', 'search']),
        ]);
    }
}
