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
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Item {
    id: number;
    code: string;
    name: string;
    unit: string | null;
    category: string | null;
    description: string | null;
    version: number;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    warehouse_items?: Array<{
        id: number;
        warehouse_id: number;
        quantity: string;
        warehouse: {
            id: number;
            code: string;
            name: string;
        };
    }>;
}

interface ItemEditProps extends SharedData {
    item: Item;
}

export default function ItemEdit({ item }: ItemEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        code: item.code,
        name: item.name,
        unit: item.unit || '',
        category: item.category || '',
        description: item.description || '',
        is_active: !item.deleted_at,
        version: item.version,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/items/${item.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Item - ${item.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/items">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Item
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Update item information
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Item Information</CardTitle>
                            <CardDescription>
                                Update the details for {item.name} (Version:{' '}
                                {item.version})
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {errors.version && (
                                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                                    {errors.version}
                                </div>
                            )}

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

                    {item.warehouse_items &&
                        item.warehouse_items.length > 0 && (
                            <Card className="max-w-2xl">
                                <CardHeader>
                                    <CardTitle>Current Stock</CardTitle>
                                    <CardDescription>
                                        View current stock levels across
                                        warehouses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {item.warehouse_items.map((stock) => (
                                            <div
                                                key={stock.id}
                                                className="flex items-center justify-between rounded-lg border p-3"
                                            >
                                                <span className="font-medium">
                                                    {stock.warehouse.code} -{' '}
                                                    {stock.warehouse.name}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {stock.quantity}{' '}
                                                    {item.unit || 'units'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        Note: Stock quantities are managed
                                        through transactions (purchases, sales,
                                        transfers).
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Item
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
