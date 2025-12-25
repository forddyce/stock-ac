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
import { Eye, Plus, Search, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
}

interface Pagination {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    users: Pagination;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
}

const roleColors: Record<string, string> = {
    admin: 'bg-amber-600',
    purchase_operator: 'bg-blue-600',
    sales_operator: 'bg-green-600',
    sales_purchase_operator: 'bg-purple-600',
};

export default function UserIndex({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

    const handleSearch = () => {
        router.get(
            '/users',
            {
                search: search || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = () => {
        if (deleteTarget) {
            router.delete(`/users/${deleteTarget.id}`);
            setDeleteTarget(null);
        }
    };

    const getRoleBadge = (roleName: string) => {
        const colorClass = roleColors[roleName] || 'bg-zinc-600';
        const label = roleName
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return (
            <Badge className={`${colorClass} text-white`} variant="default">
                {label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Users</h1>
                    <p className="mt-1 text-zinc-400">
                        Manage system users and permissions
                    </p>
                </div>
                <Link href="/users/create">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="border-zinc-700 bg-zinc-900 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.name
                                        .split('_')
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1),
                                        )
                                        .join(' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleSearch}
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-700 hover:bg-zinc-800">
                            <TableHead className="text-zinc-300">
                                Name
                            </TableHead>
                            <TableHead className="text-zinc-300">
                                Email
                            </TableHead>
                            <TableHead className="text-zinc-300">
                                Role
                            </TableHead>
                            <TableHead className="text-zinc-300">
                                Created At
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="border-zinc-700"
                                >
                                    <TableCell className="font-medium text-white">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {user.roles.length > 0 &&
                                            getRoleBadge(user.roles[0].name)}
                                    </TableCell>
                                    <TableCell className="text-zinc-400">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/users/${user.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/users/${user.id}/edit`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-amber-600 hover:text-amber-500"
                                                >
                                                    <UserPen className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteTarget(user)
                                                }
                                                className="text-red-600 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-12 text-center text-zinc-400"
                                >
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {users.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-zinc-400">
                        Showing {users.from} to {users.to} of {users.total}{' '}
                        users
                    </div>
                    <div className="flex gap-2">
                        {users.links.map((link, index) => {
                            if (
                                link.label === '&laquo; Previous' ||
                                link.label === 'Next &raquo;'
                            ) {
                                return (
                                    <Button
                                        key={index}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        disabled={!link.url}
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 text-zinc-300"
                                    >
                                        {link.label === '&laquo; Previous'
                                            ? 'Previous'
                                            : 'Next'}
                                    </Button>
                                );
                            }
                            return (
                                <Button
                                    key={index}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className={
                                        link.active
                                            ? 'bg-amber-600 hover:bg-amber-700'
                                            : 'border-zinc-700 text-zinc-300'
                                    }
                                >
                                    {link.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete User"
                description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
            />
        </AppLayout>
    );
}
