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
import { FileDown, Search } from 'lucide-react';

interface SalesPerson {
    id: number;
    code: string;
    name: string;
}

interface Props {
    salesPersons: SalesPerson[];
    fromDate: string;
    toDate: string;
    salesPersonId: string;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onSalesPersonChange: (value: string) => void;
    onSearch: () => void;
    onExport: () => void;
    canExport: boolean;
}

export default function SalesReportFilter({
    salesPersons,
    fromDate,
    toDate,
    salesPersonId,
    onFromDateChange,
    onToDateChange,
    onSalesPersonChange,
    onSearch,
    onExport,
    canExport,
}: Props) {
    return (
        <Card className="mb-6 border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Filter</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                        <Label htmlFor="from_date" className="text-zinc-300">
                            Dari Tanggal <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="from_date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => onFromDateChange(e.target.value)}
                            className="border-zinc-700 bg-zinc-900 text-white"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="to_date" className="text-zinc-300">
                            Sampai Tanggal{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="to_date"
                            type="date"
                            value={toDate}
                            onChange={(e) => onToDateChange(e.target.value)}
                            className="border-zinc-700 bg-zinc-900 text-white"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="sales_person" className="text-zinc-300">
                            Sales Person
                        </Label>
                        <Select
                            value={salesPersonId}
                            onValueChange={onSalesPersonChange}
                        >
                            <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                <SelectValue placeholder="Semua Sales" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Sales</SelectItem>
                                {salesPersons.map((sp) => (
                                    <SelectItem
                                        key={sp.id}
                                        value={sp.id.toString()}
                                    >
                                        {sp.code} - {sp.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button
                            onClick={onSearch}
                            disabled={!fromDate || !toDate}
                            className="flex-1 bg-amber-600 hover:bg-amber-700"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Cari
                        </Button>
                        {canExport && (
                            <Button
                                onClick={onExport}
                                disabled={!fromDate || !toDate}
                                variant="outline"
                                className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                            >
                                <FileDown className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
