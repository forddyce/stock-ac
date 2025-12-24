import ConfirmDialog from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, FileText, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import SaleDetailsDisplay from './components/SaleDetailsDisplay';
import SaleItemsDisplay from './components/SaleItemsDisplay';

interface Sale {
    id: number;
    invoice_no: string;
    sale_date: string;
    status: 'pending' | 'partial' | 'complete' | 'cancelled';
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes: string;
    customer: {
        id: number;
        name: string;
        code: string;
    };
    warehouse: {
        id: number;
        name: string;
        code: string;
    };
    sales_person?: {
        id: number;
        name: string;
    };
    creator: {
        id: number;
        name: string;
    };
    items: {
        id: number;
        item_id: number;
        qty_ordered: number;
        qty_fulfilled: number;
        price: number;
        subtotal: number;
        status: 'pending' | 'partial' | 'complete';
        notes: string;
        item: {
            id: number;
            sku: string;
            name: string;
            unit: string;
        };
    }[];
}

interface Props {
    sale: Sale;
}

export default function Show({ sale }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const getStatusColor = (
        status: 'pending' | 'partial' | 'complete' | 'cancelled',
    ) => {
        switch (status) {
            case 'complete':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'partial':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const handleDelete = () => {
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        router.delete(`/sales/${sale.id}`);
        setConfirmOpen(false);
    };

    const handlePrintInvoice = () => {
        console.log('Print invoice for sale:', sale.id);
    };

    return (
        <AppLayout>
            <Head title={`Sale ${sale.invoice_no || '#' + sale.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/sales"
                                className="text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-semibold text-white">
                                Sale {sale.invoice_no || '#' + sale.id}
                            </h1>
                            <Badge className={getStatusColor(sale.status)}>
                                {sale.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {sale.status !== 'complete' &&
                            sale.status !== 'cancelled' && (
                                <Link href={`/sales/${sale.id}/fulfill`}>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Package className="mr-1 h-4 w-4" />
                                        Fulfill Items
                                    </Button>
                                </Link>
                            )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePrintInvoice}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                            <FileText className="mr-1 h-4 w-4" />
                            Print Invoice
                        </Button>
                        <Link href={`/sales/${sale.id}/edit`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDelete}
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <SaleDetailsDisplay
                        customer={sale.customer}
                        warehouse={sale.warehouse}
                        salesPerson={sale.sales_person}
                        saleDate={sale.sale_date}
                        creator={sale.creator}
                        notes={sale.notes}
                    />

                    <SaleItemsDisplay
                        items={sale.items}
                        subtotal={sale.subtotal}
                        tax={sale.tax}
                        discount={sale.discount}
                        total={sale.total}
                    />
                </div>

                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Sale"
                    description="Are you sure you want to delete this sale? This will reverse any fulfilled stock."
                />
            </div>
        </AppLayout>
    );
}
