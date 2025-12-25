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
import { formatCurrency } from '@/lib/utils/currency';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Printer, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Sale {
    id: number;
    invoice_no: string;
    customer: { id: number; name: string };
    warehouse: { id: number; name: string };
    sales_person: { id: number; name: string } | null;
    sale_date: string;
    status: 'pending' | 'partial' | 'complete' | 'cancelled';
    total: number;
    created_at: string;
}

interface Customer {
    id: number;
    code: string;
    name: string;
}

interface Props {
    sales: {
        data: Sale[];
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
    customers: Customer[];
    filters: {
        search?: string;
        from_date?: string;
        to_date?: string;
        status?: string;
        customer_id?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Index({ sales, customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [customerId, setCustomerId] = useState(filters.customer_id || 'all');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: number;
        invoiceNo: string;
    } | null>(null);

    const handleFilter = () => {
        router.get(
            '/sales',
            {
                search,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                status: status !== 'all' ? status : undefined,
                customer_id: customerId !== 'all' ? customerId : undefined,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number, invoiceNo: string) => {
        setDeleteTarget({ id, invoiceNo });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/sales/${deleteTarget.id}`);
        }
        setConfirmOpen(false);
        setDeleteTarget(null);
    };

    const handlePrint = (id: number) => {
        window.open(`/sales/${id}/print`, '_blank');
    };

    const getStatusBadge = (status: Sale['status']) => {
        const variants: Record<
            Sale['status'],
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            pending: 'secondary',
            partial: 'default',
            complete: 'default',
            cancelled: 'destructive',
        };

        const colors: Record<Sale['status'], string> = {
            pending: 'bg-yellow-500/10 text-yellow-500',
            partial: 'bg-blue-500/10 text-blue-500',
            complete: 'bg-green-500/10 text-green-500',
            cancelled: 'bg-red-500/10 text-red-500',
        };

        return (
            <Badge variant={variants[status]} className={colors[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Sales" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Sales</h1>
                    <Link href="/sales/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Sale
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by invoice number..."
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
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={customerId} onValueChange={setCustomerId}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="All Customers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            {customers.map((customer) => (
                                <SelectItem
                                    key={customer.id}
                                    value={customer.id.toString()}
                                >
                                    {customer.code} - {customer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice No</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Sales Person</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        No sales found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sales.data.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">
                                            {sale.invoice_no}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                sale.sale_date,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {sale.customer.name}
                                        </TableCell>
                                        <TableCell>
                                            {sale.warehouse.name}
                                        </TableCell>
                                        <TableCell>
                                            {sale.sales_person?.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(sale.status)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(sale.total)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/sales/${sale.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePrint(sale.id)
                                                    }
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                                <Link
                                                    href={`/sales/${sale.id}/edit`}
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
                                                            sale.id,
                                                            sale.invoice_no,
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

                {sales.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {sales.links.map((link, index) => (
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
                    title="Delete Sale"
                    description={`Are you sure you want to delete sale ${deleteTarget?.invoiceNo || ''}? This will reverse all stock changes.`}
                />
            </div>
        </AppLayout>
    );
}
