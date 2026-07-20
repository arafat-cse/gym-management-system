<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\MemberLockerRequest;
use App\Models\Locker;
use App\Models\MemberLocker;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MemberLockerController extends Controller
{
    public function index()
    {
        return MemberLocker::with(['member.user', 'locker'])
            ->where('status', 'active')
            ->latest('assigned_at')
            ->paginate(20);
    }

    public function assign(MemberLockerRequest $request)
    {
        $data = $request->validated();
        $locker = Locker::findOrFail($data['locker_id']);

        if ($locker->status !== 'available') {
            throw ValidationException::withMessages([
                'locker_id' => ['This locker is not available.'],
            ]);
        }

        $memberLocker = DB::transaction(function () use ($data, $locker) {
            $locker->update(['status' => 'occupied']);

            return MemberLocker::create([
                'member_id' => $data['member_id'],
                'locker_id' => $locker->id,
                'assigned_at' => now(),
            ]);
        });

        return response()->json($memberLocker->load(['member.user', 'locker']), 201);
    }

    public function release(MemberLocker $memberLocker)
    {
        if ($memberLocker->status !== 'active') {
            throw ValidationException::withMessages([
                'status' => ['This locker assignment is already released.'],
            ]);
        }

        DB::transaction(function () use ($memberLocker) {
            $memberLocker->update(['status' => 'released']);
            $memberLocker->locker->update(['status' => 'available']);
        });

        return $memberLocker->fresh(['member.user', 'locker']);
    }
}
