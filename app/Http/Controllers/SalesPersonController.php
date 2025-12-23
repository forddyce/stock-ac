<?php

namespace App\Http\Controllers;

use App\Models\SalesPerson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesPersonController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function index(Request $request)
    {
        $query = SalesPerson::query()->withTrashed();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
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

        $salesPersons = $query->paginate(15)->withQueryString();

        return Inertia::render('sales-persons/index', [
            'salesPersons' => $salesPersons,
            'filters' => $request->only(['search', 'active', 'sort_by', 'sort_order']),
        ]);
    }

    public function create()
    {
        return Inertia::render('sales-persons/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:sales_persons,code',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        SalesPerson::create($validated);

        return redirect()->route('sales-persons.index')
            ->with('success', 'Sales person created successfully.');
    }

    public function edit(SalesPerson $salesPerson)
    {
        return Inertia::render('sales-persons/edit', [
            'salesPerson' => $salesPerson,
        ]);
    }

    public function update(Request $request, SalesPerson $salesPerson)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:sales_persons,code,' . $salesPerson->id,
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        $salesPerson->update($validated);

        return redirect()->route('sales-persons.index')
            ->with('success', 'Sales person updated successfully.');
    }

    public function destroy(SalesPerson $salesPerson)
    {
        $salesPerson->delete();

        return redirect()->route('sales-persons.index')
            ->with('success', 'Sales person deactivated successfully.');
    }

    public function restore($id)
    {
        $salesPerson = SalesPerson::withTrashed()->findOrFail($id);
        $salesPerson->restore();

        return redirect()->route('sales-persons.index')
            ->with('success', 'Sales person activated successfully.');
    }
}
