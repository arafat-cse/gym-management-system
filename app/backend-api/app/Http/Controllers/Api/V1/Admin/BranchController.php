<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\BranchRequest;
use App\Models\Branch;

class BranchController extends Controller
{
    public function index()
    {
        return Branch::query()->paginate(20);
    }

    public function store(BranchRequest $request)
    {
        $branch = Branch::create($request->validated());

        return response()->json($branch, 201);
    }

    public function show(Branch $branch)
    {
        return $branch;
    }

    public function update(BranchRequest $request, Branch $branch)
    {
        $branch->update($request->validated());

        return $branch;
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json(null, 204);
    }
}
