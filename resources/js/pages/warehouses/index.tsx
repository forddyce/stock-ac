import ConfirmDialog from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import type { SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, MoreVertical, Plus, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';

interface Warehouse {
    id: number;
    code: string;
    name: string;
    address: string | null;
    phone: string | null;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedWarehouses {
    data: Warehouse[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface WarehousesIndexProps extends SharedData {
    warehouses: PaginatedWarehouses;
    filters: {
        search?: string;
        active?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function WarehousesIndex({
    warehouses,
    filters,
}: WarehousesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.active || 'all');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/warehouses',
            {
                search: value,
                active: activeFilter !== 'all' ? activeFilter : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleActiveFilter = (value: string) => {
        setActiveFilter(value);
        router.get(
            '/warehouses',
            { search, active: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        setConfirmTitle('Deactivate Warehouse');
        setConfirmDescription(
            'Are you sure you want to deactivate this warehouse?',
        );
        setConfirmAction(() => () => router.delete(`/warehouses/${id}`));
        setConfirmOpen(true);
    };

    const handleRestore = (id: number) => {
        router.post(`/warehouses/${id}/restore`);
    };

    return (
        <AppLayout>
            <Head title="Warehouses" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Warehouses
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your warehouse locations
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/warehouses/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Warehouse
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search warehouses..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Select
                        value={activeFilter}
                        onValueChange={handleActiveFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {warehouses.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No warehouses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                warehouses.data.map((warehouse) => (
                                    <TableRow key={warehouse.id}>
                                        <TableCell className="font-medium">
                                            {warehouse.code}
                                        </TableCell>
                                        <TableCell>{warehouse.name}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {warehouse.address || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {warehouse.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {warehouse.deleted_at ? (
                                                <Badge variant="secondary">
                                                    Inactive
                                                </Badge>
                                            ) : (
                                                <Badge variant="default">
                                                    Active
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/warehouses/${warehouse.id}/edit`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {warehouse.deleted_at ? (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleRestore(
                                                                    warehouse.id,
                                                                )
                                                            }
                                                        >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            Activate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    warehouse.id,
                                                                )
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <PowerOff className="mr-2 h-4 w-4" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {warehouses.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {warehouses.links.map((link, index) => (
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
