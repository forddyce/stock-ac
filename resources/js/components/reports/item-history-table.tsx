import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

interface ItemHistory {
    id: number;
    item: {
        code: string;
        name: string;
    };
    warehouse: {
        code: string;
        name: string;
    };
    transaction_type: string;
    reference_id: string | null;
    qty_before: number;
    qty_change: number;
    qty_after: number;
    notes: string | null;
    creator: {
        name: string;
    };
    created_at: string;
}

interface Pagination {
    data: ItemHistory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    history: Pagination;
    onPageChange: (page: number) => void;
}

const transactionTypes = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'transfer_out', label: 'Transfer Out' },
    { value: 'transfer_in', label: 'Transfer In' },
    { value: 'adjustment', label: 'Adjustment' },
];

const getTransactionBadge = (type: string) => {
    const variants: Record<
        string,
        'default' | 'secondary' | 'destructive' | 'outline'
    > = {
        purchase: 'default',
        sale: 'secondary',
        transfer_out: 'destructive',
        transfer_in: 'outline',
        adjustment: 'default',
    };

    return (
        <Badge variant={variants[type] || 'default'}>
            {transactionTypes.find((t) => t.value === type)?.label || type}
        </Badge>
    );
};

export default function ItemHistoryTable({ history, onPageChange }: Props) {
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
                                    Item
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Gudang
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Jenis
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Referensi
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Qty Sebelum
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    <div className="flex items-center justify-end gap-1">
                                        Perubahan
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Qty Sesudah
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Catatan
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    User
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.data.length > 0 ? (
                                history.data.map((record) => (
                                    <TableRow
                                        key={record.id}
                                        className="border-zinc-700"
                                    >
                                        <TableCell className="text-zinc-300">
                                            {new Date(
                                                record.created_at,
                                            ).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            <div className="font-mono text-xs text-zinc-500">
                                                {record.item.code}
                                            </div>
                                            <div>{record.item.name}</div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            <div className="font-mono text-xs text-zinc-500">
                                                {record.warehouse.code}
                                            </div>
                                            <div>{record.warehouse.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            {getTransactionBadge(
                                                record.transaction_type,
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-zinc-300">
                                            {record.reference_id || '-'}
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            {Number(
                                                record.qty_before,
                                            ).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-semibold ${
                                                Number(record.qty_change) > 0
                                                    ? 'text-green-500'
                                                    : Number(
                                                            record.qty_change,
                                                        ) < 0
                                                      ? 'text-red-500'
                                                      : 'text-zinc-500'
                                            }`}
                                        >
                                            {Number(record.qty_change) > 0
                                                ? '+'
                                                : ''}
                                            {Number(
                                                record.qty_change,
                                            ).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-zinc-300">
                                            {Number(
                                                record.qty_after,
                                            ).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-sm text-zinc-400">
                                            {record.notes || '-'}
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            {record.creator.name}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="py-12 text-center text-zinc-400"
                                    >
                                        Tidak ada data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {history.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-zinc-700 px-6 py-4">
                        <div className="text-sm text-zinc-400">
                            Menampilkan {history.from} - {history.to} dari{' '}
                            {history.total} data
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() =>
                                    onPageChange(history.current_page - 1)
                                }
                                disabled={history.current_page === 1}
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 text-zinc-300"
                            >
                                Previous
                            </Button>
                            {Array.from(
                                { length: history.last_page },
                                (_, i) => i + 1,
                            )
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === history.last_page ||
                                        Math.abs(page - history.current_page) <=
                                            2,
                                )
                                .map((page, index, array) => {
                                    if (
                                        index > 0 &&
                                        page - array[index - 1] > 1
                                    ) {
                                        return (
                                            <span
                                                key={`ellipsis-${page}`}
                                                className="px-3 py-1 text-zinc-500"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={page}
                                            onClick={() => onPageChange(page)}
                                            variant={
                                                page === history.current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className={
                                                page === history.current_page
                                                    ? 'bg-amber-600 hover:bg-amber-700'
                                                    : 'border-zinc-700 text-zinc-300'
                                            }
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            <Button
                                onClick={() =>
                                    onPageChange(history.current_page + 1)
                                }
                                disabled={
                                    history.current_page === history.last_page
                                }
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 text-zinc-300"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
