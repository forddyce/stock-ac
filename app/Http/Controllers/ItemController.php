<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function index(Request $request)
    {
        $query = Item::query()->withTrashed();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('unit', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->has('active')) {
            $active = filter_var($request->input('active'), FILTER_VALIDATE_BOOLEAN);
            if ($active) {
                $query->whereNull('deleted_at');
            } else {
                $query->whereNotNull('deleted_at');
            }
        }

        $sortBy = $request->input('sort_by', 'code');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $items = $query->paginate(15)->withQueryString();

        return Inertia::render('items/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'active', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        $warehouses = Warehouse::active()->get(['id', 'code', 'name']);

        return Inertia::render('items/create', [
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:items,code',
            'name' => 'required|string|max:255',
            'unit' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'initial_stock' => 'nullable|array',
            'initial_stock.*.warehouse_id' => 'required|exists:warehouses,id',
            'initial_stock.*.quantity' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $itemData = [
                'code' => $validated['code'],
                'name' => $validated['name'],
                'is_active' => $validated['is_active'] ?? true,
            ];

            if (!empty($validated['unit'])) {
                $itemData['unit'] = $validated['unit'];
            }
            if (!empty($validated['category'])) {
                $itemData['category'] = $validated['category'];
            }
            if (!empty($validated['description'])) {
                $itemData['description'] = $validated['description'];
            }

            $item = Item::create($itemData);

            if (!empty($validated['initial_stock'])) {
                foreach ($validated['initial_stock'] as $stock) {
                    if ($stock['quantity'] > 0) {
                        $item->warehouseItems()->create([
                            'warehouse_id' => $stock['warehouse_id'],
                            'quantity' => $stock['quantity'],
                        ]);
                    }
                }
            }
        });

        return redirect()->route('items.index')
            ->with('success', 'Item created successfully.');
    }

    public function edit($id)
    {
        $item = Item::withTrashed()->with('warehouseItems.warehouse')->findOrFail($id);

        return Inertia::render('items/edit', [
            'item' => $item,
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Item::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:items,code,' . $item->id,
            'name' => 'required|string|max:255',
            'unit' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'version' => 'required|integer',
        ]);

        if ($item->version !== $validated['version']) {
            throw ValidationException::withMessages([
                'version' => 'This item has been modified by another user. Please refresh and try again.',
            ]);
        }

        $itemData = [
            'code' => $validated['code'],
            'name' => $validated['name'],
        ];

        if (!empty($validated['unit'])) {
            $itemData['unit'] = $validated['unit'];
        }
        if (!empty($validated['category'])) {
            $itemData['category'] = $validated['category'];
        }
        if (!empty($validated['description'])) {
            $itemData['description'] = $validated['description'];
        }

        $item->update($itemData);

        if ($validated['is_active'] && $item->trashed()) {
            $item->restore();
        } elseif (!$validated['is_active'] && !$item->trashed()) {
            $item->delete();
        }

        return redirect()->route('items.index')
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('items.index')
            ->with('success', 'Item deactivated successfully.');
    }

    public function restore($id)
    {
        $item = Item::withTrashed()->findOrFail($id);
        $item->restore();

        return redirect()->route('items.index')
            ->with('success', 'Item activated successfully.');
    }
}
