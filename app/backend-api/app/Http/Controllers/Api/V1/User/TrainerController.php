<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Trainer;

class TrainerController extends Controller
{
    public function index()
    {
        return Trainer::with(['branch', 'specializations'])
            ->where('status', 'active')
            ->get();
    }

    public function show(Trainer $trainer)
    {
        abort_if($trainer->status !== 'active', 404);

        return $trainer->load(['branch', 'specializations', 'schedules']);
    }
}
