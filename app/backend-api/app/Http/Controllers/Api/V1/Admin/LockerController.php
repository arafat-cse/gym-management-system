<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\LockerRequest;
use App\Models\Locker;

class LockerController extends Controller
{
    public function index()
    {
        return Locker::with('branch')->paginate(20);
    }

    public function store(LockerRequest $request)
    {
        $locker = Locker::create($request->validated());

        return response()->json($locker, 201);
    }

    public function show(Locker $locker)
    {
        return $locker->load(['branch', 'memberLocker.member.user']);
    }

    public function update(LockerRequest $request, Locker $locker)
    {
        $locker->update($request->validated());

        return $locker->fresh();
    }

    public function destroy(Locker $locker)
    {
        $locker->delete();

        return response()->json(null, 204);
    }
}
