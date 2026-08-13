<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\MemberDietRequest;
use App\Models\MemberDiet;
use Illuminate\Http\Request;

class MemberDietController extends Controller
{
    public function index(Request $request)
    {
        return MemberDiet::with(['member.user', 'dietPlan'])
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest('start_date')
            ->paginate(20);
    }

    public function assign(MemberDietRequest $request)
    {
        $memberDiet = MemberDiet::create($request->validated());

        return response()->json($memberDiet->load(['member.user', 'dietPlan']), 201);
    }
}
