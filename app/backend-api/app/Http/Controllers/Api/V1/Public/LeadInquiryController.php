<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Public\LeadInquiryRequest;
use App\Models\LeadInquiry;

class LeadInquiryController extends Controller
{
    public function store(LeadInquiryRequest $request)
    {
        $inquiry = LeadInquiry::create($request->validated());

        return response()->json($inquiry, 201);
    }
}
