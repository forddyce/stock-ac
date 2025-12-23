import { InputError } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface ItemCreateProps extends SharedData {
    warehouses: Warehouse[];
}

interface InitialStock {
    warehouse_id: number;
    quantity: string;
}

export default function ItemCreate({ warehouses }: ItemCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        unit: '',
        category: '',
        description: '',
        is_active: true,
        initial_stock: [] as InitialStock[],
    });

    const [showInitialStock, setShowInitialStock] = useState(false);

    const addStockRow = () => {
        setData('initial_stock', [
            ...data.initial_stock,
            { warehouse_id: warehouses[0]?.id || 0, quantity: '0' },
        ]);
    };

    const removeStockRow = (index: number) => {
        const newStock = data.initial_stock.filter((_, i) => i !== index);
        setData('initial_stock', newStock);
    };

    const updateStockWarehouse = (index: number, warehouseId: number) => {
        const newStock = [...data.initial_stock];
        newStock[index].warehouse_id = warehouseId;
        setData('initial_stock', newStock);
    };

    const updateStockQuantity = (index: number, quantity: string) => {
        const newStock = [...data.initial_stock];
        newStock[index].quantity = quantity;
        setData('initial_stock', newStock);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout>
            <Head title="Create Item" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/items">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Item
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Add a new inventory item
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Item Information</CardTitle>
                            <CardDescription>
                                Enter the basic details for the new item
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Code{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="e.g., ITEM001"
                                        maxLength={50}
                                        autoFocus
                                    />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Product Name"
                                        maxLength={255}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(e) =>
                                            setData('unit', e.target.value)
                                        }
                                        placeholder="e.g., pcs, kg, liter"
                                        maxLength={50}
                                    />
                                    <InputError message={errors.unit} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        placeholder="e.g., Electronics, Tools"
                                        maxLength={100}
                                    />
                                    <InputError message={errors.category} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Enter item description"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer"
                                >
                                    Active
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Initial Stock (Optional)</CardTitle>
                            <CardDescription>
                                Set initial stock quantities per warehouse
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!showInitialStock ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowInitialStock(true);
                                        if (data.initial_stock.length === 0) {
                                            addStockRow();
                                        }
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Initial Stock
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    {data.initial_stock.map((stock, index) => (
                                        <div
                                            key={index}
                                            className="flex items-end gap-4 rounded-lg border p-4"
                                        >
                                            <div className="flex-1 space-y-2">
                                                <Label>Warehouse</Label>
                                                <select
                                                    value={stock.warehouse_id}
                                                    onChange={(e) =>
                                                        updateStockWarehouse(
                                                            index,
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {warehouses.map(
                                                        (warehouse) => (
                                                            <option
                                                                key={
                                                                    warehouse.id
                                                                }
                                                                value={
                                                                    warehouse.id
                                                                }
                                                            >
                                                                {warehouse.code}{' '}
                                                                -{' '}
                                                                {warehouse.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <InputError
                                                    message={
                                                        errors[
                                                            `initial_stock.${index}.warehouse_id` as keyof typeof errors
                                                        ]
                                                    }
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Quantity</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={stock.quantity}
                                                    onChange={(e) =>
                                                        updateStockQuantity(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `initial_stock.${index}.quantity` as keyof typeof errors
                                                        ]
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeStockRow(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addStockRow}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Another Warehouse
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Item
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/items">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
