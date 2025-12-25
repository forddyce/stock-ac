import ConfirmDialog from '@/components/ConfirmDialog';
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
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRightLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Transfer {
    transfer_no: string;
    transfer_date: string;
    status: 'pending' | 'in_transit' | 'complete';
    notes: string;
    from_warehouse: {
        id: number;
        name: string;
        code: string;
    };
    to_warehouse: {
        id: number;
        name: string;
        code: string;
    };
    creator: {
        id: number;
        name: string;
    };
    items: {
        id: number;
        item_id: number;
        qty_requested: number;
        qty_sent: number;
        qty_received: number;
        status: 'pending' | 'in_transit' | 'complete';
        item: {
            id: number;
            code: string;
            name: string;
            unit: string;
        };
    }[];
}

interface Props {
    transfer: Transfer;
}

export default function Show({ transfer }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const getStatusColor = (status: 'pending' | 'in_transit' | 'complete') => {
        switch (status) {
            case 'complete':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'in_transit':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const handleDelete = () => {
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        router.delete(`/transfers/${transfer.transfer_no}`);
        setConfirmOpen(false);
    };

    return (
        <AppLayout>
            <Head title={`Transfer ${transfer.transfer_no}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/transfers"
                                className="text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-semibold text-white">
                                Transfer {transfer.transfer_no}
                            </h1>
                            <Badge className={getStatusColor(transfer.status)}>
                                {transfer.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {transfer.status !== 'complete' && (
                            <Link
                                href={`/transfers/${transfer.transfer_no}/process`}
                            >
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <ArrowRightLeft className="mr-1 h-4 w-4" />
                                    Process Transfer
                                </Button>
                            </Link>
                        )}
                        {transfer.status !== 'complete' && (
                            <Link
                                href={`/transfers/${transfer.transfer_no}/edit`}
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                >
                                    <Edit className="mr-1 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDelete}
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Transfer Details */}
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Transfer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        From Warehouse
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {transfer.from_warehouse.name}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        {transfer.from_warehouse.code}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        To Warehouse
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {transfer.to_warehouse.name}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        {transfer.to_warehouse.code}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Transfer Date
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {new Date(
                                            transfer.transfer_date,
                                        ).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">
                                        Created By
                                    </p>
                                    <p className="mt-1 font-medium text-white">
                                        {transfer.creator.name}
                                    </p>
                                </div>
                                {transfer.notes && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-zinc-400">
                                            Notes
                                        </p>
                                        <p className="mt-1 text-white">
                                            {transfer.notes}
                                        </p>
                                    </div>
                                )}
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
                                            Requested
                                        </TableHead>
                                        <TableHead className="text-right text-zinc-300">
                                            Sent
                                        </TableHead>
                                        <TableHead className="text-right text-zinc-300">
                                            Received
                                        </TableHead>
                                        <TableHead className="text-center text-zinc-300">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transfer.items.map((item) => (
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
                                                        {item.item.code} •{' '}
                                                        {item.item.unit}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-white">
                                                {item.qty_requested}{' '}
                                                {item.item.unit}
                                            </TableCell>
                                            <TableCell className="text-right text-white">
                                                <span
                                                    className={
                                                        item.qty_sent > 0
                                                            ? 'font-semibold text-blue-500'
                                                            : ''
                                                    }
                                                >
                                                    {item.qty_sent}{' '}
                                                    {item.item.unit}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-white">
                                                <span
                                                    className={
                                                        item.qty_received > 0
                                                            ? 'font-semibold text-green-500'
                                                            : ''
                                                    }
                                                >
                                                    {item.qty_received}{' '}
                                                    {item.item.unit}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={getStatusColor(
                                                        item.status,
                                                    )}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Transfer"
                    description="Are you sure you want to delete this transfer? This will reverse any stock changes."
                />
            </div>
        </AppLayout>
    );
}
