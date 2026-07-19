<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheckMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole(...$roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
