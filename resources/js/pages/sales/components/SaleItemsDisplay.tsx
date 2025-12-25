import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface SaleItem {
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
        code: string;
        name: string;
        unit: string;
    };
}

interface SaleItemsDisplayProps {
    items: SaleItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
}

export default function SaleItemsDisplay({
    items,
    subtotal,
    tax,
    discount,
    total,
}: SaleItemsDisplayProps) {
    const getStatusColor = (status: 'pending' | 'partial' | 'complete') => {
        switch (status) {
            case 'complete':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'partial':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                            <TableHead className="text-zinc-300">
                                Item
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                                Ordered
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                                Fulfilled
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                                Price
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                                Subtotal
                            </TableHead>
                            <TableHead className="text-center text-zinc-300">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                className="border-zinc-700 hover:bg-zinc-700/50"
                            >
                                <TableCell className="text-white">
                                    <div>
                                        <p className="font-medium">
                                            {item.item.name}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            {item.item.code}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-white">
                                    {item.qty_ordered} {item.item.unit}
                                </TableCell>
                                <TableCell className="text-right text-white">
                                    <span
                                        className={
                                            item.qty_fulfilled > 0
                                                ? 'font-semibold text-green-500'
                                                : ''
                                        }
                                    >
                                        {item.qty_fulfilled} {item.item.unit}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-white">
                                    {Number(item.price).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        },
                                    )}
                                </TableCell>
                                <TableCell className="text-right text-white">
                                    {Number(item.subtotal).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        },
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={getStatusColor(item.status)}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Summary */}
                <div className="mt-6 border-t border-zinc-700 pt-4">
                    <div className="ml-auto flex max-w-sm flex-col gap-2">
                        <div className="flex justify-between text-zinc-300">
                            <span>Subtotal:</span>
                            <span className="font-medium text-white">
                                {Number(subtotal).toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                            </span>
                        </div>
                        {tax > 0 && (
                            <div className="flex justify-between text-zinc-300">
                                <span>Tax:</span>
                                <span className="font-medium text-white">
                                    {Number(tax).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    })}
                                </span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="flex justify-between text-zinc-300">
                                <span>Discount:</span>
                                <span className="font-medium text-white">
                                    -
                                    {Number(discount).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-zinc-700 pt-2 text-lg font-semibold">
                            <span className="text-white">Total:</span>
                            <span className="text-amber-500">
                                {Number(total).toLocaleString('id-ID', {
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
