<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\RecipeMethod;
use App\Services\RecipeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    private const CSV_HEADER = [
        'recipe_code', 'recipe_description', 'is_active',
        'row_type', 'seq', 'item_description', 'quantity', 'uom', 'method_text',
    ];

    public function __construct(private RecipeService $service) {}
    // Display a listing of recipes
    public function index(Request $request) :Response
    {
        $recipes = Recipe::with(['ingredients', 'methods'])
            ->when($request->search,    fn($q) => $q->where('description', 'like', "%{$request->search}%"))
            ->paginate(50)
            ->withQueryString();
        
        return Inertia::render('Recipes/Index', [
            'recipes'   => $recipes,
            'filters'  => $request->only(['search']),
        ]);
    }

    // Download recipes (with ingredients and methods) as CSV
    public function exportCsv(Request $request)
    {
        $recipes = Recipe::with(['ingredients', 'methods'])
            ->when($request->search, fn($q) => $q->where('description', 'like', "%{$request->search}%"))
            ->orderBy('code')
            ->get();

        $filename = 'recipes_' . now()->format('Y_m_d_His') . '.csv';

        return response()->streamDownload(function () use ($recipes) {
            $out = fopen('php://output', 'w');
            fputcsv($out, self::CSV_HEADER);

            foreach ($recipes as $recipe) {
                foreach ($recipe->methods as $method) {
                    fputcsv($out, [
                        $recipe->code, $recipe->description, $recipe->is_active ? 1 : 0,
                        'method', $method->sequence, '', '', '', $method->method,
                    ]);
                }
                foreach ($recipe->ingredients as $ingredient) {
                    fputcsv($out, [
                        $recipe->code, $recipe->description, $recipe->is_active ? 1 : 0,
                        'ingredient', '', $ingredient->description, $ingredient->quantity, $ingredient->uom, '',
                    ]);
                }
                if ($recipe->methods->isEmpty() && $recipe->ingredients->isEmpty()) {
                    fputcsv($out, [$recipe->code, $recipe->description, $recipe->is_active ? 1 : 0, '', '', '', '', '', '']);
                }
            }

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    // Bulk create/update recipes from an uploaded CSV
    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($handle);

        if ($header !== self::CSV_HEADER) {
            fclose($handle);
            return redirect()->back()->with('error', 'Invalid CSV format. Please use the exported template.');
        }

        $recipesData = [];
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) !== count(self::CSV_HEADER)) {
                continue;
            }
            $data = array_combine(self::CSV_HEADER, $row);
            $code = trim($data['recipe_code']);
            if ($code === '') {
                continue;
            }

            $recipesData[$code]['description'] = $data['recipe_description'];
            $recipesData[$code]['is_active'] = (bool) $data['is_active'];
            $recipesData[$code]['ingredients'] ??= [];
            $recipesData[$code]['methods'] ??= [];

            if ($data['row_type'] === 'method') {
                $recipesData[$code]['methods'][] = [
                    'sequence' => $data['seq'] !== '' ? (int) $data['seq'] : count($recipesData[$code]['methods']) + 1,
                    'method'   => $data['method_text'],
                ];
            } elseif ($data['row_type'] === 'ingredient') {
                $recipesData[$code]['ingredients'][] = [
                    'description' => $data['item_description'],
                    'quantity'    => $data['quantity'],
                    'uom'         => $data['uom'],
                ];
            }
        }
        fclose($handle);

        $count = 0;
        DB::transaction(function () use ($recipesData, &$count) {
            foreach ($recipesData as $code => $data) {
                $recipe = Recipe::updateOrCreate(
                    ['code' => $code],
                    ['description' => $data['description'], 'is_active' => $data['is_active']]
                );

                $recipe->ingredients()->delete();
                $recipe->methods()->delete();

                foreach ($data['ingredients'] as $ingredient) {
                    $recipe->ingredients()->create($ingredient);
                }
                foreach ($data['methods'] as $method) {
                    $recipe->methods()->create($method);
                }
                $count++;
            }
        });

        return redirect()->route('recipes.index')->with('success', "Imported {$count} recipe(s) from CSV.");
    }

    // Store a newly created recipe
    public function store(Request $request)
    {
        $recipe = Recipe::create($request->only(['code', 'description', 'is_active']));
        if ($request->has('ingredients')) {
            foreach ($request->ingredients as $ingredient) {
                $recipe->ingredients()->create($ingredient);
            }
        }
        if ($request->has('methods')) {
            foreach ($request->methods as $method) {
                $recipe->methods()->create($method);
            }
        }
        return redirect()->route('recipes.show', $recipe)->with('success', 'Recipe created.');
    }
    public function create(): Response
    {
        return Inertia::render('Recipes/Create');
    }    
    public function edit(Recipe $recipe): Response
    {
        return Inertia::render('Recipes/Edit', [
            'recipe'  => $recipe->load(['ingredients', 'methods']),
        ]);
    }
    // Display a specific recipe
    public function show(Recipe $recipe)
    {
        $recipe->load(['ingredients', 'methods']);
        return Inertia::render('Recipes/Show', [
            'recipe' => $recipe
        ]);
    }

    // Update a recipe
    public function update(Request $request, Recipe $recipe)
    {
        $recipe->update($request->only(['code', 'description', 'is_active']));
        $validated = $request->validate([
            'code'                          => 'required|string',
            'description'                   => 'required|string',
            'is_active'                     => 'required|boolean',
            'ingredients'                   => 'required|array|min:1',
            'ingredients.*.description'     => 'required|string',
            'ingredients.*.quantity'        => 'required|numeric|min:0.01',
            'ingredients.*.uom'             => 'required|string', 
            'methods'                       => 'required|array|min:1',
            'methods.*.sequence'            => 'required|numeric|min:1',
            'methods.*.method'              => 'required|string',                      
        ],
        );
        $this->service->update($recipe, $validated);
        return redirect()->route('recipes.show', $recipe->load(['ingredients', 'methods']))->with('success', 'Recipe updated.');
    }

    // Remove a recipe
    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
         return redirect()->route('recipes.index')->with('success', 'Recipe deleted.');
    }
}
