<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diet_meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diet_plan_id')->constrained()->cascadeOnDelete();
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->string('name');
            $table->unsignedInteger('calories')->nullable();
            $table->decimal('protein', 6, 2)->nullable();
            $table->decimal('carbs', 6, 2)->nullable();
            $table->decimal('fats', 6, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diet_meals');
    }
};
