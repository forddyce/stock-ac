import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowRight, Clock } from 'lucide-react';

interface Stats {
    pending_purchases: number;
    pending_sales: number;
    pending_transfers: number;
}

interface Props {
    stats: Stats;
}

export default function DashboardPending({ stats }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Pending Purchases
                    </CardTitle>
                    <Clock className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                        {stats.pending_purchases}
                    </div>
                    <Link href="/purchases">
                        <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-xs text-amber-600 hover:text-amber-500"
                        >
                            Lihat detail <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Pending Sales
                    </CardTitle>
                    <Clock className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                        {stats.pending_sales}
                    </div>
                    <Link href="/sales">
                        <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-xs text-amber-600 hover:text-amber-500"
                        >
                            Lihat detail <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Pending Transfers
                    </CardTitle>
                    <Clock className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                        {stats.pending_transfers}
                    </div>
                    <Link href="/transfers">
                        <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-xs text-amber-600 hover:text-amber-500"
                        >
                            Lihat detail <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
