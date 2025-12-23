<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        $purchaseOp = User::firstOrCreate(
            ['email' => 'purchase@example.com'],
            [
                'name' => 'Purchase Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $purchaseOp->assignRole('purchase_operator');

        $salesOp = User::firstOrCreate(
            ['email' => 'sales@example.com'],
            [
                'name' => 'Sales Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $salesOp->assignRole('sales_operator');

        $salesPurchaseOp = User::firstOrCreate(
            ['email' => 'salespur@example.com'],
            [
                'name' => 'Sales Purchase Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $salesPurchaseOp->assignRole('sales_purchase_operator');
    }
}
