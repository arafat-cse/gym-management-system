<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\ExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        return Expense::with('branch')
            ->when($request->query('branch_id'), fn ($q, $branchId) => $q->where('branch_id', $branchId))
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->latest('date')
            ->paginate(20);
    }

    public function store(ExpenseRequest $request)
    {
        $expense = Expense::create([
            ...$request->validated(),
            'approved_by' => $request->user()->id,
        ]);

        return response()->json($expense->load('branch'), 201);
    }

    public function show(Expense $expense)
    {
        return $expense->load('branch');
    }

    public function update(ExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());

        return $expense->fresh('branch');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(null, 204);
    }
}
