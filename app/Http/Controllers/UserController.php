<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;


/* ══════════════════════════════════════════════════════════════════════════
   UserController
══════════════════════════════════════════════════════════════════════════ */
class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with('role')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%"))
            ->when($request->role_id, fn($q) => $q->where('role_id', $request->role_id))
            ->orderBy('name')->paginate(15)->withQueryString();
        return Inertia::render('Users/Index', [
            'users'   => $users,
            'roles'   => Role::orderBy('name')->get(['id', 'name', 'display_name']),
            'filters' => $request->only(['search', 'role_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|string|min:8|confirmed',
            'role_id'   => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ]);
        User::create([...$validated, 'password' => Hash::make($validated['password'])]);
        return redirect()->back()->with('success', 'User created.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => "required|email|unique:users,email,{$user->id}",
            'password'  => 'nullable|string|min:8|confirmed',
            'role_id'   => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ]);
        if ($validated['password'] ?? null) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        $user->update($validated);
        return redirect()->back()->with('success', 'User updated.');
    }

    public function toggleActive(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot deactivate your own account.');
        }
        $user->update(['is_active' => !$user->is_active]);
        return redirect()->back()->with('success', 'User status updated.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot delete your own account.');
        }
        $user->delete();
        return redirect()->back()->with('success', 'User deleted.');
    }
}