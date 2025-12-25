<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_dashboard',
            'view_reports',
            'manage_items',
            'manage_warehouses',
            'manage_suppliers',
            'manage_customers',
            'manage_sales_persons',
            'create_purchase',
            'view_purchase',
            'create_sale',
            'view_sale',
            'create_transfer',
            'view_transfer',
            'create_stock_adjustment',
            'view_item_history',
            'manage_users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $purchaseOperator = Role::create(['name' => 'purchase_operator']);
        $purchaseOperator->givePermissionTo([
            'view_dashboard',
            'create_purchase',
            'view_purchase',
            'manage_customers',
        ]);

        $salesOperator = Role::create(['name' => 'sales_operator']);
        $salesOperator->givePermissionTo([
            'view_dashboard',
            'create_sale',
            'view_sale',
            'manage_customers',
        ]);

        $salesPurchaseOperator = Role::create(['name' => 'sales_purchase_operator']);
        $salesPurchaseOperator->givePermissionTo([
            'view_dashboard',
            'create_purchase',
            'view_purchase',
            'create_sale',
            'view_sale',
            'manage_customers',
        ]);
    }
}
