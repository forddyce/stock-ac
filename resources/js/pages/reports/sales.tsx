import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Download, Search } from 'lucide-react';
import { useState } from 'react';

interface SalesPerson {
    id: number;
    code: string;
    name: string;
}

interface SaleItem {
    item: {
        name: string;
        code: string;
        unit: string;
    };
    qty_ordered: number;
    price: number;
    subtotal: number;
}

interface Sale {
    id: number;
    invoice_no: string;
    sale_date: string;
    customer: {
        name: string;
    };
    salesPerson: {
        name: string;
    } | null;
    items: SaleItem[];
    total: number;
    status: string;
}

interface Summary {
    total_sales: number;
    total_items: number;
    total_amount: number;
}

interface Props {
    salesPersons: SalesPerson[];
    sales: Sale[] | null;
    summary: Summary | null;
    filters: {
        from_date?: string;
        to_date?: string;
        sales_person_id?: string;
    };
}

export default function SalesReport({
    salesPersons,
    sales,
    summary,
    filters,
}: Props) {
    const [formData, setFormData] = useState({
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
        sales_person_id: filters.sales_person_id || 'all',
    });

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/reports/sales',
            {
                from_date: formData.from_date,
                to_date: formData.to_date,
                sales_person_id:
                    formData.sales_person_id !== 'all'
                        ? formData.sales_person_id
                        : undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleExport = () => {
        window.location.href = `/reports/sales/export?from_date=${formData.from_date}&to_date=${formData.to_date}${formData.sales_person_id !== 'all' ? `&sales_person_id=${formData.sales_person_id}` : ''}`;
    };

    return (
        <AppLayout>
            <Head title="Sales Report" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Sales Report
                    </h1>
                </div>

                {/* Filter Card */}
                <Card className="mb-6 border-zinc-700 bg-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch}>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div>
                                    <Label
                                        htmlFor="from_date"
                                        className="text-zinc-200"
                                    >
                                        From Date *
                                    </Label>
                                    <Input
                                        id="from_date"
                                        type="date"
                                        value={formData.from_date}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'from_date',
                                                e.target.value,
                                            )
                                        }
                                        className="border-zinc-700 bg-zinc-900 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="to_date"
                                        className="text-zinc-200"
                                    >
                                        To Date *
                                    </Label>
                                    <Input
                                        id="to_date"
                                        type="date"
                                        value={formData.to_date}
                                        onChange={(e) =>
                                            handleFormChange(
                                                'to_date',
                                                e.target.value,
                                            )
                                        }
                                        className="border-zinc-700 bg-zinc-900 text-white"
                                        required
                                    />
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
                                            handleFormChange(
                                                'sales_person_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-zinc-700 bg-zinc-900">
                                            <SelectItem value="all">
                                                All Sales Persons
                                            </SelectItem>
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
                                        type="submit"
                                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                    {sales && sales.length > 0 && (
                                        <Button
                                            type="button"
                                            onClick={handleExport}
                                            variant="outline"
                                            className="border-zinc-700 text-white hover:bg-zinc-700"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {summary && (
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-zinc-400">
                                    Total Transactions
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    {summary.total_sales}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-zinc-400">
                                    Total Items Sold
                                </div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    {summary.total_items.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-zinc-700 bg-zinc-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-zinc-400">
                                    Total Amount
                                </div>
                                <div className="mt-2 text-2xl font-bold text-amber-500">
                                    {Number(
                                        summary.total_amount,
                                    ).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Results Table */}
                {sales && sales.length > 0 ? (
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Sales Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                                        <TableHead className="text-zinc-300">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-zinc-300">
                                            Invoice No
                                        </TableHead>
                                        <TableHead className="text-zinc-300">
                                            Customer
                                        </TableHead>
                                        <TableHead className="text-zinc-300">
                                            Sales Person
                                        </TableHead>
                                        <TableHead className="text-zinc-300">
                                            Items
                                        </TableHead>
                                        <TableHead className="text-right text-zinc-300">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-center text-zinc-300">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales.map((sale) => (
                                        <TableRow
                                            key={sale.id}
                                            className="border-zinc-700"
                                        >
                                            <TableCell className="text-white">
                                                {new Date(
                                                    sale.sale_date,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {sale.invoice_no}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {sale.customer.name}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {sale.salesPerson?.name || '-'}
                                            </TableCell>
                                            <TableCell className="text-zinc-400">
                                                {sale.items.length} item(s)
                                            </TableCell>
                                            <TableCell className="text-right text-white">
                                                {Number(
                                                    sale.total,
                                                ).toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={
                                                        sale.status ===
                                                        'complete'
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : sale.status ===
                                                                'partial'
                                                              ? 'bg-blue-500/10 text-blue-500'
                                                              : 'bg-amber-500/10 text-amber-500'
                                                    }
                                                >
                                                    {sale.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : sales !== null ? (
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardContent className="py-12 text-center text-zinc-400">
                            No sales data found for the selected criteria.
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-zinc-700 bg-zinc-800">
                        <CardContent className="py-12 text-center text-zinc-400">
                            Please select a date range to view sales report.
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
