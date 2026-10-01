<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\MemberRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        if (! $user->hasRole('member')) {
            throw ValidationException::withMessages([
                'email' => ['Please use the member portal to sign in.'],
            ]);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function signup(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'] ?? '',
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => 'member',
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        $step = 'register';
        $registrationId = null;
        $rejectionReason = null;

        $registration = MemberRegistration::where('email', $user->email)
            ->latest()
            ->first();

        if ($registration) {
            if ($registration->status === 'rejected') {
                $step = 'rejected';
                $rejectionReason = $registration->rejection_reason;
            } elseif ($registration->status === 'pending') {
                $hasPayment = $registration->payments()
                    ->whereIn('status', ['pending', 'approved'])
                    ->exists();
                $step = $hasPayment ? 'awaiting_approval' : 'payment';
                $registrationId = $registration->id;
            } elseif (in_array($registration->status, ['approved', 'completed'])) {
                $member = $user->member;
                $step = ($member && $member->subscriptions()->active()->exists())
                    ? 'active'
                    : 'expired';
            }
        }

        return response()->json([
            'user' => $user,
            'step' => $step,
            'registration_id' => $registrationId,
            'rejection_reason' => $rejectionReason,
        ]);
    }
}
