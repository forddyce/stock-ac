import ConfirmDialog from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpDown, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    code: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    deleted_at: string | null;
}

interface Props {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
        active?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [active, setActive] = useState(filters.active || 'true');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'code');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const [confirmAction, setConfirmAction] = useState<() => void>(
        () => () => {},
    );

    const handleFilter = () => {
        router.get(
            '/customers',
            {
                search,
                active: active === 'all' ? undefined : active,
                sort_by: sortBy,
                sort_order: sortOrder,
            },
            { preserveState: true },
        );
    };

    const handleSort = (column: string) => {
        const newOrder =
            sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newOrder);
        router.get(
            '/customers',
            { search, active, sort_by: column, sort_order: newOrder },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number) => {
        setConfirmTitle('Deactivate Customer');
        setConfirmDescription(
            'Are you sure you want to deactivate this customer?',
        );
        setConfirmAction(() => () => router.delete(`/customers/${id}`));
        setConfirmOpen(true);
    };

    const handleRestore = (id: number) => {
        setConfirmTitle('Activate Customer');
        setConfirmDescription(
            'Are you sure you want to activate this customer?',
        );
        setConfirmAction(() => () => router.post(`/customers/${id}/restore`));
        setConfirmOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Customers" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <Link href="/customers/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    </Link>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilter()
                                }
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select value={active || 'all'} onValueChange={setActive}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleFilter}>Filter</Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <button
                                        onClick={() => handleSort('code')}
                                        className="flex items-center gap-1 font-semibold hover:text-primary"
                                    >
                                        Code
                                        <ArrowUpDown className="h-4 w-4" />
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => handleSort('name')}
                                        className="flex items-center gap-1 font-semibold hover:text-primary"
                                    >
                                        Name
                                        <ArrowUpDown className="h-4 w-4" />
                                    </button>
                                </TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">
                                            {customer.code}
                                        </TableCell>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>
                                            {customer.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {customer.email || '-'}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {customer.address || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {customer.deleted_at ? (
                                                <Badge variant="secondary">
                                                    Inactive
                                                </Badge>
                                            ) : (
                                                <Badge variant="default">
                                                    Active
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {customer.deleted_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRestore(
                                                                customer.id,
                                                            )
                                                        }
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/customers/${customer.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {customers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {customers.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        confirmAction();
                        setConfirmOpen(false);
                    }}
                    title={confirmTitle}
                    description={confirmDescription}
                />
            </div>
        </AppLayout>
    );
}
