<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\ReviewRequest;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        return Review::with('trainer.user')
            ->where('member_id', $member->id)
            ->latest()
            ->paginate(20);
    }

    public function store(ReviewRequest $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);

        $review = Review::create([
            ...$request->validated(),
            'member_id' => $member->id,
        ]);

        return response()->json($review->load('trainer.user'), 201);
    }
}
