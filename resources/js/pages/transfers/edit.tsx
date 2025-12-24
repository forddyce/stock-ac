import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Warehouse {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    sku: string;
    unit: string;
}

interface TransferItem {
    item_id: string;
    qty_requested: string;
}

interface Transfer {
    transfer_no: string;
    from_warehouse_id: number;
    to_warehouse_id: number;
    transfer_date: string;
    notes: string;
    items: {
        item_id: number;
        qty_requested: number;
        qty_sent: number;
    }[];
}

interface Props {
    transfer: Transfer;
    warehouses: Warehouse[];
    items: Item[];
}

export default function Edit({ transfer, warehouses, items }: Props) {
    const [formData, setFormData] = useState({
        from_warehouse_id: transfer.from_warehouse_id.toString(),
        to_warehouse_id: transfer.to_warehouse_id.toString(),
        transfer_date: transfer.transfer_date,
        notes: transfer.notes || '',
    });

    const [transferItems, setTransferItems] = useState<TransferItem[]>(
        transfer.items.map((item) => ({
            item_id: item.item_id.toString(),
            qty_requested: item.qty_requested.toString(),
        })),
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const hasItemsSent = transfer.items.some((item) => item.qty_sent > 0);

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleItemChange = (
        index: number,
        field: keyof TransferItem,
        value: string,
    ) => {
        const newItems = [...transferItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setTransferItems(newItems);
    };

    const handleAddItem = () => {
        setTransferItems([
            ...transferItems,
            { item_id: '', qty_requested: '' },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        if (transferItems.length > 1) {
            setTransferItems(transferItems.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            formData.from_warehouse_id &&
            formData.to_warehouse_id &&
            formData.from_warehouse_id === formData.to_warehouse_id
        ) {
            setErrors({
                to_warehouse_id:
                    'Destination warehouse must be different from source warehouse',
            });
            return;
        }

        const data = {
            from_warehouse_id: parseInt(formData.from_warehouse_id),
            to_warehouse_id: parseInt(formData.to_warehouse_id),
            transfer_date: formData.transfer_date,
            notes: formData.notes,
            items: transferItems.map((item) => ({
                item_id: parseInt(item.item_id),
                qty_requested: parseFloat(item.qty_requested),
            })),
            _method: 'PUT',
        };

        router.post(`/transfers/${transfer.transfer_no}`, data, {
            onError: (errors) => setErrors(errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Transfer" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Edit Transfer {transfer.transfer_no}
                    </h1>
                    {hasItemsSent && (
                        <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-500">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p>
                                Note: Editing will reverse any sent stock and
                                reset all items to pending status
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        {/* Transfer Details Card */}
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Transfer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label
                                            htmlFor="transfer_no"
                                            className="text-zinc-200"
                                        >
                                            Transfer Number
                                        </Label>
                                        <Input
                                            id="transfer_no"
                                            value={transfer.transfer_no}
                                            className="border-zinc-700 bg-zinc-900 text-zinc-500"
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="transfer_date"
                                            className="text-zinc-200"
                                        >
                                            Transfer Date *
                                        </Label>
                                        <Input
                                            id="transfer_date"
                                            type="date"
                                            value={formData.transfer_date}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'transfer_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-zinc-700 bg-zinc-900 text-white"
                                        />
                                        {errors.transfer_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.transfer_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="from_warehouse_id"
                                            className="text-zinc-200"
                                        >
                                            From Warehouse *
                                        </Label>
                                        <Select
                                            value={formData.from_warehouse_id}
                                            onValueChange={(value) =>
                                                handleFormChange(
                                                    'from_warehouse_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                                <SelectValue placeholder="Select source warehouse" />
                                            </SelectTrigger>
                                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem
                                                        key={warehouse.id}
                                                        value={warehouse.id.toString()}
                                                    >
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.from_warehouse_id && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.from_warehouse_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="to_warehouse_id"
                                            className="text-zinc-200"
                                        >
                                            To Warehouse *
                                        </Label>
                                        <Select
                                            value={formData.to_warehouse_id}
                                            onValueChange={(value) =>
                                                handleFormChange(
                                                    'to_warehouse_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                                <SelectValue placeholder="Select destination warehouse" />
                                            </SelectTrigger>
                                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem
                                                        key={warehouse.id}
                                                        value={warehouse.id.toString()}
                                                    >
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.to_warehouse_id && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.to_warehouse_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label
                                            htmlFor="notes"
                                            className="text-zinc-200"
                                        >
                                            Notes
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-zinc-700 bg-zinc-900 text-white"
                                            placeholder="Optional notes about this transfer"
                                            rows={3}
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Card */}
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    <span>Items</span>
                                    <Button
                                        type="button"
                                        onClick={handleAddItem}
                                        size="sm"
                                        className="bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transferItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid items-start gap-4 md:grid-cols-12"
                                        >
                                            <div className="md:col-span-8">
                                                <Label className="text-xs text-zinc-200">
                                                    Item *
                                                </Label>
                                                <Select
                                                    value={item.item_id}
                                                    onValueChange={(value) =>
                                                        handleItemChange(
                                                            index,
                                                            'item_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                                        <SelectValue placeholder="Select item" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-zinc-700 bg-zinc-900">
                                                        {items.map((itm) => (
                                                            <SelectItem
                                                                key={itm.id}
                                                                value={itm.id.toString()}
                                                            >
                                                                {itm.sku} -{' '}
                                                                {itm.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors[
                                                    `items.${index}.item_id`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors[
                                                                `items.${index}.item_id`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:col-span-3">
                                                <Label className="text-xs text-zinc-200">
                                                    Quantity Requested *
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={item.qty_requested}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            'qty_requested',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-zinc-700 bg-zinc-900 text-white"
                                                    placeholder="0"
                                                    min="0"
                                                    step="1"
                                                />
                                                {errors[
                                                    `items.${index}.qty_requested`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors[
                                                                `items.${index}.qty_requested`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-end md:col-span-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRemoveItem(index)
                                                    }
                                                    disabled={
                                                        transferItems.length ===
                                                        1
                                                    }
                                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/transfers')}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Update Transfer
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
