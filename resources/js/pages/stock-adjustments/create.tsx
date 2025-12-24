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
import { Plus, Trash2 } from 'lucide-react';
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

interface AdjustmentItem {
    item_id: string;
    qty: string;
}

interface Props {
    warehouses: Warehouse[];
    items: Item[];
}

export default function Create({ warehouses, items }: Props) {
    const [formData, setFormData] = useState({
        adjustment_no: '',
        warehouse_id: '',
        adjustment_date: new Date().toISOString().split('T')[0],
        type: '',
        reason: '',
    });

    const [adjustmentItems, setAdjustmentItems] = useState<AdjustmentItem[]>([
        { item_id: '', qty: '' },
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleItemChange = (
        index: number,
        field: keyof AdjustmentItem,
        value: string,
    ) => {
        const newItems = [...adjustmentItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setAdjustmentItems(newItems);
    };

    const handleAddItem = () => {
        setAdjustmentItems([...adjustmentItems, { item_id: '', qty: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        if (adjustmentItems.length > 1) {
            setAdjustmentItems(adjustmentItems.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            adjustment_no: formData.adjustment_no || undefined,
            warehouse_id: parseInt(formData.warehouse_id),
            adjustment_date: formData.adjustment_date,
            type: formData.type,
            reason: formData.reason,
            items: adjustmentItems.map((item) => ({
                item_id: parseInt(item.item_id),
                qty: parseFloat(item.qty),
            })),
        };

        router.post('/stock-adjustments', data, {
            onError: (errors) => setErrors(errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Stock Adjustment" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Create Stock Adjustment
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        {/* Adjustment Details Card */}
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Adjustment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label
                                            htmlFor="adjustment_no"
                                            className="text-zinc-200"
                                        >
                                            Adjustment Number
                                        </Label>
                                        <Input
                                            id="adjustment_no"
                                            value={formData.adjustment_no}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'adjustment_no',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-zinc-700 bg-zinc-900 text-white"
                                            placeholder="Auto-generated if left empty"
                                        />
                                        {errors.adjustment_no && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.adjustment_no}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="adjustment_date"
                                            className="text-zinc-200"
                                        >
                                            Adjustment Date *
                                        </Label>
                                        <Input
                                            id="adjustment_date"
                                            type="date"
                                            value={formData.adjustment_date}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'adjustment_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-zinc-700 bg-zinc-900 text-white"
                                        />
                                        {errors.adjustment_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.adjustment_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="warehouse_id"
                                            className="text-zinc-200"
                                        >
                                            Warehouse *
                                        </Label>
                                        <Select
                                            value={formData.warehouse_id}
                                            onValueChange={(value) =>
                                                handleFormChange(
                                                    'warehouse_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                                <SelectValue placeholder="Select warehouse" />
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
                                        {errors.warehouse_id && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.warehouse_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="type"
                                            className="text-zinc-200"
                                        >
                                            Type *
                                        </Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) =>
                                                handleFormChange('type', value)
                                            }
                                        >
                                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                                <SelectItem value="add">
                                                    Add Stock
                                                </SelectItem>
                                                <SelectItem value="subtract">
                                                    Subtract Stock
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label
                                            htmlFor="reason"
                                            className="text-zinc-200"
                                        >
                                            Reason *
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            value={formData.reason}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'reason',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-zinc-700 bg-zinc-900 text-white"
                                            placeholder="Describe the reason for this adjustment (e.g., damaged goods, stock correction, loss)"
                                            rows={3}
                                        />
                                        {errors.reason && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.reason}
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
                                    {adjustmentItems.map((item, index) => (
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
                                                    Quantity *
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            'qty',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-zinc-700 bg-zinc-900 text-white"
                                                    placeholder="0"
                                                    min="0"
                                                    step="1"
                                                />
                                                {errors[
                                                    `items.${index}.qty`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors[
                                                                `items.${index}.qty`
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
                                                        adjustmentItems.length ===
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
                                onClick={() =>
                                    router.visit('/stock-adjustments')
                                }
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Create Adjustment
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
