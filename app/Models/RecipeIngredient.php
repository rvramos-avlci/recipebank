<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecipeIngredient extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'description',
        'quantity',
        'uom',        
        'is_active',
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
