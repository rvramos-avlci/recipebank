<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecipeMethod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sequence',
        'method',
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
