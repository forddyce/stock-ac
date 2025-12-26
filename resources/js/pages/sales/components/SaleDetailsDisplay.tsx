import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Customer {
    id: number;
    name: string;
    code: string;
}

interface Warehouse {
    id: number;
    name: string;
    code: string;
}

interface SalesPerson {
    id: number;
    name: string;
}

interface Creator {
    id: number;
    name: string;
}

interface SaleDetailsDisplayProps {
    customer: Customer;
    warehouse: Warehouse;
    salesPerson?: SalesPerson;
    saleDate: string;
    creator: Creator | null;
    notes?: string;
}

export default function SaleDetailsDisplay({
    customer,
    warehouse,
    salesPerson,
    saleDate,
    creator,
    notes,
}: SaleDetailsDisplayProps) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Sale Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-zinc-400">Customer</p>
                        <p className="mt-1 font-medium text-white">
                            {customer.name}
                        </p>
                        <p className="text-sm text-zinc-500">{customer.code}</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400">Warehouse</p>
                        <p className="mt-1 font-medium text-white">
                            {warehouse.name}
                        </p>
                        <p className="text-sm text-zinc-500">
                            {warehouse.code}
                        </p>
                    </div>
                    {salesPerson && (
                        <div>
                            <p className="text-sm text-zinc-400">
                                Sales Person
                            </p>
                            <p className="mt-1 font-medium text-white">
                                {salesPerson.name}
                            </p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-zinc-400">Sale Date</p>
                        <p className="mt-1 font-medium text-white">
                            {new Date(saleDate).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    {creator && (
                        <div>
                            <p className="text-sm text-zinc-400">Created By</p>
                            <p className="mt-1 font-medium text-white">
                                {creator.name}
                            </p>
                        </div>
                    )}
                    {notes && (
                        <div className="md:col-span-2">
                            <p className="text-sm text-zinc-400">Notes</p>
                            <p className="mt-1 text-white">{notes}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
