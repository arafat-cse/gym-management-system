<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberRegistration extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'address',
        'branch_id',
        'gender',
        'blood_group',
        'religion',
        'nid_number',
        'birth_certificate_number',
        'emergency_contact_number',
        'date_of_birth',
        'joining_date',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'joining_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
