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
        $this->middleware('permission:view_sale', ['only' => ['salesReport', 'exportSales']]);
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

            if ($request->filled('sales_person_id')) {
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

        if ($request->filled('sales_person_id')) {
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

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        if ($request->filled('transaction_type')) {
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
}
