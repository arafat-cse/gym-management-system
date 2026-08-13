<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_workouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trainer_id')->nullable()->constrained()->nullOnDelete();
            $table->date('date');
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->enum('type', ['personal', 'group', 'cardio', 'strength', 'mixed'])->default('personal');
            $table->enum('intensity', ['low', 'medium', 'high'])->default('medium');
            $table->unsignedInteger('calories_burned')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_workouts');
    }
};
