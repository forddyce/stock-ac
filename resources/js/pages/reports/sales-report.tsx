import SalesReportFilter from '@/components/reports/sales-report-filter';
import SalesReportSummary from '@/components/reports/sales-report-summary';
import SalesReportTable from '@/components/reports/sales-report-table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface SalesPerson {
    id: number;
    code: string;
    name: string;
}

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
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [salesPersonId, setSalesPersonId] = useState(
        filters.sales_person_id || '',
    );

    const handleSearch = () => {
        if (!fromDate || !toDate) {
            return;
        }

        router.get(
            '/reports/sales',
            {
                from_date: fromDate,
                to_date: toDate,
                sales_person_id: salesPersonId || undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleExport = () => {
        if (!fromDate || !toDate) {
            return;
        }

        const params = new URLSearchParams({
            from_date: fromDate,
            to_date: toDate,
            ...(salesPersonId && { sales_person_id: salesPersonId }),
        });
        window.location.href = `/reports/sales/export?${params.toString()}`;
    };

    return (
        <AppLayout>
            <Head title="Laporan Penjualan" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Laporan Penjualan
                </h1>
                <p className="mt-1 text-zinc-400">
                    Lihat dan ekspor data penjualan
                </p>
            </div>

            <SalesReportFilter
                salesPersons={salesPersons}
                fromDate={fromDate}
                toDate={toDate}
                salesPersonId={salesPersonId}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onSalesPersonChange={setSalesPersonId}
                onSearch={handleSearch}
                onExport={handleExport}
                canExport={sales !== null && sales.length > 0}
            />

            <SalesReportSummary summary={summary} />

            <SalesReportTable sales={sales} />
        </AppLayout>
    );
}
