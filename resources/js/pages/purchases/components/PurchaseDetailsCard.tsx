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

interface Supplier {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
}

interface PurchaseDetailsCardProps {
    formData: {
        supplier_id: string;
        warehouse_id: string;
        purchase_date: string;
        invoice_no: string;
        notes: string;
    };
    suppliers: Supplier[];
    warehouses: Warehouse[];
    errors: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

export default function PurchaseDetailsCard({
    formData,
    suppliers,
    warehouses,
    errors,
    onChange,
}: PurchaseDetailsCardProps) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Purchase Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="supplier_id" className="text-zinc-200">
                            Supplier *
                        </Label>
                        <Select
                            value={formData.supplier_id}
                            onValueChange={(value) =>
                                onChange('supplier_id', value)
                            }
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-700 bg-zinc-900">
                                {suppliers.map((supplier) => (
                                    <SelectItem
                                        key={supplier.id}
                                        value={supplier.id.toString()}
                                    >
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.supplier_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.supplier_id}
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
                            htmlFor="purchase_date"
                            className="text-zinc-200"
                        >
                            Purchase Date *
                        </Label>
                        <Input
                            id="purchase_date"
                            type="date"
                            value={formData.purchase_date}
                            onChange={(e) =>
                                onChange('purchase_date', e.target.value)
                            }
                            className="border-zinc-700 bg-zinc-900 text-white"
                        />
                        {errors.purchase_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.purchase_date}
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
