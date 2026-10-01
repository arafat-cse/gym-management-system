<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        try {
            $socialUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            return redirect()->away($frontendUrl.'/login?error='.urlencode('Google sign-in failed. Please try again.'));
        }

        $user = User::where('google_id', $socialUser->getId())
            ->orWhere('email', $socialUser->getEmail())
            ->first();

        if ($user) {
            $user->fill([
                'google_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
            ]);

            if (! $user->email_verified_at) {
                $user->email_verified_at = now();
            }

            $user->save();
        } else {
            $name = trim($socialUser->getName() ?: $socialUser->getNickname() ?: 'Gym Member');
            [$firstName, $lastName] = array_pad(explode(' ', $name, 2), 2, '');

            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $socialUser->getEmail(),
                'google_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
                'password' => Hash::make(bin2hex(random_bytes(16))),
                'role' => 'member',
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return redirect()->away($frontendUrl.'/auth/callback?token='.$token);
    }
}
