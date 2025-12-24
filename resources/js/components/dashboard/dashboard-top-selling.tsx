import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';
import { TrendingUp } from 'lucide-react';

interface TopSellingItem {
    code: string;
    name: string;
    total_qty: number;
    total_amount: number;
}

interface Props {
    items: TopSellingItem[];
}

export default function DashboardTopSelling({ items }: Props) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Top Selling Items (Bulan Ini)
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b border-zinc-700 pb-3 last:border-0"
                            >
                                <div className="flex flex-1 items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20 text-sm font-bold text-amber-600">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            {item.code}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-white">
                                        {Number(item.total_qty).toLocaleString(
                                            'id-ID',
                                        )}{' '}
                                        pcs
                                    </div>
                                    <div className="text-xs text-amber-600">
                                        {formatCurrency(item.total_amount)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-zinc-500">
                        Belum ada data penjualan
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
