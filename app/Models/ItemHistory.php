<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemHistory extends Model
{
    protected $fillable = [
        'batch_id',
        'item_id',
        'warehouse_id',
        'transaction_type',
        'reference_id',
        'qty_before',
        'qty_change',
        'qty_after',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'qty_before' => 'decimal:2',
        'qty_change' => 'decimal:2',
        'qty_after' => 'decimal:2',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
