<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return Attendance::where('member_id', $member->id)
            ->with('branch')
            ->latest('check_in')
            ->paginate(20);
    }

    public function calendar(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return Attendance::where('member_id', $member->id)
            ->whereYear('date', $request->query('year', now()->year))
            ->whereMonth('date', $request->query('month', now()->month))
            ->orderBy('date')
            ->get(['id', 'branch_id', 'date', 'check_in', 'check_out']);
    }
}
