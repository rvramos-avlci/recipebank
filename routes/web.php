<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

// ── Auth ──────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',  [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── Authenticated ─────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Home (default landing page)
    Route::get('/',          fn() => redirect()->route('recipes.index'))->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile',   [ProfileController::class,   'show'])->name('profile');
    Route::put('/profile',   [ProfileController::class,   'update'])->name('profile.update');

    // Users
    Route::get('/users',                       [UserController::class, 'index'])       ->name('users.index')        ->middleware('permission:users.view');
    Route::post('/users',                      [UserController::class, 'store'])       ->name('users.store')        ->middleware('permission:users.create');
    Route::put('/users/{user}',                [UserController::class, 'update'])      ->name('users.update')       ->middleware('permission:users.edit');
    Route::post('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle')       ->middleware('permission:users.edit');
    Route::delete('/users/{user}',             [UserController::class, 'destroy'])     ->name('users.destroy')      ->middleware('permission:users.delete');

    // Roles
    Route::get('/roles',             [RoleController::class, 'index'])  ->name('roles.index')  ->middleware('permission:roles.manage');
    Route::post('/roles',            [RoleController::class, 'store'])  ->name('roles.store')  ->middleware('permission:roles.manage');
    Route::put('/roles/{role}',      [RoleController::class, 'update']) ->name('roles.update') ->middleware('permission:roles.manage');
    Route::delete('/roles/{role}',   [RoleController::class, 'destroy'])->name('roles.destroy')->middleware('permission:roles.manage');
 
    Route::get('/recipes',              [RecipeController::class, 'index'])->name('recipes.index')->middleware('permission:recipes.view');
    Route::get('/recipes/create',       [RecipeController::class, 'create'])->name('recipes.create')->middleware('permission:recipes.create');
    Route::post('/recipes',             [RecipeController::class, 'store'])->name('recipes.store')->middleware('permission:recipes.create');
    Route::get('/recipes/export',       [RecipeController::class, 'exportCsv'])->name('recipes.export')->middleware('permission:recipes.view');
    Route::post('/recipes/import',      [RecipeController::class, 'importCsv'])->name('recipes.import')->middleware('permission:recipes.create');
    Route::get('/recipes/{recipe}',     [RecipeController::class, 'show'])->name('recipes.show')->middleware('permission:recipes.show');
    Route::get('/recipes/{recipe}/edit',[RecipeController::class, 'edit'])->name('recipes.edit')->middleware('permission:recipes.edit');
    Route::put('/recipes/{recipe}',     [RecipeController::class, 'update'])->name('recipes.update')->middleware('permission:recipes.edit');
    Route::delete('/recipes/{recipe}',  [RecipeController::class, 'destroy'])->name('recipes.destroy')->middleware('permission:recipes.delete');
      
});
