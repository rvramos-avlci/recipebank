<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use  HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'is_active', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'is_active'         => 'boolean',
        'password'          => 'hashed',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    // ─── Permission helpers ───────────────────────────────────────────────────

    public function hasPermission(string $permission): bool
    {
        if (!$this->role) return false;
        // Admin role bypasses all checks
        if ($this->role->name === 'admin') return true;
        return $this->role->hasPermission($permission);
    }

    public function can($permission, $arguments = []): bool
    {
        // Support both Gate checks and our own string-based permissions
        if (is_string($permission)) {
            return $this->hasPermission($permission);
        }
        return parent::can($permission, $arguments);
    }

    public function isAdmin(): bool
    {
        return $this->role?->name === 'admin';
    }

    public function allPermissions(): array
    {
        if (!$this->role) return [];
        if ($this->role->name === 'admin') {
            return Permission::pluck('name')->toArray();
        }
        return $this->role->permissions->pluck('name')->toArray();
    }

    // ─── Audit ───────────────────────────────────────────────────────────────

    public function log(string $action, $model = null, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id'    => $this->id,
            'action'     => $action,
            'model'      => $model ? get_class($model) : null,
            'model_id'   => $model?->id,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip_address' => request()->ip(),
        ]);
    }
}
