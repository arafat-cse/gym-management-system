<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DietProgress;
use Illuminate\Http\Request;

class DietProgressController extends Controller
{
    public function index(Request $request)
    {
        return DietProgress::with('memberDiet.member.user')
            ->when($request->query('member_diet_id'), fn ($q, $id) => $q->where('member_diet_id', $id))
            ->latest('date')
            ->paginate(20);
    }
}
