<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\LeaveRequestRequest;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        return LeaveRequest::with('staff.user')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('staff_id'), fn ($q, $staffId) => $q->where('staff_id', $staffId))
            ->latest('start_date')
            ->paginate(20);
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return $leaveRequest->load('staff.user');
    }

    public function update(LeaveRequestRequest $request, LeaveRequest $leaveRequest)
    {
        $leaveRequest->update([
            'status' => $request->validated()['status'],
            'approved_by' => $request->user()->id,
        ]);

        return $leaveRequest->fresh('staff.user');
    }
}
