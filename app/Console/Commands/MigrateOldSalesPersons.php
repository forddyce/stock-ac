<?php

namespace App\Console\Commands;

use App\Models\SalesPerson;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateOldSalesPersons extends Command
{
    protected $signature = 'migrate:old-salespersons {--table=old_sales_persons : The old sales_person table name}';
    protected $description = 'Migrate sales persons from old database table to new sales_persons table';

    public function handle()
    {
        $oldTableName = $this->option('table');

        if (!DB::getSchemaBuilder()->hasTable($oldTableName)) {
            $this->error("Table '{$oldTableName}' does not exist!");
            return 1;
        }

        $this->info("Starting migration from '{$oldTableName}' to 'sales_persons' table...");

        $oldSalesPersons = DB::table($oldTableName)->get();

        if ($oldSalesPersons->isEmpty()) {
            $this->warn('No sales persons found in the old table.');
            return 0;
        }

        $this->info("Found {$oldSalesPersons->count()} sales persons to migrate.");

        $progressBar = $this->output->createProgressBar($oldSalesPersons->count());
        $progressBar->start();

        $successCount = 0;
        $skipCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($oldSalesPersons as $oldSalesPerson) {
            try {
                $baseCode = $this->generateCode($oldSalesPerson->name);
                $code = $baseCode;
                $counter = 1;

                while (SalesPerson::withTrashed()->where('code', $code)->exists()) {
                    $code = $baseCode . '-' . $counter;
                    $counter++;
                }

                $existingSalesPerson = SalesPerson::withTrashed()->where('name', $oldSalesPerson->name)->first();
                
                if ($existingSalesPerson) {
                    $this->newLine();
                    $this->warn("Skipping: Sales Person '{$oldSalesPerson->name}' already exists (ID: {$existingSalesPerson->id})");
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }

                $info = json_decode($oldSalesPerson->info ?? '{}', true);
                $phone = $info['phone'] ?? null;

                SalesPerson::create([
                    'code' => $code,
                    'name' => $oldSalesPerson->name,
                    'phone' => $phone,
                    'is_active' => (bool) $oldSalesPerson->is_active,
                    'created_at' => $oldSalesPerson->created_at ?? now(),
                    'updated_at' => $oldSalesPerson->updated_at ?? now(),
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'name' => $oldSalesPerson->name ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
                
                $this->newLine();
                $this->error("Error migrating sales person: {$oldSalesPerson->name}");
                $this->error($e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('=== Migration Summary ===');
        $this->info("Total sales persons processed: {$oldSalesPersons->count()}");
        $this->info("Successfully migrated: {$successCount}");
        
        if ($skipCount > 0) {
            $this->warn("Skipped (already exists): {$skipCount}");
        }
        
        if ($errorCount > 0) {
            $this->error("Failed: {$errorCount}");
            
            if (!empty($errors)) {
                $this->newLine();
                $this->error('Failed sales persons:');
                foreach ($errors as $error) {
                    $this->error("- {$error['name']}: {$error['error']}");
                }
            }
        }

        $this->newLine();
        $this->info('Migration completed!');

        return 0;
    }

    private function generateCode(string $name): string
    {
        $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $name));
        
        if (strlen($code) > 20) {
            $code = substr($code, 0, 20);
        }
        
        if (strlen($code) < 3) {
            $words = explode(' ', $name);
            $firstWord = preg_replace('/[^A-Za-z0-9]/', '', $words[0]);
            $code = strtoupper(substr($firstWord, 0, 10));
            
            while (strlen($code) < 3) {
                $code .= 'X';
            }
        }
        
        return $code;
    }
}
