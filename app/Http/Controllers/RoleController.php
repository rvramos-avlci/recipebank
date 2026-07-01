<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


/* ══════════════════════════════════════════════════════════════════════════
   RoleController
══════════════════════════════════════════════════════════════════════════ */
class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Roles/Index', [
            'roles'       => Role::withCount('users')->with('permissions')->orderBy('name')->get(),
            'permissions' => Permission::orderBy('group')->orderBy('name')->get()->groupBy('group'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:50|unique:roles|alpha_dash',
            'display_name' => 'required|string|max:100',
            'description'  => 'nullable|string',
            'permissions'  => 'array',
            'permissions.*'=> 'exists:permissions,name',
        ]);
        $role = Role::create(['name'=>$validated['name'],'display_name'=>$validated['display_name'],'description'=>$validated['description']??null]);
        $role->syncPermissions($validated['permissions'] ?? []);
        return redirect()->back()->with('success', 'Role created.');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'display_name' => 'required|string|max:100',
            'description'  => 'nullable|string',
            'permissions'  => 'array',
            'permissions.*'=> 'exists:permissions,name',
        ]);
        $role->update(['display_name'=>$validated['display_name'],'description'=>$validated['description']??null]);
        $role->syncPermissions($validated['permissions'] ?? []);
        return redirect()->back()->with('success', 'Role updated.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'admin') {
            return redirect()->back()->with('error', 'Cannot delete the admin role.');
        }
        if ($role->users()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete a role with assigned users.');
        }
        $role->delete();
        return redirect()->back()->with('success', 'Role deleted.');
    }
}