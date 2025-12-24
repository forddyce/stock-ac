import { Button } from '@/components/ui/button';
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
import { Plus, Trash2 } from 'lucide-react';

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

interface SaleItemsCardProps {
    items: Item[];
    saleItems: SaleItem[];
    tax: string;
    discount: string;
    errors: Record<string, string>;
    onItemChange: (index: number, field: keyof SaleItem, value: string) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    onTaxChange: (value: string) => void;
    onDiscountChange: (value: string) => void;
}

export default function SaleItemsCard({
    items,
    saleItems,
    tax,
    discount,
    errors,
    onItemChange,
    onAddItem,
    onRemoveItem,
    onTaxChange,
    onDiscountChange,
}: SaleItemsCardProps) {
    const subtotal = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal + taxAmount - discountAmount;

    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                    <span>Items</span>
                    <Button
                        type="button"
                        onClick={onAddItem}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Item
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {saleItems.map((item, index) => (
                        <div
                            key={index}
                            className="grid items-start gap-4 md:grid-cols-12"
                        >
                            <div className="md:col-span-5">
                                <Label className="text-xs text-zinc-200">
                                    Item *
                                </Label>
                                <Select
                                    value={item.item_id}
                                    onValueChange={(value) =>
                                        onItemChange(index, 'item_id', value)
                                    }
                                >
                                    <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                        <SelectValue placeholder="Select item" />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-900">
                                        {items.map((itm) => (
                                            <SelectItem
                                                key={itm.id}
                                                value={itm.id.toString()}
                                            >
                                                {itm.sku} - {itm.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors[`items.${index}.item_id`] && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors[`items.${index}.item_id`]}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-xs text-zinc-200">
                                    Quantity *
                                </Label>
                                <Input
                                    type="number"
                                    value={item.qty_ordered}
                                    onChange={(e) =>
                                        onItemChange(
                                            index,
                                            'qty_ordered',
                                            e.target.value,
                                        )
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                />
                                {errors[`items.${index}.qty_ordered`] && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors[`items.${index}.qty_ordered`]}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-xs text-zinc-200">
                                    Price *
                                </Label>
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) =>
                                        onItemChange(
                                            index,
                                            'price',
                                            e.target.value,
                                        )
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                {errors[`items.${index}.price`] && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors[`items.${index}.price`]}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-xs text-zinc-200">
                                    Subtotal
                                </Label>
                                <div className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
                                    {item.subtotal.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    })}
                                </div>
                            </div>

                            <div className="flex items-end md:col-span-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveItem(index)}
                                    disabled={saleItems.length === 1}
                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 border-t border-zinc-700 pt-4">
                    <div className="ml-auto flex max-w-sm flex-col gap-3">
                        <div className="flex justify-between text-zinc-300">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-white">
                                {subtotal.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <Label htmlFor="tax" className="text-zinc-300">
                                Tax:
                            </Label>
                            <Input
                                id="tax"
                                type="number"
                                value={tax}
                                onChange={(e) => onTaxChange(e.target.value)}
                                className="w-32 border-zinc-700 bg-zinc-900 text-white"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <Label htmlFor="discount" className="text-zinc-300">
                                Discount:
                            </Label>
                            <Input
                                id="discount"
                                type="number"
                                value={discount}
                                onChange={(e) =>
                                    onDiscountChange(e.target.value)
                                }
                                className="w-32 border-zinc-700 bg-zinc-900 text-white"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="flex justify-between border-t border-zinc-700 pt-3 text-lg font-semibold">
                            <span className="text-white">Total:</span>
                            <span className="text-amber-500">
                                {total.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
