<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\AttendanceRequest;
use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        return Attendance::with(['member.user', 'branch'])
            ->when($request->query('member_id'), fn ($q, $memberId) => $q->where('member_id', $memberId))
            ->when($request->query('branch_id'), fn ($q, $branchId) => $q->where('branch_id', $branchId))
            ->when($request->query('date'), fn ($q, $date) => $q->whereDate('date', $date))
            ->latest('check_in')
            ->paginate(20);
    }

    public function show(Attendance $attendance)
    {
        return $attendance->load(['member.user', 'branch']);
    }

    public function checkIn(AttendanceRequest $request)
    {
        $data = $request->validated();

        $alreadyCheckedIn = Attendance::where('member_id', $data['member_id'])
            ->whereNull('check_out')
            ->exists();

        if ($alreadyCheckedIn) {
            throw ValidationException::withMessages([
                'member_id' => ['This member is already checked in.'],
            ]);
        }

        $member = Member::findOrFail($data['member_id']);

        $attendance = Attendance::create([
            'member_id' => $member->id,
            'branch_id' => $data['branch_id'] ?? $member->branch_id,
            'date' => now()->toDateString(),
            'check_in' => now(),
        ]);

        return response()->json($attendance->load(['member.user', 'branch']), 201);
    }

    public function checkOut(Attendance $attendance)
    {
        if ($attendance->check_out) {
            throw ValidationException::withMessages([
                'check_out' => ['This attendance record is already checked out.'],
            ]);
        }

        $attendance->update(['check_out' => now()]);

        return $attendance->fresh(['member.user', 'branch']);
    }
}
