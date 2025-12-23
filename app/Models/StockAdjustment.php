<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAdjustment extends Model
{
    protected $fillable = [
        'adjustment_no',
        'warehouse_id',
        'item_id',
        'type',
        'qty',
        'adjustment_date',
        'reason',
        'idempotency_key',
        'processed_at',
        'created_by',
    ];

    protected $casts = [
        'adjustment_date' => 'date',
        'qty' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
