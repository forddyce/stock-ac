import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface StockAdjustment {
    adjustment_no: string;
    adjustment_date: string;
    warehouse: { id: number; name: string; code: string };
    type: 'add' | 'subtract';
    reason: string;
    item_count: number;
    created_at: string;
}

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface Props {
    adjustments: {
        data: StockAdjustment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    warehouses: Warehouse[];
    filters: {
        search?: string;
        from_date?: string;
        to_date?: string;
        type?: string;
        warehouse_id?: string;
    };
}

export default function Index({ adjustments, warehouses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [type, setType] = useState(filters.type || 'all');
    const [warehouseId, setWarehouseId] = useState(
        filters.warehouse_id || 'all',
    );

    const handleFilter = () => {
        router.get(
            '/stock-adjustments',
            {
                search,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                type: type !== 'all' ? type : undefined,
                warehouse_id: warehouseId !== 'all' ? warehouseId : undefined,
            },
            { preserveState: true },
        );
    };

    const getTypeBadge = (
        type: StockAdjustment['type'],
    ): React.ReactElement => {
        const colors: Record<StockAdjustment['type'], string> = {
            add: 'bg-green-500/10 text-green-500',
            subtract: 'bg-red-500/10 text-red-500',
        };

        const labels: Record<StockAdjustment['type'], string> = {
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
            <Head title="Stock Adjustments" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Stock Adjustments</h1>
                    <Link href="/stock-adjustments/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Adjustment
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by adjustment number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilter()
                                }
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Input
                        type="date"
                        placeholder="From Date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        placeholder="To Date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    <Button onClick={handleFilter} className="md:col-start-5">
                        Filter
                    </Button>
                </div>

                <div className="flex gap-4">
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="add">Add</SelectItem>
                            <SelectItem value="subtract">Subtract</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={warehouseId} onValueChange={setWarehouseId}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="All Warehouses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((warehouse) => (
                                <SelectItem
                                    key={warehouse.id}
                                    value={warehouse.id.toString()}
                                >
                                    {warehouse.code} - {warehouse.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Adjustment No</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">
                                    Items
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No stock adjustments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                adjustments.data.map((adjustment) => (
                                    <TableRow key={adjustment.adjustment_no}>
                                        <TableCell className="font-medium">
                                            {adjustment.adjustment_no}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                adjustment.adjustment_date,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {adjustment.warehouse.name}
                                        </TableCell>
                                        <TableCell>
                                            {getTypeBadge(adjustment.type)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs truncate">
                                                {adjustment.reason}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {adjustment.item_count} item(s)
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/stock-adjustments/${adjustment.adjustment_no}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {adjustments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {adjustments.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
