import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';
import { Package, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';

interface Stats {
    sales_today: number;
    sales_this_month: number;
    sales_count: number;
    purchases_today: number;
    purchases_this_month: number;
}

interface Props {
    stats: Stats;
}

export default function DashboardStats({ stats }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Penjualan Hari Ini
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(stats.sales_today)}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                        {stats.sales_count} transaksi
                    </p>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Penjualan Bulan Ini
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(stats.sales_this_month)}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Pembelian Hari Ini
                    </CardTitle>
                    <Package className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(stats.purchases_today)}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Pembelian Bulan Ini
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(stats.purchases_this_month)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
