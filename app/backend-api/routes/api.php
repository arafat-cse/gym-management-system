<?php

use App\Http\Controllers\Api\V1\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\BranchController;
use App\Http\Controllers\Api\V1\Admin\MemberController;
use App\Http\Controllers\Api\V1\Admin\MemberRegistrationController;
use App\Http\Controllers\Api\V1\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\V1\Admin\PaymentNumberController as AdminPaymentNumberController;
use App\Http\Controllers\Api\V1\Admin\PlanController;
use App\Http\Controllers\Api\V1\Admin\StaffController;
use App\Http\Controllers\Api\V1\Admin\SubscriptionController;
use App\Http\Controllers\Api\V1\Admin\TrainerController as AdminTrainerController;
use App\Http\Controllers\Api\V1\Admin\TrainingSessionController as AdminTrainingSessionController;
use App\Http\Controllers\Api\V1\Public\PaymentController as PublicPaymentController;
use App\Http\Controllers\Api\V1\Public\PaymentNumberController as PublicPaymentNumberController;
use App\Http\Controllers\Api\V1\Public\PricingController;
use App\Http\Controllers\Api\V1\Public\RegistrationController;
use App\Http\Controllers\Api\V1\Public\TrainerController as PublicTrainerController;
use App\Http\Controllers\Api\V1\User\AuthController as UserAuthController;
use App\Http\Controllers\Api\V1\User\TrainerController as UserTrainerController;
use App\Http\Controllers\Api\V1\User\TrainingSessionController as UserTrainingSessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/register', [RegistrationController::class, 'store']);
    Route::get('/plans', [PricingController::class, 'index']);
    Route::get('/trainers', [PublicTrainerController::class, 'index']);
    Route::get('/trainers/{trainer}', [PublicTrainerController::class, 'show']);
    Route::get('/payment-numbers', [PublicPaymentNumberController::class, 'index']);
    Route::post('/registrations/{memberRegistration}/payments', [PublicPaymentController::class, 'store']);

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
        });
    });

    Route::prefix('user')->group(function () {
        Route::post('/login', [UserAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'role:staff,trainer,member'])->group(function () {
            Route::post('/logout', [UserAuthController::class, 'logout']);
            Route::get('/trainers', [UserTrainerController::class, 'index']);
            Route::get('/trainers/{trainer}', [UserTrainerController::class, 'show']);
        });

        Route::middleware(['auth:sanctum', 'role:member'])->group(function () {
            Route::get('/training-sessions', [UserTrainingSessionController::class, 'index']);
            Route::post('/training-sessions', [UserTrainingSessionController::class, 'store']);
            Route::get('/training-sessions/{trainingSession}', [UserTrainingSessionController::class, 'show']);
            Route::post('/training-sessions/{trainingSession}/cancel', [UserTrainingSessionController::class, 'cancel']);
            Route::post('/training-sessions/{trainingSession}/rating', [UserTrainingSessionController::class, 'rate']);
        });
    });
});
