import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

interface Transfer {
    transfer_no: string;
    transfer_date: string;
    status: 'pending' | 'in_transit' | 'complete';
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
    items: {
        id: number;
        item_id: number;
        qty_requested: number;
        qty_sent: number;
        status: 'pending' | 'in_transit' | 'complete';
        item: {
            id: number;
            sku: string;
            name: string;
            unit: string;
        };
    }[];
}

interface ProcessItem {
    id: number;
    qty_to_transfer: string;
    notes: string;
}

interface Props {
    transfer: Transfer;
}

export default function Process({ transfer }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const [processItems, setProcessItems] = useState<ProcessItem[]>(
        transfer.items.map((item) => ({
            id: item.id,
            qty_to_transfer: '',
            notes: '',
        })),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleItemChange = (
        index: number,
        field: keyof ProcessItem,
        value: string,
    ) => {
        const newItems = [...processItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setProcessItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const itemsToProcess = processItems.filter(
            (item) => parseFloat(item.qty_to_transfer) > 0,
        );

        if (itemsToProcess.length === 0) {
            enqueueSnackbar('Please enter at least one quantity to transfer.', {
                variant: 'warning',
            });
            return;
        }

        const data = {
            items: itemsToProcess.map((item) => ({
                id: item.id,
                qty_to_transfer: parseFloat(item.qty_to_transfer),
                notes: item.notes,
            })),
        };

        router.post(`/transfers/${transfer.transfer_no}/process`, data, {
            onError: (errors) => setErrors(errors),
        });
    };

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

    return (
        <AppLayout>
            <Head title={`Process Transfer ${transfer.transfer_no}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/transfers/${transfer.transfer_no}`}
                            className="text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                Process Transfer {transfer.transfer_no}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-400">
                                {transfer.from_warehouse.name} →{' '}
                                {transfer.to_warehouse.name}
                            </p>
                        </div>
                        <Badge className={getStatusColor(transfer.status)}>
                            {transfer.status}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Transfer Items
                                </CardTitle>
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
                                                Already Sent
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Remaining
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Transfer Now
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Notes
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transfer.items.map((item, index) => {
                                            const remaining =
                                                item.qty_requested -
                                                item.qty_sent;
                                            const isComplete =
                                                item.status === 'complete';

                                            return (
                                                <TableRow
                                                    key={item.id}
                                                    className="border-zinc-700"
                                                >
                                                    <TableCell className="text-white">
                                                        <div>
                                                            <p className="font-medium">
                                                                {item.item.name}
                                                            </p>
                                                            <p className="text-sm text-zinc-400">
                                                                {item.item.sku}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-white">
                                                        {item.qty_requested}{' '}
                                                        {item.item.unit}
                                                    </TableCell>
                                                    <TableCell className="text-right text-white">
                                                        <span className="font-semibold text-blue-500">
                                                            {item.qty_sent}{' '}
                                                            {item.item.unit}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right text-white">
                                                        <span
                                                            className={
                                                                remaining === 0
                                                                    ? 'text-zinc-500'
                                                                    : 'font-semibold text-amber-500'
                                                            }
                                                        >
                                                            {remaining}{' '}
                                                            {item.item.unit}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                processItems[
                                                                    index
                                                                ]
                                                                    ?.qty_to_transfer
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'qty_to_transfer',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-24 border-zinc-700 bg-zinc-900 text-white"
                                                            placeholder="0"
                                                            min="0"
                                                            max={remaining}
                                                            step="1"
                                                            disabled={
                                                                isComplete
                                                            }
                                                        />
                                                        {errors[
                                                            `items.${index}.qty_to_transfer`
                                                        ] && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {
                                                                    errors[
                                                                        `items.${index}.qty_to_transfer`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Textarea
                                                            value={
                                                                processItems[
                                                                    index
                                                                ]?.notes
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'notes',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="min-w-[200px] border-zinc-700 bg-zinc-900 text-white"
                                                            placeholder="Optional notes"
                                                            rows={2}
                                                            disabled={
                                                                isComplete
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Link href={`/transfers/${transfer.transfer_no}`}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Process Transfer
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
