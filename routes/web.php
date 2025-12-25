<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemHistoryController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalesPersonController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check() 
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('warehouses', WarehouseController::class);
    Route::post('warehouses/{id}/restore', [WarehouseController::class, 'restore'])
        ->name('warehouses.restore');

    Route::resource('items', ItemController::class);
    Route::post('items/{id}/restore', [ItemController::class, 'restore'])
        ->name('items.restore');

    Route::resource('customers', CustomerController::class);
    Route::post('customers/{id}/restore', [CustomerController::class, 'restore'])
        ->name('customers.restore');

    Route::resource('suppliers', SupplierController::class);
    Route::post('suppliers/{id}/restore', [SupplierController::class, 'restore'])
        ->name('suppliers.restore');

    Route::resource('sales-persons', SalesPersonController::class);
    Route::post('sales-persons/{id}/restore', [SalesPersonController::class, 'restore'])
        ->name('sales-persons.restore');

    Route::resource('purchases', PurchaseController::class);
    Route::get('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])
        ->name('purchases.receive');
    Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'processReceive'])
        ->name('purchases.process-receive');

    Route::resource('sales', SaleController::class);
    Route::get('sales/{sale}/fulfill', [SaleController::class, 'fulfill'])
        ->name('sales.fulfill');
    Route::post('sales/{sale}/fulfill', [SaleController::class, 'processFulfill'])
        ->name('sales.process-fulfill');
    Route::get('sales/{sale}/print', [SaleController::class, 'print'])
        ->name('sales.print');

    Route::get('transfers', [TransferController::class, 'index'])
        ->name('transfers.index');
    Route::get('transfers/create', [TransferController::class, 'create'])
        ->name('transfers.create');
    Route::post('transfers', [TransferController::class, 'store'])
        ->name('transfers.store');
    Route::get('transfers/{transferNo}', [TransferController::class, 'show'])
        ->name('transfers.show');
    Route::get('transfers/{transferNo}/edit', [TransferController::class, 'edit'])
        ->name('transfers.edit');
    Route::put('transfers/{transferNo}', [TransferController::class, 'update'])
        ->name('transfers.update');
    Route::delete('transfers/{transferNo}', [TransferController::class, 'destroy'])
        ->name('transfers.destroy');
    Route::get('transfers/{transferNo}/process', [TransferController::class, 'process'])
        ->name('transfers.process');
    Route::post('transfers/{transferNo}/process', [TransferController::class, 'processTransfer'])
        ->name('transfers.process-transfer');

    Route::get('stock-adjustments', [StockAdjustmentController::class, 'index'])
        ->name('stock-adjustments.index');
    Route::get('stock-adjustments/create', [StockAdjustmentController::class, 'create'])
        ->name('stock-adjustments.create');
    Route::post('stock-adjustments', [StockAdjustmentController::class, 'store'])
        ->name('stock-adjustments.store');
    Route::get('stock-adjustments/{adjustmentNo}', [StockAdjustmentController::class, 'show'])
        ->name('stock-adjustments.show');

    Route::get('item-history', [ItemHistoryController::class, 'index'])
        ->name('item-history.index');
    Route::get('item-history/{id}', [ItemHistoryController::class, 'show'])
        ->name('item-history.show');

    Route::get('reports/sales', [ReportController::class, 'salesReport'])
        ->name('reports.sales');
    Route::get('reports/sales/export', [ReportController::class, 'exportSales'])
        ->name('reports.sales.export');
    Route::get('reports/stock', [ReportController::class, 'stockReport'])
        ->name('reports.stock');
    Route::get('reports/item-history', [ReportController::class, 'itemHistory'])
        ->name('reports.item-history');

    Route::resource('users', UserController::class);
});

require __DIR__.'/settings.php';
