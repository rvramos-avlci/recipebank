<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = ['name', 'display_name', 'group'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions');
    }

    /**
     * All system permissions, grouped.
     */
    public static function allPermissions(): array
    {
        return [


            // recipes
            ['name' => 'recipes.view',   'display_name' => 'View Recipes',   'group' => 'recipes'],
            ['name' => 'recipes.create', 'display_name' => 'Create Recipes', 'group' => 'recipes'],
            ['name' => 'recipes.edit',   'display_name' => 'Edit Recipes',   'group' => 'recipes'],
            ['name' => 'recipes.delete', 'display_name' => 'Delete Recipes', 'group' => 'recipes'],
            ['name' => 'recipes.show',   'display_name' => 'Show Recipes',   'group' => 'recipes'],

            // Users & Roles
            ['name' => 'users.view',        'display_name' => 'View Users',            'group' => 'users'],
            ['name' => 'users.create',      'display_name' => 'Create Users',          'group' => 'users'],
            ['name' => 'users.edit',        'display_name' => 'Edit Users',            'group' => 'users'],
            ['name' => 'users.delete',      'display_name' => 'Delete Users',          'group' => 'users'],
            ['name' => 'roles.manage',      'display_name' => 'Manage Roles',          'group' => 'users'],
        ];
    }
}
