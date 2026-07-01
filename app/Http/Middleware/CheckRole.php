<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (in_array($user->role?->name, $roles)) {
            return $next($request);
        }

        return Inertia::render('Forbidden')->toResponse($request)->setStatusCode(403);
    }
}
