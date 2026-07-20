<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Member extends Model
{
    protected $fillable = ['user_id', 'branch_id', 'phone', 'address'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function trainingSessions(): HasMany
    {
        return $this->hasMany(TrainingSession::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function memberDiets(): HasMany
    {
        return $this->hasMany(MemberDiet::class);
    }

    public function memberWorkouts(): HasMany
    {
        return $this->hasMany(MemberWorkout::class);
    }

    public function healthInfo(): HasOne
    {
        return $this->hasOne(HealthInfo::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function memberLocker(): HasOne
    {
        return $this->hasOne(MemberLocker::class);
    }
}
