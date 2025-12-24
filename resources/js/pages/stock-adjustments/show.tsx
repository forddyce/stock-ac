import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface StockAdjustment {
    adjustment_no: string;
    adjustment_date: string;
    type: 'add' | 'subtract';
    reason: string;
    warehouse: {
        id: number;
        name: string;
        code: string;
    };
    creator: {
        id: number;
        name: string;
    };
    created_at: string;
    items: {
        id: number;
        item_id: number;
        qty: number;
        item: {
            id: number;
            sku: string;
            name: string;
            unit: string;
        };
    }[];
}

interface Props {
    adjustment: StockAdjustment;
}

export default function Show({ adjustment }: Props) {
    const getTypeBadge = (type: 'add' | 'subtract') => {
        const colors = {
            add: 'bg-green-500/10 text-green-500',
            subtract: 'bg-red-500/10 text-red-500',
        };

        const labels = {
            add: 'Add',
            subtract: 'Subtract',
        };

        return (
            <Badge variant="outline" className={colors[type]}>
                {labels[type]}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title={`Stock Adjustment ${adjustment.adjustment_no}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/stock-adjustments"
                                className="text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-semibold text-white">
                                Stock Adjustment {adjustment.adjustment_no}
                            </h1>
                            {getTypeBadge(adjustment.type)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/stock-adjustments">
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Adjustment Details */}
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Adjustment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Warehouse
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {adjustment.warehouse.name}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        {adjustment.warehouse.code}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Adjustment Date
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {new Date(
                                            adjustment.adjustment_date,
                                        ).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Type
                                    </p>
                                    <div className="mt-1">
                                        {getTypeBadge(adjustment.type)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Created By
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {adjustment.creator.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Created At
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {new Date(
                                            adjustment.created_at,
                                        ).toLocaleString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-zinc-400">
                                        Reason
                                    </p>
                                    <p className="mt-1 text-white">
                                        {adjustment.reason}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                                        <TableHead className="text-zinc-300">
                                            Item
                                        </TableHead>
                                        <TableHead className="text-right text-zinc-300">
                                            Quantity
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adjustment.items.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="border-zinc-700 hover:bg-zinc-700/50"
                                        >
                                            <TableCell className="text-white">
                                                <div>
                                                    <p className="font-medium">
                                                        {item.item.name}
                                                    </p>
                                                    <p className="text-sm text-zinc-400">
                                                        {item.item.sku} •{' '}
                                                        {item.item.unit}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-white">
                                                <span
                                                    className={
                                                        adjustment.type ===
                                                        'add'
                                                            ? 'font-semibold text-green-500'
                                                            : 'font-semibold text-red-500'
                                                    }
                                                >
                                                    {adjustment.type === 'add'
                                                        ? '+'
                                                        : '-'}
                                                    {item.qty} {item.item.unit}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
