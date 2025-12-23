import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Package, Trash2 } from 'lucide-react';
import PurchaseDetailsDisplay from './components/PurchaseDetailsDisplay';
import PurchaseItemsDisplay from './components/PurchaseItemsDisplay';

interface Purchase {
    id: number;
    invoice_no: string;
    purchase_date: string;
    status: 'pending' | 'partial' | 'complete' | 'cancelled';
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes: string;
    supplier: {
        id: number;
        name: string;
        code: string;
    };
    warehouse: {
        id: number;
        name: string;
        code: string;
    };
    creator: {
        id: number;
        name: string;
    };
    items: {
        id: number;
        item_id: number;
        qty_ordered: number;
        qty_received: number;
        cost: number;
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
    purchase: Purchase;
}

export default function Show({ purchase }: Props) {
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
        if (
            confirm(
                'Are you sure you want to delete this purchase? This will reverse any received stock.',
            )
        ) {
            router.delete(`/purchases/${purchase.id}`);
        }
    };

    return (
        <AppLayout>
            <Head
                title={`Purchase ${purchase.invoice_no || '#' + purchase.id}`}
            />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/purchases"
                                className="text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-semibold text-white">
                                Purchase{' '}
                                {purchase.invoice_no || '#' + purchase.id}
                            </h1>
                            <Badge className={getStatusColor(purchase.status)}>
                                {purchase.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {purchase.status !== 'complete' &&
                            purchase.status !== 'cancelled' && (
                                <Link
                                    href={`/purchases/${purchase.id}/receive`}
                                >
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Package className="mr-1 h-4 w-4" />
                                        Receive Items
                                    </Button>
                                </Link>
                            )}
                        <Link href={`/purchases/${purchase.id}/edit`}>
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
                    <PurchaseDetailsDisplay
                        supplier={purchase.supplier}
                        warehouse={purchase.warehouse}
                        purchaseDate={purchase.purchase_date}
                        creator={purchase.creator}
                        notes={purchase.notes}
                    />

                    <PurchaseItemsDisplay
                        items={purchase.items}
                        subtotal={purchase.subtotal}
                        tax={purchase.tax}
                        discount={purchase.discount}
                        total={purchase.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
