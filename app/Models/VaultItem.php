<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class VaultItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'encrypted_data',
        'type',
        'category',
        'favorite',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'favorite' => 'boolean',
    ];

    /**
     * Get the user that owns the vault item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Encrypt title before saving.
     */
    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = Crypt::encryptString($value);
    }

    /**
     * Decrypt title after retrieving.
     */
    public function getTitleAttribute($value): string
    {
        return Crypt::decryptString($value);
    }

    /**
     * Encrypt category before saving.
     */
    public function setCategoryAttribute($value): void
    {
        if ($value !== null) {
            $this->attributes['category'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt category after retrieving.
     */
    public function getCategoryAttribute($value): ?string
    {
        return $value ? Crypt::decryptString($value) : null;
    }
}
