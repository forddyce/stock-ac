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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface StockItem {
    item: {
        code: string;
        name: string;
        unit: string;
    };
    warehouse: {
        code: string;
        name: string;
    };
    stock: number;
}

interface Totals {
    totalItems: number;
    totalStock: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    warehouses: Warehouse[];
    stockItems: {
        data: StockItem[];
        links: PaginationLink[];
    };
    totals: Totals;
    filters: {
        warehouse_id?: string;
        search?: string;
    };
}

export default function StockReport({
    warehouses,
    stockItems,
    totals,
    filters,
}: Props) {
    const [formData, setFormData] = useState({
        warehouse_id: filters.warehouse_id || 'all',
        search: filters.search || '',
    });

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/reports/stock',
            {
                warehouse_id:
                    formData.warehouse_id !== 'all'
                        ? formData.warehouse_id
                        : undefined,
                search: formData.search || undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Stock Report" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Current Stock Report
                    </h1>
                </div>

                {/* Filter Card */}
                <Card className="mb-6 border-zinc-700 bg-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch}>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <Label
                                        htmlFor="warehouse_id"
                                        className="text-zinc-200"
                                    >
                                        Warehouse
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
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-zinc-700 bg-zinc-900">
                                            <SelectItem value="all">
                                                All Warehouses
                                            </SelectItem>
                                            {warehouses.map((warehouse) => (
                                                <SelectItem
                                                    key={warehouse.id}
                                                    value={warehouse.id.toString()}
                                                >
                                                    {warehouse.code} -{' '}
                                                    {warehouse.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label
                                        htmlFor="search"
                                        className="text-zinc-200"
                                    >
                                        Search Item
                                    </Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by code or name..."
                                        value={formData.search}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'search',
                                                e.target.value,
                                            )
                                        }
                                        className="border-zinc-700 bg-zinc-900 text-white"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        className="w-full bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardContent>
                            <div className="text-sm text-zinc-400">
                                Total Unique Items
                            </div>
                            <div className="mt-2 text-2xl font-bold text-white">
                                {totals.totalItems.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardContent>
                            <div className="text-sm text-zinc-400">
                                Total Stock Quantity
                            </div>
                            <div className="mt-2 text-2xl font-bold text-amber-500">
                                {totals.totalStock.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-zinc-700 bg-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Stock Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stockItems.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                                            <TableHead className="text-zinc-300">
                                                Warehouse
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Item Code
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Item Name
                                            </TableHead>
                                            <TableHead className="text-zinc-300">
                                                Unit
                                            </TableHead>
                                            <TableHead className="text-right text-zinc-300">
                                                Stock
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stockItems.data.map(
                                            (stockItem, index) => (
                                                <TableRow
                                                    key={index}
                                                    className="border-zinc-700"
                                                >
                                                    <TableCell className="text-white">
                                                        <div className="font-medium">
                                                            {
                                                                stockItem
                                                                    .warehouse
                                                                    .code
                                                            }
                                                        </div>
                                                        <div className="text-sm text-zinc-400">
                                                            {
                                                                stockItem
                                                                    .warehouse
                                                                    .name
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-white">
                                                        {stockItem.item.code}
                                                    </TableCell>
                                                    <TableCell className="text-white">
                                                        {stockItem.item.name}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-400">
                                                        {stockItem.item.unit}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-semibold ${
                                                            stockItem.stock < 0
                                                                ? 'text-red-500'
                                                                : stockItem.stock ===
                                                                    0
                                                                  ? 'text-zinc-400'
                                                                  : 'text-white'
                                                        }`}
                                                    >
                                                        {stockItem.stock.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {stockItems.links &&
                                    stockItems.links.length > 3 && (
                                        <div className="mt-4 flex justify-center gap-2">
                                            {stockItems.links.map(
                                                (link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={
                                                            link.active
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        disabled={
                                                            !link.url ||
                                                            link.active
                                                        }
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.visit(
                                                                    link.url,
                                                                );
                                                            }
                                                        }}
                                                        className={
                                                            link.active
                                                                ? 'bg-amber-600 hover:bg-amber-700'
                                                                : 'border-zinc-700 text-white hover:bg-zinc-700'
                                                        }
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                            </>
                        ) : (
                            <div className="py-12 text-center text-zinc-400">
                                No stock data found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
