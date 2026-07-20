<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DietProgress extends Model
{
    protected $table = 'diet_progress';

    protected $fillable = ['member_diet_id', 'weight', 'date', 'notes'];

    public function memberDiet(): BelongsTo
    {
        return $this->belongsTo(MemberDiet::class);
    }
}
