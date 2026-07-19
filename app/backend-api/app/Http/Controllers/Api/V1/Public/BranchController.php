<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Branch;

class BranchController extends Controller
{
    public function index()
    {
        return Branch::query()
            ->where('status', 'active')
            ->get(['id', 'name', 'address', 'phone']);
    }
}
