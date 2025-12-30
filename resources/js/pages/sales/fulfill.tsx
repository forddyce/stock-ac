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
import { ArrowLeft, CheckCheck } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

interface Sale {
    id: number;
    invoice_no: string;
    sale_date: string;
    status: 'pending' | 'partial' | 'complete' | 'cancelled';
    customer: {
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
        qty_fulfilled: number;
        price: number;
        status: 'pending' | 'partial' | 'complete';
        item: {
            id: number;
            code: string;
            name: string;
            unit: string;
        };
    }[];
}

interface FulfillItem {
    id: number;
    qty_to_fulfill: string;
    notes: string;
}

interface Props {
    sale: Sale;
}

export default function Fulfill({ sale }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const [fulfillItems, setFulfillItems] = useState<FulfillItem[]>(
        sale.items.map((item) => ({
            id: item.id,
            qty_to_fulfill: '',
            notes: '',
        })),
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleItemChange = (
        index: number,
        field: keyof FulfillItem,
        value: string,
    ) => {
        const newItems = [...fulfillItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFulfillItems(newItems);
    };

    const handleAutoFillRemaining = (index: number) => {
        const item = sale.items[index];
        const remaining = item.qty_ordered - item.qty_fulfilled;
        handleItemChange(index, 'qty_to_fulfill', remaining.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const itemsToFulfill = fulfillItems.filter(
            (item) => parseFloat(item.qty_to_fulfill) > 0,
        );

        if (itemsToFulfill.length === 0) {
            enqueueSnackbar('Please enter at least one quantity to fulfill.', {
                variant: 'warning',
            });
            return;
        }

        const data = {
            items: itemsToFulfill.map((item) => ({
                id: item.id,
                qty_to_fulfill: parseFloat(item.qty_to_fulfill),
                notes: item.notes,
            })),
        };

        router.post(`/sales/${sale.id}/fulfill`, data, {
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
            <Head title={`Fulfill Sale ${sale.invoice_no || '#' + sale.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/sales/${sale.id}`}
                            className="text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                Fulfill Sale {sale.invoice_no || '#' + sale.id}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-400">
                                {sale.customer.name} ← {sale.warehouse.name}
                            </p>
                        </div>
                        <Badge className={getStatusColor(sale.status)}>
                            {sale.status}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Fulfill Items
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
                                                Already Fulfilled
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Remaining
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Fulfill Now
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Notes
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sale.items.map((item, index) => {
                                            const remaining =
                                                item.qty_ordered -
                                                item.qty_fulfilled;
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
                                                            {item.qty_fulfilled}{' '}
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
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    fulfillItems[
                                                                        index
                                                                    ]
                                                                        ?.qty_to_fulfill
                                                                }
                                                                onChange={(e) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        'qty_to_fulfill',
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
                                                            {!isComplete &&
                                                                remaining >
                                                                    0 && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            handleAutoFillRemaining(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                                        title="Auto-fill with remaining quantity"
                                                                    >
                                                                        <CheckCheck className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                        </div>
                                                        {errors[
                                                            `items.${index}.qty_to_fulfill`
                                                        ] && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {
                                                                    errors[
                                                                        `items.${index}.qty_to_fulfill`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Textarea
                                                            value={
                                                                fulfillItems[
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
                            <Link href={`/sales/${sale.id}`}>
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
                                Process Fulfill
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
