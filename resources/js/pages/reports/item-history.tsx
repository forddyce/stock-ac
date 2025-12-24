import ItemHistoryFilter from '@/components/reports/item-history-filter';
import ItemHistoryTable from '@/components/reports/item-history-table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
    items: Item[];
    warehouses: Warehouse[];
    history: Pagination;
    filters: {
        from_date?: string;
        to_date?: string;
        item_id?: string;
        warehouse_id?: string;
        transaction_type?: string;
    };
}

export default function ItemHistory({
    items,
    warehouses,
    history,
    filters,
}: Props) {
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [itemId, setItemId] = useState(filters.item_id || '');
    const [warehouseId, setWarehouseId] = useState(filters.warehouse_id || '');
    const [transactionType, setTransactionType] = useState(
        filters.transaction_type || '',
    );

    const handleSearch = () => {
        router.get(
            '/reports/item-history',
            {
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                item_id: itemId || undefined,
                warehouse_id: warehouseId || undefined,
                transaction_type: transactionType || undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/reports/item-history',
            {
                ...filters,
                page,
            },
            {
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Item History" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Item History</h1>
                <p className="mt-1 text-zinc-400">
                    Lihat riwayat pergerakan stok item
                </p>
            </div>

            <ItemHistoryFilter
                items={items}
                warehouses={warehouses}
                fromDate={fromDate}
                toDate={toDate}
                itemId={itemId}
                warehouseId={warehouseId}
                transactionType={transactionType}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onItemChange={setItemId}
                onWarehouseChange={setWarehouseId}
                onTransactionTypeChange={setTransactionType}
                onSearch={handleSearch}
            />

            <ItemHistoryTable
                history={history}
                onPageChange={handlePageChange}
            />
        </AppLayout>
    );
}
