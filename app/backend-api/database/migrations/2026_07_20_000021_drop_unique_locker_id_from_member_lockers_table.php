<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_lockers', function (Blueprint $table) {
            // First check if the unique constraint exists before trying to drop it
            if (Schema::hasIndex('member_lockers', 'member_lockers_locker_id_unique', 'unique')) {
                $table->dropUnique(['locker_id']);
            }
            // Then add a regular index if it doesn't already exist
            if (!Schema::hasIndex('member_lockers', 'member_lockers_locker_id_index')) {
                $table->index('locker_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('member_lockers', function (Blueprint $table) {
            // First drop the regular index
            $table->dropIndex(['locker_id']);
            // Then add back the unique constraint
            $table->unique('locker_id');
        });
    }
};
