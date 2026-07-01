<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;


/* ══════════════════════════════════════════════════════════════════════════
   ProfileController
══════════════════════════════════════════════════════════════════════════ */
class ProfileController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Profile', [
            'user' => auth()->user()->load('role.permissions'),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'email'                => "required|email|unique:users,email,{$user->id}",
            'current_password'     => 'nullable|string',
            'new_password'         => 'nullable|string|min:8|confirmed',
        ]);

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return redirect()->back()->withErrors(['current_password' => 'Incorrect current password.']);
            }
            $user->update(['password' => Hash::make($request->new_password)]);
        }

        $user->update(['name' => $validated['name'], 'email' => $validated['email']]);
        return redirect()->back()->with('success', 'Profile updated.');
    }
}
