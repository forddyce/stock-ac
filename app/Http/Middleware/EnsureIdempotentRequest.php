<?php

namespace App\Http\Middleware;

use App\Models\Purchase;
use App\Models\Sale;
use App\Models\StockAdjustment;
use App\Models\Transfer;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIdempotentRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->isMethod('POST') && !$request->isMethod('PUT') && !$request->isMethod('PATCH')) {
            return $next($request);
        }

        $idempotencyKey = $request->header('X-Idempotency-Key') ?? $request->input('idempotency_key');

        if (!$idempotencyKey) {
            return $next($request);
        }

        $existingTransaction = $this->findExistingTransaction($idempotencyKey);

        if ($existingTransaction) {
            return response()->json([
                'message' => 'Transaction already processed',
                'data' => $existingTransaction,
            ], 200);
        }

        if (!$request->has('idempotency_key')) {
            $request->merge(['idempotency_key' => $idempotencyKey]);
        }

        return $next($request);
    }

    protected function findExistingTransaction(string $key)
    {
        $models = [
            Purchase::class,
            Sale::class,
            Transfer::class,
            StockAdjustment::class,
        ];

        foreach ($models as $model) {
            $existing = $model::where('idempotency_key', $key)->first();
            if ($existing) {
                return $existing->load($this->getRelations($model));
            }
        }

        return null;
    }

    protected function getRelations(string $model): array
    {
        return match ($model) {
            Purchase::class => ['items.item', 'supplier', 'warehouse'],
            Sale::class => ['items.item', 'customer', 'warehouse', 'salesPerson'],
            Transfer::class => ['item', 'fromWarehouse', 'toWarehouse'],
            StockAdjustment::class => ['item', 'warehouse'],
            default => [],
        };
    }
}
