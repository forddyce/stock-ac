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
            ['email' => 'admin@abc-elektronik.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('MasterPassword123!'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        $admin = User::firstOrCreate(
            ['email' => 'aively@abc-elektronik.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        $purchaseOp = User::firstOrCreate(
            ['email' => 'purchase@abc-elektronik.com'],
            [
                'name' => 'Purchase Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $purchaseOp->assignRole('purchase_operator');

        $salesOp = User::firstOrCreate(
            ['email' => 'sales@abc-elektronik.com'],
            [
                'name' => 'Sales Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $salesOp->assignRole('sales_operator');

        $salesPurchaseOp = User::firstOrCreate(
            ['email' => 'andriani@abc-elektronik.com'],
            [
                'name' => 'Andriani',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $salesPurchaseOp->assignRole('sales_purchase_operator');

        $salesPurchaseOp = User::firstOrCreate(
            ['email' => 'fionavera@abc-elektronik.com'],
            [
                'name' => 'Fiona Vera Jayanti',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $salesPurchaseOp->assignRole('sales_purchase_operator');
    }
}
