<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\LeadInquiryRequest;
use App\Models\LeadInquiry;
use Illuminate\Http\Request;

class LeadInquiryController extends Controller
{
    public function index(Request $request)
    {
        return LeadInquiry::with('membershipPlan')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);
    }

    public function show(LeadInquiry $inquiry)
    {
        return $inquiry->load('membershipPlan');
    }

    public function update(LeadInquiryRequest $request, LeadInquiry $inquiry)
    {
        $inquiry->update($request->validated());

        return $inquiry->fresh('membershipPlan');
    }
}
