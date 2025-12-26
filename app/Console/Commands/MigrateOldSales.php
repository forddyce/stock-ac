<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Item;
use App\Models\Customer;
use App\Models\SalesPerson;
use App\Models\Warehouse;

class MigrateOldSales extends Command
{
    protected $signature = 'migrate:old-sales {--table=old_sales}';
    protected $description = 'Migrate sales from old database';

    public function handle()
    {
        $tableName = $this->option('table');

        if (!DB::getSchemaBuilder()->hasTable($tableName)) {
            $this->error("Table {$tableName} does not exist!");
            return 1;
        }

        $oldSales = DB::table($tableName)->orderBy('id')->get();
        $total = $oldSales->count();

        $this->info("Found {$total} sales to migrate");

        $created = 0;
        $skipped = 0;
        $errors = 0;

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($oldSales as $oldSale) {
            try {
                $existingSale = Sale::where('invoice_no', $oldSale->invoice_id)->first();

                if ($existingSale) {
                    $this->newLine();
                    $this->warn("Skipping sale with invoice {$oldSale->invoice_id} - already exists");
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $customer = Customer::find($oldSale->customer_id);
                if (!$customer) {
                    $this->newLine();
                    $this->error("Customer ID {$oldSale->customer_id} not found for sale {$oldSale->invoice_id}");
                    $errors++;
                    $bar->advance();
                    continue;
                }

                $items = json_decode($oldSale->items, true);
                if (empty($items) || !is_array($items)) {
                    $this->newLine();
                    $this->warn("Skipping sale {$oldSale->invoice_id} - no items");
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $warehouseId = 1;
                $warehouse = Warehouse::find($warehouseId);
                if (!$warehouse) {
                    $this->newLine();
                    $this->error("Warehouse ID {$warehouseId} not found for sale {$oldSale->invoice_id}");
                    $errors++;
                    $bar->advance();
                    continue;
                }

                $salesPersonId = null;
                if (!empty($oldSale->sales_person_id)) {
                    $salesPerson = SalesPerson::find($oldSale->sales_person_id);
                    if ($salesPerson) {
                        $salesPersonId = $salesPerson->id;
                    }
                }

                $saleDate = $oldSale->data_date ?? $oldSale->created_at;

                $calculatedTotal = 0;
                foreach ($items as $itemData) {
                    $qty = $itemData['qty'] ?? 0;
                    $price = $itemData['price'] ?? 0;
                    $calculatedTotal += $qty * $price;
                }

                $finalTotal = $oldSale->total > 0 ? $oldSale->total : $calculatedTotal;

                $sale = Sale::create([
                    'invoice_no' => $oldSale->invoice_id,
                    'customer_id' => $oldSale->customer_id,
                    'warehouse_id' => $warehouseId,
                    'sales_person_id' => $salesPersonId,
                    'sale_date' => $saleDate,
                    'status' => 'complete',
                    'subtotal' => $finalTotal,
                    'tax' => 0,
                    'discount' => 0,
                    'total' => $finalTotal,
                    'paid' => $finalTotal,
                    'payment_status' => 'paid',
                    'notes' => $oldSale->notes,
                    'processed_at' => $saleDate,
                    'created_by' => null,
                    'created_at' => $oldSale->created_at,
                    'updated_at' => $oldSale->updated_at,
                ]);

                foreach ($items as $itemData) {
                    $item = Item::find($itemData['id']);
                    if (!$item) {
                        $this->newLine();
                        $this->warn("Item ID {$itemData['id']} not found for sale {$oldSale->invoice_id}, skipping item");
                        continue;
                    }

                    $qty = $itemData['qty'] ?? 0;
                    $price = $itemData['price'] ?? 0;

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'item_id' => $item->id,
                        'qty_ordered' => $qty,
                        'qty_fulfilled' => $qty,
                        'price' => $price,
                        'subtotal' => $qty * $price,
                        'status' => 'complete',
                        'notes' => null,
                        'created_at' => $oldSale->created_at,
                        'updated_at' => $oldSale->updated_at,
                    ]);
                }

                $created++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error migrating sale {$oldSale->invoice_id}: " . $e->getMessage());
                $errors++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Migration completed!");
        $this->info("Created: {$created}");
        $this->info("Skipped: {$skipped}");
        $this->info("Errors: {$errors}");

        return 0;
    }
}
