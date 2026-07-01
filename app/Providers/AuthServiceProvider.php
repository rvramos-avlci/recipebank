<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        // Gate::before – admin always passes
        Gate::before(function (User $user, string $ability) {
            if ($user->isAdmin()) return true;
        });

        // Dynamically register all string-based permissions as Gate abilities
        Gate::define('*', function (User $user, string $ability) {
            return $user->hasPermission($ability);
        });
    }
}
