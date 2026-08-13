<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LockerController extends Controller
{
    public function show(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $memberLocker = $member->memberLocker()->where('status', 'active')->with('locker')->first();

        return $memberLocker ?? response()->json(null, 404);
    }
}
