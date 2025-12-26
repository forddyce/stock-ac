<?php

namespace App\Console\Commands;

use App\Models\Customer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateOldCustomers extends Command
{
    protected $signature = 'migrate:old-customers {--table=old_customers : The old customers table name}';
    protected $description = 'Migrate customers from old database table to new customers table';

    public function handle()
    {
        $oldTableName = $this->option('table');

        if (!DB::getSchemaBuilder()->hasTable($oldTableName)) {
            $this->error("Table '{$oldTableName}' does not exist!");
            return 1;
        }

        $this->info("Starting migration from '{$oldTableName}' to 'customers' table...");

        $oldCustomers = DB::table($oldTableName)->get();

        if ($oldCustomers->isEmpty()) {
            $this->warn('No customers found in the old table.');
            return 0;
        }

        $this->info("Found {$oldCustomers->count()} customers to migrate.");

        $progressBar = $this->output->createProgressBar($oldCustomers->count());
        $progressBar->start();

        $successCount = 0;
        $skipCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($oldCustomers as $oldCustomer) {
            try {
                $baseCode = $this->generateCode($oldCustomer->name);
                $code = $baseCode;
                $counter = 1;

                while (Customer::withTrashed()->where('code', $code)->exists()) {
                    $code = $baseCode . '-' . $counter;
                    $counter++;
                }

                $existingCustomer = Customer::withTrashed()->where('name', $oldCustomer->name)->first();
                
                if ($existingCustomer) {
                    $this->newLine();
                    $this->warn("Skipping: Customer '{$oldCustomer->name}' already exists (ID: {$existingCustomer->id})");
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }

                $info = json_decode($oldCustomer->info ?? '{}', true);
                $phone = $info['phone'] ?? null;
                $address = $info['address'] ?? null;

                Customer::create([
                    'code' => $code,
                    'name' => $oldCustomer->name,
                    'address' => $address,
                    'phone' => $phone,
                    'customer_type' => 'retail',
                    'notes' => $oldCustomer->notes,
                    'is_active' => (bool) $oldCustomer->is_active,
                    'created_at' => $oldCustomer->created_at ?? now(),
                    'updated_at' => $oldCustomer->updated_at ?? now(),
                ]);

                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = [
                    'name' => $oldCustomer->name ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
                
                $this->newLine();
                $this->error("Error migrating customer: {$oldCustomer->name}");
                $this->error($e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('=== Migration Summary ===');
        $this->info("Total customers processed: {$oldCustomers->count()}");
        $this->info("Successfully migrated: {$successCount}");
        
        if ($skipCount > 0) {
            $this->warn("Skipped (already exists): {$skipCount}");
        }
        
        if ($errorCount > 0) {
            $this->error("Failed: {$errorCount}");
            
            if (!empty($errors)) {
                $this->newLine();
                $this->error('Failed customers:');
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
