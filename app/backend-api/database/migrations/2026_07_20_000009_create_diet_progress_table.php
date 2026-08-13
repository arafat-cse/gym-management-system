<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diet_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_diet_id')->constrained()->cascadeOnDelete();
            $table->decimal('weight', 5, 2);
            $table->date('date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diet_progress');
    }
};
