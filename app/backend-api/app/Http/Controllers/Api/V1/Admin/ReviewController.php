<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\ReviewRequest;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        return Review::with(['member.user', 'trainer.user'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('trainer_id'), fn ($q, $trainerId) => $q->where('trainer_id', $trainerId))
            ->latest()
            ->paginate(20);
    }

    public function update(ReviewRequest $request, Review $review)
    {
        $review->update($request->validated());

        return $review->fresh(['member.user', 'trainer.user']);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(null, 204);
    }
}
