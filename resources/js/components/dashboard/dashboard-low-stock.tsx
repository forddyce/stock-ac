import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface LowStockItem {
    code: string;
    name: string;
    warehouse_code: string;
    warehouse_name: string;
    qty: number;
    min_stock: number;
}

interface Props {
    items: LowStockItem[];
}

export default function DashboardLowStock({ items }: Props) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Low Stock Alert
                    </CardTitle>
                    {items.length > 0 && (
                        <Badge variant="destructive">{items.length}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b border-zinc-700 pb-3 last:border-0"
                            >
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {item.code} • {item.warehouse_name}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-red-500">
                                        {Number(item.qty).toLocaleString(
                                            'id-ID',
                                        )}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Min:{' '}
                                        {Number(item.min_stock).toLocaleString(
                                            'id-ID',
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-zinc-500">
                        Semua item memiliki stok yang cukup
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
