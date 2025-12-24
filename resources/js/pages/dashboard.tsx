import DashboardLowStock from '@/components/dashboard/dashboard-low-stock';
import DashboardPending from '@/components/dashboard/dashboard-pending';
import DashboardRecentActivities from '@/components/dashboard/dashboard-recent-activities';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardTopSelling from '@/components/dashboard/dashboard-top-selling';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Stats {
    sales_today: number;
    sales_this_month: number;
    sales_count: number;
    purchases_today: number;
    purchases_this_month: number;
    pending_purchases: number;
    pending_sales: number;
    pending_transfers: number;
}

interface LowStockItem {
    code: string;
    name: string;
    warehouse_code: string;
    warehouse_name: string;
    qty: number;
    min_stock: number;
}

interface RecentActivity {
    id: number;
    type: string;
    item_name: string;
    warehouse_name: string;
    qty_change: number;
    user_name: string;
    created_at: string;
}

interface TopSellingItem {
    code: string;
    name: string;
    total_qty: number;
    total_amount: number;
}

interface Props {
    stats: Stats;
    lowStockItems: LowStockItem[];
    recentActivities: RecentActivity[];
    topSellingItems: TopSellingItem[];
}

export default function Dashboard({
    stats,
    lowStockItems,
    recentActivities,
    topSellingItems,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <DashboardStats stats={stats} />

                <DashboardPending stats={stats} />

                <div className="grid gap-6 md:grid-cols-2">
                    <DashboardLowStock items={lowStockItems} />
                    <DashboardTopSelling items={topSellingItems} />
                </div>

                <DashboardRecentActivities activities={recentActivities} />
            </div>
        </AppLayout>
    );
}
