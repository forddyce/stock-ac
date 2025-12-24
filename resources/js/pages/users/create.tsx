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
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

export default function UserCreate({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.visit('/users')}
                    className="mb-4 text-zinc-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
                <h1 className="text-3xl font-bold text-white">Create User</h1>
                <p className="mt-1 text-zinc-400">
                    Add a new user to the system
                </p>
            </div>

            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        User Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name" className="text-zinc-300">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-zinc-300"
                                >
                                    Email{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-zinc-300"
                                >
                                    Password{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-zinc-300"
                                >
                                    Confirm Password{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    className="border-zinc-700 bg-zinc-900 text-white"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-zinc-300">
                                    Role <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData('role', value)
                                    }
                                >
                                    <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.name
                                                    .split('_')
                                                    .map(
                                                        (word) =>
                                                            word
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            word.slice(1),
                                                    )
                                                    .join(' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Create User
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/users')}
                                className="border-zinc-700 text-zinc-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
