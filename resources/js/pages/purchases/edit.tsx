import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PurchaseDetailsCard from './components/PurchaseDetailsCard';
import PurchaseItemsCard from './components/PurchaseItemsCard';

interface Supplier {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    code: string;
}

interface PurchaseItem {
    item_id: string;
    qty_ordered: string;
    cost: string;
    subtotal: number;
}

interface Purchase {
    id: number;
    invoice_no: string;
    supplier_id: number;
    warehouse_id: number;
    purchase_date: string;
    tax: number;
    discount: number;
    notes: string;
    items: {
        id: number;
        item_id: number;
        qty_ordered: number;
        cost: number;
        subtotal: number;
    }[];
}

interface Props {
    purchase: Purchase;
    suppliers: Supplier[];
    warehouses: Warehouse[];
    items: Item[];
}

export default function Edit({
    purchase,
    suppliers,
    warehouses,
    items,
}: Props) {
    const [formData, setFormData] = useState({
        supplier_id: purchase.supplier_id.toString(),
        warehouse_id: purchase.warehouse_id.toString(),
        purchase_date: purchase.purchase_date,
        invoice_no: purchase.invoice_no || '',
        notes: purchase.notes || '',
    });

    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(
        purchase.items.map((item) => ({
            item_id: item.item_id.toString(),
            qty_ordered: item.qty_ordered.toString(),
            cost: item.cost.toString(),
            subtotal: item.qty_ordered * item.cost,
        })),
    );

    const [tax, setTax] = useState(purchase.tax.toString());
    const [discount, setDiscount] = useState(purchase.discount.toString());
    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculateItemSubtotal = (qty: string, cost: string) => {
        const qtyNum = parseFloat(qty) || 0;
        const costNum = parseFloat(cost) || 0;
        return qtyNum * costNum;
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleItemChange = (
        index: number,
        field: keyof PurchaseItem,
        value: string,
    ) => {
        const newItems = [...purchaseItems];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'qty_ordered' || field === 'cost') {
            newItems[index].subtotal = calculateItemSubtotal(
                newItems[index].qty_ordered,
                newItems[index].cost,
            );
        }

        setPurchaseItems(newItems);
    };

    const handleAddItem = () => {
        setPurchaseItems([
            ...purchaseItems,
            { item_id: '', qty_ordered: '', cost: '', subtotal: 0 },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        if (purchaseItems.length > 1) {
            setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subtotal = purchaseItems.reduce(
            (sum, item) => sum + item.subtotal,
            0,
        );
        const taxAmount = parseFloat(tax) || 0;
        const discountAmount = parseFloat(discount) || 0;
        const total = subtotal + taxAmount - discountAmount;

        const data = {
            ...formData,
            items: purchaseItems.map((item) => ({
                item_id: parseInt(item.item_id),
                qty_ordered: parseFloat(item.qty_ordered),
                cost: parseFloat(item.cost),
            })),
            tax: taxAmount,
            discount: discountAmount,
            subtotal,
            total,
            _method: 'PUT',
        };

        router.post(`/purchases/${purchase.id}`, data, {
            onError: (errors) => setErrors(errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Purchase" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Edit Purchase
                    </h1>
                    <p className="mt-1 text-sm text-amber-500">
                        Note: Editing will reverse received stock and reset all
                        items to pending status
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <PurchaseDetailsCard
                            formData={formData}
                            suppliers={suppliers}
                            warehouses={warehouses}
                            errors={errors}
                            onChange={handleFormChange}
                        />

                        <PurchaseItemsCard
                            items={items}
                            purchaseItems={purchaseItems}
                            tax={tax}
                            discount={discount}
                            errors={errors}
                            onItemChange={handleItemChange}
                            onAddItem={handleAddItem}
                            onRemoveItem={handleRemoveItem}
                            onTaxChange={setTax}
                            onDiscountChange={setDiscount}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/purchases')}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Update Purchase
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
