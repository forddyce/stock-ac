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
import { Textarea } from '@/components/ui/textarea';

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

interface SaleDetailsCardProps {
    formData: {
        customer_id: string;
        warehouse_id: string;
        sales_person_id: string;
        sale_date: string;
        invoice_no: string;
        notes: string;
    };
    customers: Customer[];
    warehouses: Warehouse[];
    salesPersons: SalesPerson[];
    errors: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

export default function SaleDetailsCard({
    formData,
    customers,
    warehouses,
    salesPersons,
    errors,
    onChange,
}: SaleDetailsCardProps) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Sale Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="customer_id" className="text-zinc-200">
                            Customer *
                        </Label>
                        <Select
                            value={formData.customer_id}
                            onValueChange={(value) =>
                                onChange('customer_id', value)
                            }
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                {customers.map((customer) => (
                                    <SelectItem
                                        key={customer.id}
                                        value={customer.id.toString()}
                                    >
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.customer_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="warehouse_id" className="text-zinc-200">
                            Warehouse *
                        </Label>
                        <Select
                            value={formData.warehouse_id}
                            onValueChange={(value) =>
                                onChange('warehouse_id', value)
                            }
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                {warehouses.map((warehouse) => (
                                    <SelectItem
                                        key={warehouse.id}
                                        value={warehouse.id.toString()}
                                    >
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.warehouse_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.warehouse_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="sales_person_id"
                            className="text-zinc-200"
                        >
                            Sales Person
                        </Label>
                        <Select
                            value={formData.sales_person_id}
                            onValueChange={(value) =>
                                onChange('sales_person_id', value)
                            }
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Select sales person (optional)" />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                {salesPersons.map((salesPerson) => (
                                    <SelectItem
                                        key={salesPerson.id}
                                        value={salesPerson.id.toString()}
                                    >
                                        {salesPerson.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.sales_person_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.sales_person_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="sale_date" className="text-zinc-200">
                            Sale Date *
                        </Label>
                        <Input
                            id="sale_date"
                            type="date"
                            value={formData.sale_date}
                            onChange={(e) =>
                                onChange('sale_date', e.target.value)
                            }
                            className="border-zinc-700 bg-zinc-900 text-white"
                        />
                        {errors.sale_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.sale_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="invoice_no" className="text-zinc-200">
                            Invoice Number
                        </Label>
                        <Input
                            id="invoice_no"
                            value={formData.invoice_no}
                            onChange={(e) =>
                                onChange('invoice_no', e.target.value)
                            }
                            className="border-zinc-700 bg-zinc-900 text-white"
                            placeholder="INV-001"
                        />
                        {errors.invoice_no && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.invoice_no}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="notes" className="text-zinc-200">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => onChange('notes', e.target.value)}
                            className="border-zinc-700 bg-zinc-900 text-white"
                            rows={3}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
