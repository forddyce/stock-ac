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
import { Search } from 'lucide-react';

interface Item {
    id: number;
    code: string;
    name: string;
}

interface Warehouse {
    id: number;
    code: string;
    name: string;
}

interface Props {
    items: Item[];
    warehouses: Warehouse[];
    fromDate: string;
    toDate: string;
    itemId: string;
    warehouseId: string;
    transactionType: string;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onItemChange: (value: string) => void;
    onWarehouseChange: (value: string) => void;
    onTransactionTypeChange: (value: string) => void;
    onSearch: () => void;
}

const transactionTypes = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'transfer_out', label: 'Transfer Out' },
    { value: 'transfer_in', label: 'Transfer In' },
    { value: 'adjustment', label: 'Adjustment' },
];

export default function ItemHistoryFilter({
    items,
    warehouses,
    fromDate,
    toDate,
    itemId,
    warehouseId,
    transactionType,
    onFromDateChange,
    onToDateChange,
    onItemChange,
    onWarehouseChange,
    onTransactionTypeChange,
    onSearch,
}: Props) {
    return (
        <Card className="mb-6 border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Filter</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="from_date" className="text-zinc-300">
                            Dari Tanggal
                        </Label>
                        <Input
                            id="from_date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => onFromDateChange(e.target.value)}
                            className="border-zinc-700 bg-zinc-900 text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="to_date" className="text-zinc-300">
                            Sampai Tanggal
                        </Label>
                        <Input
                            id="to_date"
                            type="date"
                            value={toDate}
                            onChange={(e) => onToDateChange(e.target.value)}
                            className="border-zinc-700 bg-zinc-900 text-white"
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="transaction_type"
                            className="text-zinc-300"
                        >
                            Jenis Transaksi
                        </Label>
                        <Select
                            value={transactionType}
                            onValueChange={onTransactionTypeChange}
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Semua Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                {transactionTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="item" className="text-zinc-300">
                            Item
                        </Label>
                        <Select value={itemId} onValueChange={onItemChange}>
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Semua Item" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Item</SelectItem>
                                {items.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                    >
                                        {item.code} - {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="warehouse" className="text-zinc-300">
                            Gudang
                        </Label>
                        <Select
                            value={warehouseId}
                            onValueChange={onWarehouseChange}
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Semua Gudang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Gudang
                                </SelectItem>
                                {warehouses.map((warehouse) => (
                                    <SelectItem
                                        key={warehouse.id}
                                        value={warehouse.id.toString()}
                                    >
                                        {warehouse.code} - {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={onSearch}
                            className="w-full bg-amber-600 hover:bg-amber-700"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Cari
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
