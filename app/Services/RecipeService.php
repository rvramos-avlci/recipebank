<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Support\Facades\DB;

class RecipeService
{
    public function create(array $data): Recipe
    {
        dd($data);
        return DB::transaction(function () use ($data) {
            $recipe = Recipe::create([
                'code'           => $data['code'],
                'description'    => $data['description'],
                'is_active'      => $data['is_active'],
            ]);

            foreach ($data['ingredients'] as $index => $itemData) {
                $recipe->ingredients()->create([
                    'description'    => $itemData['description'],
                    'quantity'       => $itemData['quantity'],                    
                    'uom'            => $itemData['uom'] ?? null,
                    'sort_order'     => $index,
                ]);
            }
            foreach ($data['methods'] as $index => $itemData) {
                $recipe->methods()->create([
                    'sequence'       => $itemData['sequence'],                    
                    'method'         => $itemData['method'],
                    'sort_order'     => $index,
                ]);
            }
            return $recipe->fresh(['ingredients', 'methods']);
        });
    }

    public function update(Recipe $recipe, array $data): Recipe
    {
        return DB::transaction(function () use ($recipe, $data) {

            $recipe->update([
                'code'           => $data['code'],
                'description'    => $data['description'],
                'is_active'      => $data['is_active'],
            ]);
        
            $recipe->ingredients()->delete();
            $recipe->methods()->delete();

            foreach ($data['ingredients'] as $index => $itemData) {
                $recipe->ingredients()->create([
                    'description'    => $itemData['description'],
                    'quantity'       => $itemData['quantity'],                    
                    'uom'            => $itemData['uom'] ?? null,
                    'sort_order'     => $index,
                ]);
            }
            foreach ($data['methods'] as $index => $itemData) {
                $recipe->methods()->create([
                    'sequence'       => $itemData['sequence'],                    
                    'method'         => $itemData['method'],
                    'sort_order'     => $index,
                ]);
            }
            return $recipe->fresh(['ingredients', 'methods']);
        });
    }

}
