import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';

interface Summary {
    total_sales: number;
    total_items: number;
    total_amount: number;
}

interface Props {
    summary: Summary | null;
}

export default function SalesReportSummary({ summary }: Props) {
    if (!summary) {
        return null;
    }

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-zinc-700 bg-zinc-800">
                <CardContent>
                    <div className="text-sm text-zinc-400">Total Penjualan</div>
                    <div className="mt-1 text-2xl font-bold text-white">
                        {summary.total_sales}
                    </div>
                </CardContent>
            </Card>
            <Card className="border-zinc-700 bg-zinc-800">
                <CardContent>
                    <div className="text-sm text-zinc-400">Total Item</div>
                    <div className="mt-1 text-2xl font-bold text-white">
                        {summary.total_items}
                    </div>
                </CardContent>
            </Card>
            <Card className="border-zinc-700 bg-zinc-800">
                <CardContent>
                    <div className="text-sm text-zinc-400">Total Nilai</div>
                    <div className="mt-1 text-2xl font-bold text-amber-600">
                        {formatCurrency(summary.total_amount)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
