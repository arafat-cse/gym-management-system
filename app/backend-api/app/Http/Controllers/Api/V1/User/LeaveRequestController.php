<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\LeaveRequestRequest;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $staff = $request->user()->staff;

        abort_if(! $staff, 403);

        return LeaveRequest::where('staff_id', $staff->id)->latest('start_date')->paginate(20);
    }

    public function store(LeaveRequestRequest $request)
    {
        $staff = $request->user()->staff;

        abort_if(! $staff, 403);

        $leaveRequest = LeaveRequest::create([
            ...$request->validated(),
            'staff_id' => $staff->id,
        ]);

        return response()->json($leaveRequest, 201);
    }
}
