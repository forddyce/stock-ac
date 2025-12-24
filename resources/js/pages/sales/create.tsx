import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SaleDetailsCard from './components/SaleDetailsCard';
import SaleItemsCard from './components/SaleItemsCard';

interface Customer {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
}

interface SalesPerson {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    sku: string;
}

interface SaleItem {
    item_id: string;
    qty_ordered: string;
    price: string;
    subtotal: number;
}

interface Props {
    customers: Customer[];
    warehouses: Warehouse[];
    salesPersons: SalesPerson[];
    items: Item[];
}

export default function Create({
    customers,
    warehouses,
    salesPersons,
    items,
}: Props) {
    const [formData, setFormData] = useState({
        customer_id: '',
        warehouse_id: '',
        sales_person_id: '',
        sale_date: new Date().toISOString().split('T')[0],
        invoice_no: '',
        notes: '',
    });

    const [saleItems, setSaleItems] = useState<SaleItem[]>([
        { item_id: '', qty_ordered: '', price: '', subtotal: 0 },
    ]);

    const [tax, setTax] = useState('0');
    const [discount, setDiscount] = useState('0');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculateItemSubtotal = (qty: string, price: string) => {
        const qtyNum = parseFloat(qty) || 0;
        const priceNum = parseFloat(price) || 0;
        return qtyNum * priceNum;
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleItemChange = (
        index: number,
        field: keyof SaleItem,
        value: string,
    ) => {
        const newItems = [...saleItems];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'qty_ordered' || field === 'price') {
            newItems[index].subtotal = calculateItemSubtotal(
                newItems[index].qty_ordered,
                newItems[index].price,
            );
        }

        setSaleItems(newItems);
    };

    const handleAddItem = () => {
        setSaleItems([
            ...saleItems,
            { item_id: '', qty_ordered: '', price: '', subtotal: 0 },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        if (saleItems.length > 1) {
            setSaleItems(saleItems.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subtotal = saleItems.reduce(
            (sum, item) => sum + item.subtotal,
            0,
        );
        const taxAmount = parseFloat(tax) || 0;
        const discountAmount = parseFloat(discount) || 0;
        const total = subtotal + taxAmount - discountAmount;

        const data = {
            ...formData,
            sales_person_id: formData.sales_person_id
                ? parseInt(formData.sales_person_id)
                : null,
            items: saleItems.map((item) => ({
                item_id: parseInt(item.item_id),
                qty_ordered: parseFloat(item.qty_ordered),
                price: parseFloat(item.price),
            })),
            tax: taxAmount,
            discount: discountAmount,
            subtotal,
            total,
        };

        router.post('/sales', data, {
            onError: (errors) => setErrors(errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Sale" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Create Sale
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <SaleDetailsCard
                            formData={formData}
                            customers={customers}
                            warehouses={warehouses}
                            salesPersons={salesPersons}
                            errors={errors}
                            onChange={handleFormChange}
                        />

                        <SaleItemsCard
                            items={items}
                            saleItems={saleItems}
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
                                onClick={() => router.visit('/sales')}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Create Sale
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
