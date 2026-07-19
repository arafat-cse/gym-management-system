<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Public\MemberRegistrationRequest;
use App\Models\MemberRegistration;
use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{
    public function store(MemberRegistrationRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'pending';

        $registration = MemberRegistration::create($data);

        return response()->json([
            'message' => 'Registration submitted. Awaiting approval.',
            'registration' => $registration,
        ], 201);
    }
}
