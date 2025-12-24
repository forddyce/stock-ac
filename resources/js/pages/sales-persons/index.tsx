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

interface SalesPerson {
    id: number;
    code: string;
    name: string;
    phone: string | null;
    email: string | null;
    deleted_at: string | null;
}

interface Props {
    salesPersons: {
        data: SalesPerson[];
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

export default function Index({ salesPersons, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [active, setActive] = useState(filters.active || 'true');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'code');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const handleFilter = () => {
        router.get(
            '/sales-persons',
            { search, active, sort_by: sortBy, sort_order: sortOrder },
            { preserveState: true },
        );
    };

    const handleSort = (column: string) => {
        const newOrder =
            sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newOrder);
        router.get(
            '/sales-persons',
            { search, active, sort_by: column, sort_order: newOrder },
            { preserveState: true },
        );
    };

    const handleDelete = (id: number) => {
        setConfirmTitle('Deactivate Sales Person');
        setConfirmDescription(
            'Are you sure you want to deactivate this sales person?',
        );
        setConfirmAction(() => () => router.delete(`/sales-persons/${id}`));
        setConfirmOpen(true);
    };

    const handleRestore = (id: number) => {
        setConfirmTitle('Activate Sales Person');
        setConfirmDescription(
            'Are you sure you want to activate this sales person?',
        );
        setConfirmAction(
            () => () => router.post(`/sales-persons/${id}/restore`),
        );
        setConfirmOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Sales Persons" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Sales Persons</h1>
                    <Link href="/sales-persons/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Sales Person
                        </Button>
                    </Link>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search sales persons..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilter()
                                }
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select value={active} onValueChange={setActive}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                            <SelectItem value="">All</SelectItem>
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
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesPersons.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        No sales persons found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                salesPersons.data.map((salesPerson) => (
                                    <TableRow key={salesPerson.id}>
                                        <TableCell className="font-medium">
                                            {salesPerson.code}
                                        </TableCell>
                                        <TableCell>
                                            {salesPerson.name}
                                        </TableCell>
                                        <TableCell>
                                            {salesPerson.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {salesPerson.email || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {salesPerson.deleted_at ? (
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
                                                {salesPerson.deleted_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRestore(
                                                                salesPerson.id,
                                                            )
                                                        }
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/sales-persons/${salesPerson.id}/edit`}
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
                                                                    salesPerson.id,
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

                {salesPersons.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {salesPersons.links.map((link, index) => (
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
