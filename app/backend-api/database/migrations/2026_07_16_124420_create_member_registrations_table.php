<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('member_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('password');
            $table->string('address')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('blood_group')->nullable();
            $table->string('religion')->nullable();
            $table->string('nid_number')->nullable();
            $table->string('birth_certificate_number')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->date('joining_date')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_registrations');
    }
};
