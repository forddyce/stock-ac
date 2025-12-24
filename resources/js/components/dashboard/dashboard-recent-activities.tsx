import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Activity } from 'lucide-react';

interface RecentActivity {
    id: number;
    type: string;
    item_name: string;
    warehouse_name: string;
    qty_change: number;
    user_name: string;
    created_at: string;
}

interface Props {
    activities: RecentActivity[];
}

const activityTypes: Record<string, { label: string; color: string }> = {
    purchase: { label: 'Purchase', color: 'text-blue-500' },
    sale: { label: 'Sale', color: 'text-green-500' },
    transfer_out: { label: 'Transfer Out', color: 'text-orange-500' },
    transfer_in: { label: 'Transfer In', color: 'text-purple-500' },
    adjustment: { label: 'Adjustment', color: 'text-yellow-500' },
};

export default function DashboardRecentActivities({ activities }: Props) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-amber-600" />
                    Aktivitas Terakhir
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {activities.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-700 hover:bg-zinc-800">
                                <TableHead className="text-zinc-300">
                                    Jenis
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Item
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Gudang
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Perubahan
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    User
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Waktu
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow
                                    key={activity.id}
                                    className="border-zinc-700"
                                >
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                activityTypes[activity.type]
                                                    ?.color || 'text-zinc-500'
                                            }
                                        >
                                            {activityTypes[activity.type]
                                                ?.label || activity.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {activity.item_name}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {activity.warehouse_name}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-semibold ${
                                            Number(activity.qty_change) > 0
                                                ? 'text-green-500'
                                                : Number(activity.qty_change) <
                                                    0
                                                  ? 'text-red-500'
                                                  : 'text-zinc-500'
                                        }`}
                                    >
                                        {Number(activity.qty_change) > 0
                                            ? '+'
                                            : ''}
                                        {Number(
                                            activity.qty_change,
                                        ).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {activity.user_name}
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-400">
                                        {activity.created_at}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="py-12 text-center text-zinc-500">
                        Belum ada aktivitas
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
