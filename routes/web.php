<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SalesPersonController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Auth::check() 
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Warehouses - Admin only
    Route::resource('warehouses', WarehouseController::class);
    Route::post('warehouses/{id}/restore', [WarehouseController::class, 'restore'])
        ->name('warehouses.restore');

    // Items - Admin only
    Route::resource('items', ItemController::class);
    Route::post('items/{id}/restore', [ItemController::class, 'restore'])
        ->name('items.restore');

    // Customers - Admin only
    Route::resource('customers', CustomerController::class);
    Route::post('customers/{id}/restore', [CustomerController::class, 'restore'])
        ->name('customers.restore');

    // Suppliers - Admin only
    Route::resource('suppliers', SupplierController::class);
    Route::post('suppliers/{id}/restore', [SupplierController::class, 'restore'])
        ->name('suppliers.restore');

    // Sales Persons - Admin only
    Route::resource('sales-persons', SalesPersonController::class);
    Route::post('sales-persons/{id}/restore', [SalesPersonController::class, 'restore'])
        ->name('sales-persons.restore');

    // Purchases - Admin only
    Route::resource('purchases', PurchaseController::class);
    Route::get('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])
        ->name('purchases.receive');
    Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'processReceive'])
        ->name('purchases.process-receive');
});

require __DIR__.'/settings.php';
