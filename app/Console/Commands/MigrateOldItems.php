<?php

namespace App\Console\Commands;

use App\Models\Item;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MigrateOldItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:old-items {--table=old_items : The old items table name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate items from old database table to new items table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $oldTableName = $this->option('table');

        // Check if old table exists
        if (!DB::getSchemaBuilder()->hasTable($oldTableName)) {
            $this->error("Table '{$oldTableName}' does not exist!");
            return 1;
        }

        $this->info("Starting migration from '{$oldTableName}' to 'items' table...");

        // Get all records from old table
        $oldItems = DB::table($oldTableName)->get();

        if ($oldItems->isEmpty()) {
            $this->warn('No items found in the old table.');
            return 0;
        }

        $this->info("Found {$oldItems->count()} items to migrate.");

        $progressBar = $this->output->createProgressBar($oldItems->count());
        $progressBar->start();

        $successCount = 0;
        $skipCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($oldItems as $oldItem) {
            try {
                // Generate a unique code from the item name
                $baseCode = $this->generateCode($oldItem->name);
                $code = $baseCode;
                $counter = 1;

                // Ensure code is unique
                while (Item::withTrashed()->where('code', $code)->exists()) {
                    $code = $baseCode . '-' . $counter;
                    $counter++;
                }

                // Check if item with same name already exists
                $existingItem = Item::withTrashed()->where('name', $oldItem->name)->first();
                
                if ($existingItem) {
                    $this->newLine();
                    $this->warn("Skipping: Item '{$oldItem->name}' already exists (ID: {$existingItem->id})");
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }

                // Create new item
                Item::create([
                    'code' => $code,
                    'name' => $oldItem->name,
                    'unit' => $oldItem->unit ?? 'pcs',
                    'cost' => $oldItem->buy_price ?? 0,
                    'price' => $oldItem->sell_price ?? 0,
                    'is_active' => (bool) $oldItem->is_active,
                    'created_at' => $oldItem->created_at ?? now(),
                    'updated_at' => $oldItem->updated_at ?? now(),
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'name' => $oldItem->name ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
                
                $this->newLine();
                $this->error("Error migrating item: {$oldItem->name}");
                $this->error($e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $this->info('=== Migration Summary ===');
        $this->info("Total items processed: {$oldItems->count()}");
        $this->info("Successfully migrated: {$successCount}");
        
        if ($skipCount > 0) {
            $this->warn("Skipped (already exists): {$skipCount}");
        }
        
        if ($errorCount > 0) {
            $this->error("Failed: {$errorCount}");
            
            if (!empty($errors)) {
                $this->newLine();
                $this->error('Failed items:');
                foreach ($errors as $error) {
                    $this->error("- {$error['name']}: {$error['error']}");
                }
            }
        }

        $this->newLine();
        $this->info('Migration completed!');

        return 0;
    }

    /**
     * Generate a unique code from item name
     */
    private function generateCode(string $name): string
    {
        // Extract alphanumeric characters and convert to uppercase
        $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $name));
        
        // If code is too long, take first 20 characters
        if (strlen($code) > 20) {
            $code = substr($code, 0, 20);
        }
        
        // If code is empty or too short, use first word + numbers
        if (strlen($code) < 3) {
            $words = explode(' ', $name);
            $firstWord = preg_replace('/[^A-Za-z0-9]/', '', $words[0]);
            $code = strtoupper(substr($firstWord, 0, 10));
            
            // Add numbers if found in name
            preg_match_all('/\d+/', $name, $matches);
            if (!empty($matches[0])) {
                $code .= implode('', $matches[0]);
            }
            
            // If still too short, pad with X
            while (strlen($code) < 3) {
                $code .= 'X';
            }
        }
        
        return $code;
    }
}
