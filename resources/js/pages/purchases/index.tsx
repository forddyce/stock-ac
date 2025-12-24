import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Purchase {
    id: number;
    invoice_no: string;
    supplier: { id: number; name: string };
    warehouse: { id: number; name: string };
    purchase_date: string;
    total: number;
    created_at: string;
}

interface Props {
    purchases: {
        data: Purchase[];
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
    filters: {
        search?: string;
        from_date?: string;
        to_date?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Index({ purchases, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: number;
        invoiceNo: string;
    } | null>(null);

    const handleFilter = () => {
        router.get(
            '/purchases',
            {
                search,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
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
            router.delete(`/purchases/${deleteTarget.id}`);
        }
        setConfirmOpen(false);
        setDeleteTarget(null);
    };

    return (
        <AppLayout>
            <Head title="Purchases" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Purchases</h1>
                    <Link href="/purchases/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Purchase
                        </Button>
                    </Link>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
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
                        className="w-48"
                    />
                    <Input
                        type="date"
                        placeholder="To Date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-48"
                    />
                    <Button onClick={handleFilter}>Filter</Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice No</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        No purchases found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchases.data.map((purchase) => (
                                    <TableRow key={purchase.id}>
                                        <TableCell className="font-medium">
                                            {purchase.invoice_no}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                purchase.purchase_date,
                                            ).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {purchase.supplier.name}
                                        </TableCell>
                                        <TableCell>
                                            {purchase.warehouse.name}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(purchase.total)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/purchases/${purchase.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/purchases/${purchase.id}/edit`}
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
                                                            purchase.id,
                                                            purchase.invoice_no,
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

                {purchases.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {purchases.links.map((link, index) => (
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
                    title="Delete Purchase"
                    description={`Are you sure you want to delete purchase ${deleteTarget?.invoiceNo || ''}? This will reverse all stock changes.`}
                />
            </div>
        </AppLayout>
    );
}
