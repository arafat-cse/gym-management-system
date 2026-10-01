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
        // Signup step already created the account, so password may be absent —
        // keep a random one so approveIntoMember can still provision a user.
        $data['password'] = Hash::make($data['password'] ?? bin2hex(random_bytes(8)));
        $data['status'] = 'pending';

        $registration = MemberRegistration::create($data);

        return response()->json([
            'message' => 'Registration submitted. Awaiting approval.',
            'registration' => $registration,
        ], 201);
    }
}
