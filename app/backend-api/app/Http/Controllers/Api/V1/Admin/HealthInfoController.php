<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\HealthInfoRequest;
use App\Models\HealthInfo;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HealthInfoController extends Controller
{
    public function index(Request $request)
    {
        return HealthInfo::with('member.user')
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->paginate(20);
    }

    public function store(HealthInfoRequest $request)
    {
        $data = $request->validated();

        if (HealthInfo::where('member_id', $data['member_id'])->exists()) {
            throw ValidationException::withMessages([
                'member_id' => ['This member already has a health record. Use update instead.'],
            ]);
        }

        $healthInfo = HealthInfo::create($data);

        return response()->json($healthInfo->load('member.user'), 201);
    }

    public function show(HealthInfo $healthInfo)
    {
        return $healthInfo->load('member.user');
    }

    public function update(HealthInfoRequest $request, HealthInfo $healthInfo)
    {
        $data = $request->validated();
        unset($data['member_id']);

        $healthInfo->update($data);

        return $healthInfo->fresh('member.user');
    }
}
