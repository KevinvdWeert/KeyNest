<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the vault items for the user.
     */
    public function vaultItems(): HasMany
    {
        return $this->hasMany(VaultItem::class);
    }

    /**
     * Check if user has a specific subscription tier.
     */
    public function hasSubscription(string $plan): bool
    {
        return $this->subscribed('default') && 
               $this->subscription('default')->stripe_price === config("services.stripe.plans.{$plan}");
    }

    /**
     * Get the maximum vault items allowed for the user's subscription.
     */
    public function getMaxVaultItems(): int
    {
        if ($this->subscribed('default')) {
            return PHP_INT_MAX; // Unlimited for PRO and PRO+
        }
        return 25; // Free tier limit
    }

    /**
     * Check if user can add more vault items.
     */
    public function canAddVaultItem(): bool
    {
        return $this->vaultItems()->count() < $this->getMaxVaultItems();
    }
}

