<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity');
            $table->text('uom');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });  
        Schema::create('recipe_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->integer('sequence');
            $table->text('method')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });             
    }

    public function down(): void
    {

        Schema::table('recipe_ingredients', function (Blueprint $table) {
            $table->dropForeign(['recipe_id']); // safer than using the constraint name
        });

        Schema::table('recipe_methods', function (Blueprint $table) {
            $table->dropForeign(['recipe_id']); // adjust column name if different
        });
        Schema::dropIfExists('recipe_ingredients');
        Schema::dropIfExists('recipe_methods');        
        Schema::dropIfExists('recipes');
    }
};
