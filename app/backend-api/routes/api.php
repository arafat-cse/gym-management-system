<?php

use App\Http\Controllers\Api\V1\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Api\V1\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\BranchController;
use App\Http\Controllers\Api\V1\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\V1\Admin\DietPlanController as AdminDietPlanController;
use App\Http\Controllers\Api\V1\Admin\DietProgressController as AdminDietProgressController;
use App\Http\Controllers\Api\V1\Admin\DiscountController as AdminDiscountController;
use App\Http\Controllers\Api\V1\Admin\EquipmentController as AdminEquipmentController;
use App\Http\Controllers\Api\V1\Admin\ExerciseController as AdminExerciseController;
use App\Http\Controllers\Api\V1\Admin\ExpenseController as AdminExpenseController;
use App\Http\Controllers\Api\V1\Admin\HealthInfoController as AdminHealthInfoController;
use App\Http\Controllers\Api\V1\Admin\LeadInquiryController as AdminLeadInquiryController;
use App\Http\Controllers\Api\V1\Admin\LeaveRequestController as AdminLeaveRequestController;
use App\Http\Controllers\Api\V1\Admin\LockerController as AdminLockerController;
use App\Http\Controllers\Api\V1\Admin\MemberController;
use App\Http\Controllers\Api\V1\Admin\MemberDietController as AdminMemberDietController;
use App\Http\Controllers\Api\V1\Admin\MemberLockerController as AdminMemberLockerController;
use App\Http\Controllers\Api\V1\Admin\MemberRegistrationController;
use App\Http\Controllers\Api\V1\Admin\MemberWorkoutController as AdminMemberWorkoutController;
use App\Http\Controllers\Api\V1\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\V1\Admin\PaymentNumberController as AdminPaymentNumberController;
use App\Http\Controllers\Api\V1\Admin\PlanController;
use App\Http\Controllers\Api\V1\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\V1\Admin\StaffController;
use App\Http\Controllers\Api\V1\Admin\SubscriptionController;
use App\Http\Controllers\Api\V1\Admin\TrainerController as AdminTrainerController;
use App\Http\Controllers\Api\V1\Admin\TrainingSessionController as AdminTrainingSessionController;
use App\Http\Controllers\Api\V1\Public\BranchController as PublicBranchController;
use App\Http\Controllers\Api\V1\Public\CouponController as PublicCouponController;
use App\Http\Controllers\Api\V1\Public\LeadInquiryController as PublicLeadInquiryController;
use App\Http\Controllers\Api\V1\Public\PaymentController as PublicPaymentController;
use App\Http\Controllers\Api\V1\Public\PaymentNumberController as PublicPaymentNumberController;
use App\Http\Controllers\Api\V1\Public\PricingController;
use App\Http\Controllers\Api\V1\Public\RegistrationController;
use App\Http\Controllers\Api\V1\Public\TrainerController as PublicTrainerController;
use App\Http\Controllers\Api\V1\User\AttendanceController as UserAttendanceController;
use App\Http\Controllers\Api\V1\User\AuthController as UserAuthController;
use App\Http\Controllers\Api\V1\User\DietController as UserDietController;
use App\Http\Controllers\Api\V1\User\HealthController as UserHealthController;
use App\Http\Controllers\Api\V1\User\LeaveRequestController as UserLeaveRequestController;
use App\Http\Controllers\Api\V1\User\LockerController as UserLockerController;
use App\Http\Controllers\Api\V1\User\ReviewController as UserReviewController;
use App\Http\Controllers\Api\V1\User\TrainerController as UserTrainerController;
use App\Http\Controllers\Api\V1\User\TrainingSessionController as UserTrainingSessionController;
use App\Http\Controllers\Api\V1\User\WorkoutController as UserWorkoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/register', [RegistrationController::class, 'store']);
    Route::get('/branches', [PublicBranchController::class, 'index']);
    Route::get('/plans', [PricingController::class, 'index']);
    Route::get('/trainers', [PublicTrainerController::class, 'index']);
    Route::get('/trainers/{trainer}', [PublicTrainerController::class, 'show']);
    Route::get('/payment-numbers', [PublicPaymentNumberController::class, 'index']);
    Route::post('/registrations/{memberRegistration}/payments', [PublicPaymentController::class, 'store']);
    Route::post('/inquiries', [PublicLeadInquiryController::class, 'store']);
    Route::get('/coupons/validate', [PublicCouponController::class, 'validateCode']);

    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
            Route::post('/logout', [AdminAuthController::class, 'logout']);

            Route::apiResource('branches', BranchController::class);
            Route::apiResource('members', MemberController::class);
            Route::apiResource('staff', StaffController::class);
            Route::apiResource('plans', PlanController::class);
            Route::apiResource('subscriptions', SubscriptionController::class);

            Route::apiResource('trainers', AdminTrainerController::class);
            Route::get('/trainers/{trainer}/schedule', [AdminTrainerController::class, 'schedule']);
            Route::put('/trainers/{trainer}/schedule', [AdminTrainerController::class, 'updateSchedule']);
            Route::get('/trainers/{trainer}/specializations', [AdminTrainerController::class, 'specializations']);
            Route::post('/trainers/{trainer}/specializations', [AdminTrainerController::class, 'addSpecialization']);
            Route::delete('/trainers/{trainer}/specializations/{specialization}', [AdminTrainerController::class, 'removeSpecialization']);

            Route::get('/training-sessions', [AdminTrainingSessionController::class, 'index']);
            Route::get('/training-sessions/{trainingSession}', [AdminTrainingSessionController::class, 'show']);
            Route::put('/training-sessions/{trainingSession}', [AdminTrainingSessionController::class, 'update']);

            Route::apiResource('payment-numbers', AdminPaymentNumberController::class);
            Route::apiResource('coupons', AdminCouponController::class);
            Route::get('/discounts', [AdminDiscountController::class, 'index']);

            Route::apiResource('diet-plans', AdminDietPlanController::class);
            Route::get('/diet-plans/{dietPlan}/meals', [AdminDietPlanController::class, 'meals']);
            Route::post('/diet-plans/{dietPlan}/meals', [AdminDietPlanController::class, 'addMeal']);
            Route::delete('/diet-plans/{dietPlan}/meals/{meal}', [AdminDietPlanController::class, 'removeMeal']);
            Route::get('/member-diets', [AdminMemberDietController::class, 'index']);
            Route::post('/member-diets', [AdminMemberDietController::class, 'assign']);
            Route::get('/diet-progress', [AdminDietProgressController::class, 'index']);

            Route::apiResource('exercises', AdminExerciseController::class);
            Route::apiResource('member-workouts', AdminMemberWorkoutController::class);

            Route::get('/health-info', [AdminHealthInfoController::class, 'index']);
            Route::post('/health-info', [AdminHealthInfoController::class, 'store']);
            Route::get('/health-info/{healthInfo}', [AdminHealthInfoController::class, 'show']);
            Route::put('/health-info/{healthInfo}', [AdminHealthInfoController::class, 'update']);

            Route::get('/reviews', [AdminReviewController::class, 'index']);
            Route::put('/reviews/{review}', [AdminReviewController::class, 'update']);
            Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

            Route::apiResource('equipment', AdminEquipmentController::class);
            Route::get('/equipment/{equipment}/maintenance', [AdminEquipmentController::class, 'maintenance']);
            Route::post('/equipment/{equipment}/maintenance', [AdminEquipmentController::class, 'addMaintenance']);

            Route::apiResource('lockers', AdminLockerController::class);
            Route::get('/member-lockers', [AdminMemberLockerController::class, 'index']);
            Route::post('/member-lockers', [AdminMemberLockerController::class, 'assign']);
            Route::post('/member-lockers/{memberLocker}/release', [AdminMemberLockerController::class, 'release']);

            Route::get('/leave-requests', [AdminLeaveRequestController::class, 'index']);
            Route::get('/leave-requests/{leaveRequest}', [AdminLeaveRequestController::class, 'show']);
            Route::put('/leave-requests/{leaveRequest}', [AdminLeaveRequestController::class, 'update']);

            Route::apiResource('expenses', AdminExpenseController::class);
        });

        Route::middleware(['auth:sanctum', 'role:admin,staff'])->group(function () {
            Route::get('/registrations', [MemberRegistrationController::class, 'index']);
            Route::get('/registrations/{memberRegistration}', [MemberRegistrationController::class, 'show']);
            Route::post('/registrations/{memberRegistration}/approve', [MemberRegistrationController::class, 'approve']);
            Route::post('/registrations/{memberRegistration}/reject', [MemberRegistrationController::class, 'reject']);

            Route::get('/payments', [AdminPaymentController::class, 'index']);
            Route::get('/payments/{payment}', [AdminPaymentController::class, 'show']);
            Route::post('/payments/{payment}/approve', [AdminPaymentController::class, 'approve']);
            Route::post('/payments/{payment}/reject', [AdminPaymentController::class, 'reject']);

            Route::get('/attendance', [AdminAttendanceController::class, 'index']);
            Route::get('/attendance/{attendance}', [AdminAttendanceController::class, 'show']);
            Route::post('/attendance/check-in', [AdminAttendanceController::class, 'checkIn']);
            Route::post('/attendance/{attendance}/check-out', [AdminAttendanceController::class, 'checkOut']);

            Route::get('/inquiries', [AdminLeadInquiryController::class, 'index']);
            Route::get('/inquiries/{inquiry}', [AdminLeadInquiryController::class, 'show']);
            Route::put('/inquiries/{inquiry}', [AdminLeadInquiryController::class, 'update']);
        });
    });

    Route::prefix('user')->group(function () {
        Route::post('/login', [UserAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'role:staff,trainer,member'])->group(function () {
            Route::post('/logout', [UserAuthController::class, 'logout']);
            Route::get('/trainers', [UserTrainerController::class, 'index']);
            Route::get('/trainers/{trainer}', [UserTrainerController::class, 'show']);
            Route::get('/trainers/{trainer}/reviews', [UserTrainerController::class, 'reviews']);

            Route::get('/leave-requests', [UserLeaveRequestController::class, 'index']);
            Route::post('/leave-requests', [UserLeaveRequestController::class, 'store']);
        });

        Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
            Route::get('/training-sessions', [UserTrainingSessionController::class, 'index']);
            Route::post('/training-sessions', [UserTrainingSessionController::class, 'store']);
            Route::get('/training-sessions/{trainingSession}', [UserTrainingSessionController::class, 'show']);
            Route::post('/training-sessions/{trainingSession}/cancel', [UserTrainingSessionController::class, 'cancel']);
            Route::post('/training-sessions/{trainingSession}/rating', [UserTrainingSessionController::class, 'rate']);

            Route::get('/attendance', [UserAttendanceController::class, 'index']);
            Route::get('/attendance/calendar', [UserAttendanceController::class, 'calendar']);

            Route::get('/diet-plans', [UserDietController::class, 'availablePlans']);
            Route::get('/my-diet', [UserDietController::class, 'currentDiet']);
            Route::get('/diet-progress', [UserDietController::class, 'progress']);
            Route::post('/diet-progress', [UserDietController::class, 'updateProgress']);

            Route::get('/my-workouts', [UserWorkoutController::class, 'index']);
            Route::get('/my-workouts/{memberWorkout}', [UserWorkoutController::class, 'show']);
            Route::post('/my-workouts/{memberWorkout}/complete', [UserWorkoutController::class, 'complete']);
            Route::get('/exercises', [UserWorkoutController::class, 'exercises']);

            Route::get('/health-info', [UserHealthController::class, 'show']);
            Route::put('/health-info', [UserHealthController::class, 'update']);

            Route::get('/my-reviews', [UserReviewController::class, 'index']);
            Route::post('/reviews', [UserReviewController::class, 'store']);

            Route::get('/my-locker', [UserLockerController::class, 'show']);
        });
    });
});
