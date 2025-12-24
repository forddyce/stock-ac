<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemHistory;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Transfer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $salesToday = Sale::whereDate('sale_date', $today)->sum('total');
        $salesThisMonth = Sale::whereDate('sale_date', '>=', $thisMonth)->sum('total');
        $salesCount = Sale::whereDate('sale_date', $today)->count();

        $purchasesToday = Purchase::whereDate('purchase_date', $today)->sum('total');
        $purchasesThisMonth = Purchase::whereDate('purchase_date', '>=', $thisMonth)->sum('total');

        $pendingPurchases = Purchase::where('status', 'pending')->count();
        $pendingSales = Sale::where('status', 'pending')->count();
        $pendingTransfers = Transfer::where('status', 'pending')->count();

        $lowStockItems = DB::table('warehouse_items as wi')
            ->join('items as i', 'wi.item_id', '=', 'i.id')
            ->join('warehouses as w', 'wi.warehouse_id', '=', 'w.id')
            ->select(
                'i.code',
                'i.name',
                'w.code as warehouse_code',
                'w.name as warehouse_name',
                'wi.stock',
                'i.min_stock'
            )
            ->whereRaw('wi.stock <= i.min_stock')
            ->where('i.is_active', true)
            ->where('w.is_active', true)
            ->whereNull('i.deleted_at')
            ->whereNull('w.deleted_at')
            ->orderBy('wi.stock', 'asc')
            ->limit(10)
            ->get();

        $recentActivities = ItemHistory::with(['item', 'warehouse', 'creator'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'type' => $history->transaction_type,
                    'item_name' => $history->item->name,
                    'warehouse_name' => $history->warehouse->name,
                    'qty_change' => $history->qty_change,
                    'user_name' => $history->creator->name,
                    'created_at' => $history->created_at->diffForHumans(),
                ];
            });

        $topSellingItems = DB::table('sale_items as si')
            ->join('sales as s', 'si.sale_id', '=', 's.id')
            ->join('items as i', 'si.item_id', '=', 'i.id')
            ->select(
                'i.code',
                'i.name',
                DB::raw('SUM(si.qty_ordered) as total_qty'),
                DB::raw('SUM(si.subtotal) as total_amount')
            )
            ->whereDate('s.sale_date', '>=', $thisMonth)
            ->groupBy('i.id', 'i.code', 'i.name')
            ->orderBy('total_qty', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'sales_today' => $salesToday,
                'sales_this_month' => $salesThisMonth,
                'sales_count' => $salesCount,
                'purchases_today' => $purchasesToday,
                'purchases_this_month' => $purchasesThisMonth,
                'pending_purchases' => $pendingPurchases,
                'pending_sales' => $pendingSales,
                'pending_transfers' => $pendingTransfers,
            ],
            'lowStockItems' => $lowStockItems,
            'recentActivities' => $recentActivities,
            'topSellingItems' => $topSellingItems,
        ]);
    }
}
