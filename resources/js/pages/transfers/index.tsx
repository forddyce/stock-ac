import ConfirmDialog from '@/components/ConfirmDialog';
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
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Transfer {
    transfer_no: string;
    from_warehouse: { id: number; name: string; code: string };
    to_warehouse: { id: number; name: string; code: string };
    transfer_date: string;
    status: 'pending' | 'in_transit' | 'complete' | 'cancelled';
    item_count: number;
    created_at: string;
}

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface Props {
    transfers: {
        data: Transfer[];
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
        status?: string;
        from_warehouse_id?: string;
        to_warehouse_id?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Index({ transfers, warehouses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [status, setStatus] = useState(filters.status || '');
    const [fromWarehouseId, setFromWarehouseId] = useState(
        filters.from_warehouse_id || '',
    );
    const [toWarehouseId, setToWarehouseId] = useState(
        filters.to_warehouse_id || '',
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleFilter = () => {
        router.get(
            '/transfers',
            {
                search,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                status: status || undefined,
                from_warehouse_id: fromWarehouseId || undefined,
                to_warehouse_id: toWarehouseId || undefined,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (transferNo: string) => {
        setDeleteTarget(transferNo);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/transfers/${deleteTarget}`);
        }
        setConfirmOpen(false);
        setDeleteTarget(null);
    };

    const getStatusBadge = (status: Transfer['status']): React.ReactElement => {
        const variants: Record<
            Transfer['status'],
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            pending: 'secondary',
            in_transit: 'default',
            complete: 'default',
            cancelled: 'destructive',
        };

        const colors: Record<Transfer['status'], string> = {
            pending: 'bg-yellow-500/10 text-yellow-500',
            in_transit: 'bg-blue-500/10 text-blue-500',
            complete: 'bg-green-500/10 text-green-500',
            cancelled: 'bg-red-500/10 text-red-500',
        };

        const labels: Record<Transfer['status'], string> = {
            pending: 'Pending',
            in_transit: 'In Transit',
            complete: 'Complete',
            cancelled: 'Cancelled',
        };

        return (
            <Badge variant={variants[status]} className={colors[status]}>
                {labels[status]}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Transfers" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Transfers</h1>
                    <Link href="/transfers/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Transfer
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by transfer number..."
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
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_transit">
                                In Transit
                            </SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={fromWarehouseId}
                        onValueChange={setFromWarehouseId}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="From Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Warehouses</SelectItem>
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
                    <Select
                        value={toWarehouseId}
                        onValueChange={setToWarehouseId}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="To Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Warehouses</SelectItem>
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
                                <TableHead>Transfer No</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>From Warehouse</TableHead>
                                <TableHead>To Warehouse</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Items
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No transfers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transfers.data.map((transfer) => (
                                    <TableRow key={transfer.transfer_no}>
                                        <TableCell className="font-medium">
                                            {transfer.transfer_no}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                transfer.transfer_date,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {transfer.from_warehouse.name}
                                        </TableCell>
                                        <TableCell>
                                            {transfer.to_warehouse.name}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(transfer.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {transfer.item_count} item(s)
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/transfers/${transfer.transfer_no}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/transfers/${transfer.transfer_no}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            transfer.transfer_no,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {transfers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {transfers.links.map((link, index) => (
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

                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Transfer"
                    description={`Are you sure you want to delete transfer ${deleteTarget || ''}? This will reverse all stock changes.`}
                />
            </div>
        </AppLayout>
    );
}
