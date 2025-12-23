import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Supplier {
    id: number;
    name: string;
    code: string;
}

interface Warehouse {
    id: number;
    name: string;
    code: string;
}

interface Creator {
    id: number;
    name: string;
}

interface PurchaseDetailsDisplayProps {
    supplier: Supplier;
    warehouse: Warehouse;
    purchaseDate: string;
    creator: Creator;
    notes?: string;
}

export default function PurchaseDetailsDisplay({
    supplier,
    warehouse,
    purchaseDate,
    creator,
    notes,
}: PurchaseDetailsDisplayProps) {
    return (
        <Card className="border-zinc-700 bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Purchase Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-zinc-400">Supplier</p>
                        <p className="mt-1 font-medium text-white">
                            {supplier.name}
                        </p>
                        <p className="text-sm text-zinc-500">{supplier.code}</p>
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
                    <div>
                        <p className="text-sm text-zinc-400">Purchase Date</p>
                        <p className="mt-1 font-medium text-white">
                            {new Date(purchaseDate).toLocaleDateString(
                                'id-ID',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                },
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400">Created By</p>
                        <p className="mt-1 font-medium text-white">
                            {creator.name}
                        </p>
                    </div>
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
