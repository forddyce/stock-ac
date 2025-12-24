import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Shield, UserPen } from 'lucide-react';

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
    updated_at: string;
}

interface Props {
    user: User;
}

const roleColors: Record<string, string> = {
    admin: 'bg-amber-600',
    purchase_operator: 'bg-blue-600',
    sales_operator: 'bg-green-600',
    sales_purchase_operator: 'bg-purple-600',
};

export default function UserShow({ user }: Props) {
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
            <Head title={`User: ${user.name}`} />

            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.visit('/users')}
                    className="mb-4 text-zinc-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {user.name}
                        </h1>
                        <p className="mt-1 text-zinc-400">User details</p>
                    </div>
                    <Link href={`/users/${user.id}/edit`}>
                        <Button className="bg-amber-600 hover:bg-amber-700">
                            <UserPen className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-zinc-700 bg-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                                <Mail className="h-4 w-4" />
                                <span>Email</span>
                            </div>
                            <p className="text-white">{user.email}</p>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
                                <Shield className="h-4 w-4" />
                                <span>Role</span>
                            </div>
                            {user.roles.length > 0 ? (
                                getRoleBadge(user.roles[0].name)
                            ) : (
                                <p className="text-zinc-500">
                                    No role assigned
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-zinc-400">
                                Created At
                            </p>
                            <p className="text-white">
                                {new Date(user.created_at).toLocaleString(
                                    'id-ID',
                                    {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-zinc-400">
                                Last Updated
                            </p>
                            <p className="text-white">
                                {new Date(user.updated_at).toLocaleString(
                                    'id-ID',
                                    {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-700 bg-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Permissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.roles.length > 0 ? (
                            <div className="space-y-2">
                                {user.roles[0].name === 'admin' && (
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                                        <p className="font-medium text-amber-600">
                                            Full System Access
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            This user has access to all features
                                            and can manage other users.
                                        </p>
                                    </div>
                                )}
                                {user.roles[0].name === 'purchase_operator' && (
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                                        <p className="font-medium text-blue-600">
                                            Purchase Operations
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            Can manage purchases, suppliers, and
                                            inventory.
                                        </p>
                                    </div>
                                )}
                                {user.roles[0].name === 'sales_operator' && (
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                                        <p className="font-medium text-green-600">
                                            Sales Operations
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            Can manage sales, customers, and
                                            orders.
                                        </p>
                                    </div>
                                )}
                                {user.roles[0].name ===
                                    'sales_purchase_operator' && (
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                                        <p className="font-medium text-purple-600">
                                            Sales & Purchase Operations
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            Can manage both sales and purchase
                                            operations.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-zinc-500">
                                No permissions assigned
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
