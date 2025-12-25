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
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ItemHistory {
    id: number;
    batch_id: string;
    item: { id: number; code: string; name: string; unit: string };
    warehouse: { id: number; code: string; name: string };
    transaction_type:
        | 'purchase'
        | 'sale'
        | 'transfer_in'
        | 'transfer_out'
        | 'adjustment';
    reference_id: number | null;
    qty_before: number;
    qty_change: number;
    qty_after: number;
    notes: string | null;
    creator: { id: number; name: string } | null;
    created_at: string;
}

interface Item {
    id: number;
    code: string;
    name: string;
}

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface Props {
    histories: {
        data: ItemHistory[];
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
    items: Item[];
    warehouses: Warehouse[];
    filters: {
        search?: string;
        from_date?: string;
        to_date?: string;
        transaction_type?: string;
        item_id?: string;
        warehouse_id?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Index({
    histories,
    items,
    warehouses,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [transactionType, setTransactionType] = useState(
        filters.transaction_type || 'all',
    );
    const [itemId, setItemId] = useState(filters.item_id || 'all');
    const [warehouseId, setWarehouseId] = useState(
        filters.warehouse_id || 'all',
    );

    const handleFilter = () => {
        router.get(
            '/item-history',
            {
                search,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                transaction_type:
                    transactionType !== 'all' ? transactionType : undefined,
                item_id: itemId !== 'all' ? itemId : undefined,
                warehouse_id: warehouseId !== 'all' ? warehouseId : undefined,
            },
            { preserveState: true },
        );
    };

    const getTransactionTypeBadge = (type: ItemHistory['transaction_type']) => {
        const config: Record<
            ItemHistory['transaction_type'],
            { label: string; color: string }
        > = {
            purchase: {
                label: 'Purchase',
                color: 'bg-blue-500/10 text-blue-500',
            },
            sale: { label: 'Sale', color: 'bg-green-500/10 text-green-500' },
            transfer_in: {
                label: 'Transfer In',
                color: 'bg-purple-500/10 text-purple-500',
            },
            transfer_out: {
                label: 'Transfer Out',
                color: 'bg-orange-500/10 text-orange-500',
            },
            adjustment: {
                label: 'Adjustment',
                color: 'bg-yellow-500/10 text-yellow-500',
            },
        };

        return (
            <Badge variant="outline" className={config[type].color}>
                {config[type].label}
            </Badge>
        );
    };

    const formatQtyChange = (change: number) => {
        return change >= 0 ? `+${change}` : change.toString();
    };

    return (
        <AppLayout>
            <Head title="Item History" />

            <div className="space-y-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Item History
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Track all stock movements and transactions
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by item, reference, or batch..."
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
                    <Select
                        value={transactionType}
                        onValueChange={setTransactionType}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="transfer_in">
                                Transfer In
                            </SelectItem>
                            <SelectItem value="transfer_out">
                                Transfer Out
                            </SelectItem>
                            <SelectItem value="adjustment">
                                Adjustment
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={itemId} onValueChange={setItemId}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="All Items" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Items</SelectItem>
                            {items.map((item) => (
                                <SelectItem
                                    key={item.id}
                                    value={item.id.toString()}
                                >
                                    {item.code} - {item.name}
                                </SelectItem>
                            ))}
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
                                <TableHead>Date</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">
                                    Qty Before
                                </TableHead>
                                <TableHead className="text-right">
                                    Change
                                </TableHead>
                                <TableHead className="text-right">
                                    Qty After
                                </TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {histories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No history records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                histories.data.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell>
                                            {new Date(
                                                history.created_at,
                                            ).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {history.item.code}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {history.item.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {history.warehouse.name}
                                        </TableCell>
                                        <TableCell>
                                            {getTransactionTypeBadge(
                                                history.transaction_type,
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {history.qty_before}{' '}
                                            {history.item.unit}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-mono font-semibold ${history.qty_change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {formatQtyChange(
                                                history.qty_change,
                                            )}{' '}
                                            {history.item.unit}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-semibold">
                                            {history.qty_after}{' '}
                                            {history.item.unit}
                                        </TableCell>
                                        <TableCell>
                                            {history.creator?.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs truncate">
                                                {history.notes || '-'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {histories.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {histories.links.map((link, index) => (
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
