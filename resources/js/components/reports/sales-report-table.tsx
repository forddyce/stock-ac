import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils/currency';

interface Item {
    id: number;
    code: string;
    name: string;
}

interface SaleItem {
    id: number;
    item_id: number;
    qty_ordered: number;
    price: number;
    subtotal: number;
    item: Item;
}

interface Sale {
    id: number;
    invoice_no: string;
    sale_date: string;
    customer: {
        id: number;
        name: string;
    };
    sales_person: {
        id: number;
        name: string;
    } | null;
    total: number;
    items: SaleItem[];
}

interface Props {
    sales: Sale[] | null;
}

export default function SalesReportTable({ sales }: Props) {
    if (!sales) {
        return (
            <Card className="border-zinc-700 bg-zinc-800">
                <CardContent className="py-12">
                    <div className="text-center text-zinc-400">
                        Silakan pilih periode tanggal dan klik tombol Cari
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (sales.length === 0) {
        return (
            <Card className="border-zinc-700 bg-zinc-800">
                <CardContent className="py-12">
                    <div className="text-center text-zinc-400">
                        Tidak ada data penjualan untuk periode yang dipilih
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-700 hover:bg-zinc-800">
                                <TableHead className="text-zinc-300">
                                    Tanggal
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Invoice
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Customer
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Sales
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Item
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Qty
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Harga Satuan
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Subtotal
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((sale) =>
                                sale.items.map((item, index) => (
                                    <TableRow
                                        key={`${sale.id}-${item.id}`}
                                        className="border-zinc-700"
                                    >
                                        {index === 0 ? (
                                            <>
                                                <TableCell className="text-zinc-300">
                                                    {new Date(
                                                        sale.sale_date,
                                                    ).toLocaleString('id-ID', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-mono text-zinc-300">
                                                    {sale.invoice_no}
                                                </TableCell>
                                                <TableCell className="text-zinc-300">
                                                    {sale.customer.name}
                                                </TableCell>
                                                <TableCell className="text-zinc-300">
                                                    {sale.sales_person?.name ||
                                                        '-'}
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell />
                                                <TableCell />
                                                <TableCell />
                                                <TableCell />
                                            </>
                                        )}
                                        <TableCell className="text-zinc-300">
                                            {item.item.code} - {item.item.name}
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            {item.qty_ordered}
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            {formatCurrency(item.price)}
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            {formatCurrency(item.subtotal)}
                                        </TableCell>
                                        {index === 0 ? (
                                            <TableCell
                                                className="text-right font-semibold text-amber-600"
                                                rowSpan={sale.items.length}
                                            >
                                                {formatCurrency(sale.total)}
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                )),
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
