<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    protected $fillable = [
        'transfer_no',
        'from_warehouse_id',
        'to_warehouse_id',
        'item_id',
        'qty_requested',
        'qty_sent',
        'qty_received',
        'transfer_date',
        'status',
        'notes',
        'idempotency_key',
        'processed_at',
        'created_by',
    ];

    protected $casts = [
        'transfer_date' => 'date',
        'qty_requested' => 'decimal:2',
        'qty_sent' => 'decimal:2',
        'qty_received' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
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
