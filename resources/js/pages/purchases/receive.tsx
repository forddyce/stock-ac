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

interface Purchase {
    id: number;
    invoice_no: string;
    purchase_date: string;
    status: 'pending' | 'partial' | 'complete' | 'cancelled';
    supplier: {
        id: number;
        name: string;
        code: string;
    };
    warehouse: {
        id: number;
        name: string;
        code: string;
    };
    items: {
        id: number;
        item_id: number;
        qty_ordered: number;
        qty_received: number;
        cost: number;
        status: 'pending' | 'partial' | 'complete';
        item: {
            id: number;
            code: string;
            name: string;
            unit: string;
        };
    }[];
}

interface ReceiveItem {
    id: number;
    qty_to_receive: string;
    notes: string;
}

interface Props {
    purchase: Purchase;
}

export default function Receive({ purchase }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>(
        purchase.items.map((item) => ({
            id: item.id,
            qty_to_receive: '',
            notes: '',
        })),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleItemChange = (
        index: number,
        field: keyof ReceiveItem,
        value: string,
    ) => {
        const newItems = [...receiveItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setReceiveItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const itemsToReceive = receiveItems.filter(
            (item) => parseFloat(item.qty_to_receive) > 0,
        );

        if (itemsToReceive.length === 0) {
            enqueueSnackbar('Please enter at least one quantity to receive.', {
                variant: 'warning',
            });
            return;
        }

        const data = {
            items: itemsToReceive.map((item) => ({
                id: item.id,
                qty_to_receive: parseFloat(item.qty_to_receive),
                notes: item.notes,
            })),
        };

        router.post(`/purchases/${purchase.id}/receive`, data, {
            onError: (errors) => setErrors(errors),
        });
    };

    const getStatusColor = (
        status: 'pending' | 'partial' | 'complete' | 'cancelled',
    ) => {
        switch (status) {
            case 'complete':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'partial':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <AppLayout>
            <Head
                title={`Receive Purchase ${purchase.invoice_no || '#' + purchase.id}`}
            />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/purchases/${purchase.id}`}
                            className="text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                Receive Purchase{' '}
                                {purchase.invoice_no || '#' + purchase.id}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-400">
                                {purchase.supplier.name} →{' '}
                                {purchase.warehouse.name}
                            </p>
                        </div>
                        <Badge className={getStatusColor(purchase.status)}>
                            {purchase.status}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Receive Items
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
                                                Ordered
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Already Received
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Remaining
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Received Now
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Notes
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchase.items.map((item, index) => {
                                            const remaining =
                                                item.qty_ordered -
                                                item.qty_received;
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
                                                                {item.item.code}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-white">
                                                        {item.qty_ordered}{' '}
                                                        {item.item.unit}
                                                    </TableCell>
                                                    <TableCell className="text-right text-white">
                                                        <span className="font-semibold text-green-500">
                                                            {item.qty_received}{' '}
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
                                                                receiveItems[
                                                                    index
                                                                ]
                                                                    ?.qty_to_receive
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'qty_to_receive',
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
                                                            `items.${index}.qty_to_receive`
                                                        ] && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {
                                                                    errors[
                                                                        `items.${index}.qty_to_receive`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Textarea
                                                            value={
                                                                receiveItems[
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
                            <Link href={`/purchases/${purchase.id}`}>
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
                                Process Receive
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
