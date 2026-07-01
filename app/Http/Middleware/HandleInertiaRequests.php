<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared data available to every React page via usePage().props
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'            => $user->id,
                    'name'          => $user->name,
                    'email'         => $user->email,
                    'is_active'     => $user->is_active,
                    'last_login_at' => $user->last_login_at,
                    'role'          => $user->role ? [
                        'id'           => $user->role->id,
                        'name'         => $user->role->name,
                        'display_name' => $user->role->display_name,
                    ] : null,
                    'permissions' => $user->allPermissions(),
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ]);
    }
}
