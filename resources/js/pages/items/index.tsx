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

interface Item {
    id: number;
    code: string;
    name: string;
    unit: string | null;
    category: string | null;
    description: string | null;
    version: number;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedItems {
    data: Item[];
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

interface ItemsIndexProps extends SharedData {
    items: PaginatedItems;
    filters: {
        search?: string;
        active?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function ItemsIndex({ items, filters }: ItemsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.active || 'all');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/items',
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
            '/items',
            { search, active: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to deactivate this item?')) {
            router.delete(`/items/${id}`);
        }
    };

    const handleRestore = (id: number) => {
        router.post(`/items/${id}/restore`);
    };

    return (
        <AppLayout>
            <Head title="Items" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Items
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your inventory items
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/items/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search items..."
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
                                <TableHead>Unit</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.code}
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            {item.unit || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.category || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                v{item.version}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.deleted_at ? (
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
                                                            href={`/items/${item.id}/edit`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {item.deleted_at ? (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleRestore(
                                                                    item.id,
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
                                                                    item.id,
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

                {items.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {items.links.map((link, index) => (
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
            </div>
        </AppLayout>
    );
}
