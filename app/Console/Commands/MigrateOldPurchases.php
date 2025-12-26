<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Item;
use App\Models\Supplier;
use App\Models\Warehouse;

class MigrateOldPurchases extends Command
{
    protected $signature = 'migrate:old-purchases {--table=old_purchase}';
    protected $description = 'Migrate purchases from old database';

    public function handle()
    {
        $tableName = $this->option('table');

        if (!DB::getSchemaBuilder()->hasTable($tableName)) {
            $this->error("Table {$tableName} does not exist!");
            return 1;
        }

        $oldPurchases = DB::table($tableName)->orderBy('id')->get();
        $total = $oldPurchases->count();

        $this->info("Found {$total} purchases to migrate");

        $created = 0;
        $skipped = 0;
        $errors = 0;

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($oldPurchases as $oldPurchase) {
            try {
                $existingPurchase = Purchase::where('invoice_no', $oldPurchase->invoice_id)->first();

                if ($existingPurchase) {
                    $this->newLine();
                    $this->warn("Skipping purchase with invoice {$oldPurchase->invoice_id} - already exists");
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $supplier = Supplier::find($oldPurchase->supplier_id);
                if (!$supplier) {
                    $this->newLine();
                    $this->error("Supplier ID {$oldPurchase->supplier_id} not found for purchase {$oldPurchase->invoice_id}");
                    $errors++;
                    $bar->advance();
                    continue;
                }

                $items = json_decode($oldPurchase->items, true);
                if (empty($items) || !is_array($items)) {
                    $this->newLine();
                    $this->warn("Skipping purchase {$oldPurchase->invoice_id} - no items");
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $warehouseId = 1;
                $warehouse = Warehouse::find($warehouseId);
                if (!$warehouse) {
                    $this->newLine();
                    $this->error("Warehouse ID {$warehouseId} not found for purchase {$oldPurchase->invoice_id}");
                    $errors++;
                    $bar->advance();
                    continue;
                }

                $purchaseDate = $oldPurchase->data_date ?? $oldPurchase->created_at;

                $calculatedTotal = 0;
                foreach ($items as $itemData) {
                    $qty = $itemData['qty'] ?? 0;
                    $price = $itemData['price'] ?? 0;
                    $calculatedTotal += $qty * $price;
                }

                $finalTotal = $oldPurchase->total > 0 ? $oldPurchase->total : $calculatedTotal;

                $purchase = Purchase::create([
                    'invoice_no' => $oldPurchase->invoice_id,
                    'supplier_id' => $oldPurchase->supplier_id,
                    'warehouse_id' => $warehouseId,
                    'purchase_date' => $purchaseDate,
                    'status' => 'complete',
                    'subtotal' => $finalTotal,
                    'tax' => 0,
                    'discount' => 0,
                    'total' => $finalTotal,
                    'notes' => $oldPurchase->notes,
                    'processed_at' => $purchaseDate,
                    'created_by' => null,
                    'created_at' => $oldPurchase->created_at,
                    'updated_at' => $oldPurchase->updated_at,
                ]);

                foreach ($items as $itemData) {
                    $item = Item::find($itemData['id']);
                    if (!$item) {
                        $this->newLine();
                        $this->warn("Item ID {$itemData['id']} not found for purchase {$oldPurchase->invoice_id}, skipping item");
                        continue;
                    }

                    $qty = $itemData['qty'] ?? 0;
                    $price = $itemData['price'] ?? 0;

                    PurchaseItem::create([
                        'purchase_id' => $purchase->id,
                        'item_id' => $item->id,
                        'qty_ordered' => $qty,
                        'qty_received' => $qty,
                        'cost' => $price,
                        'subtotal' => $qty * $price,
                        'status' => 'complete',
                        'notes' => null,
                        'created_at' => $oldPurchase->created_at,
                        'updated_at' => $oldPurchase->updated_at,
                    ]);
                }

                $created++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error migrating purchase {$oldPurchase->invoice_id}: " . $e->getMessage());
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
