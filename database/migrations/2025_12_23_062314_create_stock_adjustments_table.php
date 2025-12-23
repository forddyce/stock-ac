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
        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();
            $table->string('adjustment_no', 100)->unique();
            $table->foreignId('warehouse_id')->constrained()->onDelete('restrict');
            $table->foreignId('item_id')->constrained()->onDelete('restrict');
            $table->enum('type', ['add', 'subtract']);
            $table->decimal('qty', 15, 2);
            $table->date('adjustment_date');
            $table->text('reason')->nullable();
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
        Schema::dropIfExists('stock_adjustments');
    }
};
