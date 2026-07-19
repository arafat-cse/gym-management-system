<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class MemberRegistration extends Model
{
    protected $fillable = [
        'member_id',
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

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function approveIntoMember(int $approvedByUserId): Member
    {
        return DB::transaction(function () use ($approvedByUserId) {
            $user = User::create([
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'phone' => $this->phone,
                'password' => $this->password,
                'role' => 'member',
                'gender' => $this->gender,
                'blood_group' => $this->blood_group,
                'religion' => $this->religion,
                'nid_number' => $this->nid_number,
                'birth_certificate_number' => $this->birth_certificate_number,
                'emergency_contact_number' => $this->emergency_contact_number,
                'date_of_birth' => $this->date_of_birth,
                'joining_date' => $this->joining_date,
            ]);

            $member = Member::create([
                'user_id' => $user->id,
                'branch_id' => $this->branch_id,
                'address' => $this->address,
            ]);

            $this->update([
                'member_id' => $member->id,
                'status' => 'approved',
                'approved_by' => $approvedByUserId,
                'approved_at' => now(),
            ]);

            return $member;
        });
    }
}
