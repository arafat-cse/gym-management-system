<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadInquiry extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'membership_plan_id', 'message', 'status', 'notes'];

    public function membershipPlan(): BelongsTo
    {
        return $this->belongsTo(MembershipPlan::class);
    }
}
