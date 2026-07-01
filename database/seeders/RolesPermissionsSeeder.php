<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Seed all permissions ──────────────────────────────────────────
        foreach (Permission::allPermissions() as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }

        $all = Permission::pluck('name')->toArray();

        // ── 2. Create roles ──────────────────────────────────────────────────

        // Admin – all permissions
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator', 'description' => 'Full system access']
        );
        $admin->syncPermissions($all);

        // Viewer – read-only
        $viewer = Role::firstOrCreate(
            ['name' => 'viewer'],
            ['display_name' => 'Viewer', 'description' => 'Read-only access']
        );
        $viewer->syncPermissions([
            'recipes.view',
        ]);

        // ── 3. Create default admin user ─────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@softdev.com'],
            [
                'name'      => 'System Admin',
                'password'  => Hash::make('P@ssw0rdqwerty'),
                'role_id'   => $admin->id,
                'is_active' => true,
            ]
        );

        // Demo users for each role
        $demoUsers = [
            ['name' => 'Damion Schaap',   'email' => 'damion.schaap@astoria.com.ph', 'role' => $viewer->id],
        ];

        foreach ($demoUsers as $u) {
            User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name'      => $u['name'],
                    'password'  => Hash::make('P@ssw0rdqwerty'),
                    'role_id'   => $u['role'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('✓ Roles, permissions, and demo users seeded.');
        $this->command->table(
            ['Email', 'Role', 'Password'],
            [
                ['admin@softdev.com',      'Administrator',   'P@ssw0rdqwerty'],
                ['damion.schaap@astoria.com.ph',     'Viewer',          'P@ssw0rdqwerty'],
            ]
        );
    }
}
