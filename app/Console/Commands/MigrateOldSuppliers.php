<?php

namespace App\Console\Commands;

use App\Models\Supplier;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateOldSuppliers extends Command
{
    protected $signature = 'migrate:old-suppliers {--table=old_suppliers : The old suppliers table name}';
    protected $description = 'Migrate suppliers from old database table to new suppliers table';

    public function handle()
    {
        $oldTableName = $this->option('table');

        if (!DB::getSchemaBuilder()->hasTable($oldTableName)) {
            $this->error("Table '{$oldTableName}' does not exist!");
            return 1;
        }

        $this->info("Starting migration from '{$oldTableName}' to 'suppliers' table...");

        $oldSuppliers = DB::table($oldTableName)->get();

        if ($oldSuppliers->isEmpty()) {
            $this->warn('No suppliers found in the old table.');
            return 0;
        }

        $this->info("Found {$oldSuppliers->count()} suppliers to migrate.");

        $progressBar = $this->output->createProgressBar($oldSuppliers->count());
        $progressBar->start();

        $successCount = 0;
        $skipCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($oldSuppliers as $oldSupplier) {
            try {
                $baseCode = $this->generateCode($oldSupplier->name);
                $code = $baseCode;
                $counter = 1;

                while (Supplier::withTrashed()->where('code', $code)->exists()) {
                    $code = $baseCode . '-' . $counter;
                    $counter++;
                }

                $existingSupplier = Supplier::withTrashed()->where('name', $oldSupplier->name)->first();
                
                if ($existingSupplier) {
                    $this->newLine();
                    $this->warn("Skipping: Supplier '{$oldSupplier->name}' already exists (ID: {$existingSupplier->id})");
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }

                $info = json_decode($oldSupplier->info ?? '{}', true);
                $phone = $info['phone'] ?? null;
                $address = $info['address'] ?? null;

                Supplier::create([
                    'code' => $code,
                    'name' => $oldSupplier->name,
                    'address' => $address,
                    'phone' => $phone,
                    'notes' => $oldSupplier->notes,
                    'is_active' => (bool) $oldSupplier->is_active,
                    'created_at' => $oldSupplier->created_at ?? now(),
                    'updated_at' => $oldSupplier->updated_at ?? now(),
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'name' => $oldSupplier->name ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
                
                $this->newLine();
                $this->error("Error migrating supplier: {$oldSupplier->name}");
                $this->error($e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('=== Migration Summary ===');
        $this->info("Total suppliers processed: {$oldSuppliers->count()}");
        $this->info("Successfully migrated: {$successCount}");
        
        if ($skipCount > 0) {
            $this->warn("Skipped (already exists): {$skipCount}");
        }
        
        if ($errorCount > 0) {
            $this->error("Failed: {$errorCount}");
            
            if (!empty($errors)) {
                $this->newLine();
                $this->error('Failed suppliers:');
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
