<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_no', 100)->unique();
            $table->foreignId('from_warehouse_id')->constrained('warehouses')->onDelete('restrict');
            $table->foreignId('to_warehouse_id')->constrained('warehouses')->onDelete('restrict');
            $table->foreignId('item_id')->constrained()->onDelete('restrict');
            $table->decimal('qty_requested', 15, 2);
            $table->decimal('qty_sent', 15, 2)->default(0);
            $table->decimal('qty_received', 15, 2)->default(0);
            $table->date('transfer_date');
            $table->enum('status', ['pending', 'in_transit', 'complete', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->string('idempotency_key', 64)->unique()->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
