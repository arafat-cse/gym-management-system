<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\HealthInfoRequest;
use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function show(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return $member->healthInfo ?? response()->json(null, 404);
    }

    public function update(HealthInfoRequest $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $healthInfo = $member->healthInfo()->updateOrCreate(
            ['member_id' => $member->id],
            $request->validated()
        );

        return $healthInfo;
    }
}
