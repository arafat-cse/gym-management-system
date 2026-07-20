
# GMS Backend API — Build Tracker

Placeholder/empty files removed from repo (2026-07-15) to keep it clean. Full planned tree stays documented in the root `README.md`. This file tracks what's actually implemented, so future work can pick up step by step against the real repo state.

## ✅ Implemented — Auth (login/logout) + Role/Permission system

- `app/Models/User.php` — HasApiTokens (Sanctum), `role` fillable, `hasRole()`, `hasPermission()`
- `app/Models/Role.php` — NEW (not in original README list, added for role↔permission relation)
- `app/Models/Permission.php` — NEW (same reason)
- `app/Http/Middleware/Api/RoleCheckMiddleware.php` — `role:admin` / `role:staff,trainer,member` route guard
- `app/Http/Controllers/Api/V1/Admin/AuthController.php` — `login()`, `logout()` (role must be `admin`)
- `app/Http/Controllers/Api/V1/User/AuthController.php` — `login()`, `logout()` (role must NOT be `admin`)
- `routes/api.php` — `/api/v1/admin/login`, `/api/v1/admin/logout` (auth:sanctum,role:admin), `/api/v1/user/login`, `/api/v1/user/logout` (auth:sanctum,role:staff,trainer,member)
- `bootstrap/app.php` — registered `api` routing file + `role` middleware alias
- `database/migrations/2024_01_01_000001_create_users_table.php` — id, name, email, phone, password, `role` enum(admin,staff,trainer,member), timestamps
- `database/migrations/2024_01_01_000015_create_roles_and_permissions.php` — `roles`, `permissions`, `permission_role` pivot
- `database/migrations/2026_07_15_101807_create_personal_access_tokens_table.php` — Sanctum (auto-published)
- `database/seeders/RolesSeeder.php` — seeds 4 roles + 9 permissions, attaches per role
- `database/seeders/AdminSeeder.php` — seeds `admin@gms.test` / `password`
- `database/seeders/DatabaseSeeder.php` — calls RolesSeeder → AdminSeeder
- Package: `laravel/sanctum` installed via composer
- `.env` — DB switched to **MySQL** (`gms` database, `root`/`root` local), app key generated
- `bootstrap/app.php` — `$exceptions->shouldRenderJsonWhen(...)` added so API exceptions render as JSON instead of HTML
- `app/Providers/AppServiceProvider.php` — `Authenticate::redirectUsing(fn () => null)` so failed auth doesn't try to redirect to a non-existent `login` route (this API has none) and instead returns a clean 401 JSON

Verified: `php artisan migrate:fresh --seed` runs clean against MySQL. DB currently has only: `users`, `roles`, `permissions`, `permission_role`, `personal_access_tokens`, `cache`, `jobs` tables.

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/admin/login` → 200, returns `user` + Sanctum `token`
- `POST /api/v1/admin/logout` with `Authorization: Bearer <token>` → 200, revokes token
- Reusing a revoked token → `401 {"message":"Unauthenticated."}` (was a 500 crash before the two fixes above)
- Missing token on a protected route → `401 {"message":"Unauthenticated."}`
- `POST /api/v1/user/login` with an `admin`-role account → `422 {"message":"Invalid credentials."}` (role mismatch correctly rejected)

See `postman-api-test.md` for exact request bodies and how to create roles/permissions/users via `artisan tinker` (no CRUD API for these yet).

**Not yet built:** register (public sign-up), password reset, profile endpoints, permission-based (as opposed to role-based) middleware, rate limiting on login.

## ✅ Implemented — Branches, Members, Staff (full CRUD, relational)

- `database/migrations/2024_01_01_000002_create_branches_table.php` — id, name, address, phone, status enum(active,inactive)
- `database/migrations/2024_01_01_000003_create_members_table.php` — `user_id` (FK→users, unique, cascadeOnDelete), `branch_id` (FK→branches, nullable, nullOnDelete), phone, address
- `database/migrations/2024_01_01_000004_create_staff_table.php` — `user_id` (FK→users, unique, cascadeOnDelete), `branch_id` (FK→branches, nullable, nullOnDelete), designation, status enum(active,inactive,on_leave)
- `app/Models/Branch.php` — `hasMany(Member)`, `hasMany(Staff)`
- `app/Models/Member.php` — `belongsTo(User)`, `belongsTo(Branch)`
- `app/Models/Staff.php` — `belongsTo(User)`, `belongsTo(Branch)`
- `app/Models/User.php` — added `member()` / `staff()` `hasOne` relations
- `app/Http/Requests/Api/Admin/{BranchRequest,MemberRequest,StaffRequest}.php` — separate create/update validation rules (email uniqueness ignores self on update)
- `app/Http/Controllers/Api/V1/Admin/{BranchController,MemberController,StaffController}.php` — full CRUD (index paginated, store, show, update, destroy)
- `routes/api.php` — `Route::apiResource('branches'|'members'|'staff', ...)` inside the existing `auth:sanctum, role:admin` group

Design note: a Member/Staff row always has a matching User (1-to-1). `MemberController@store` / `StaffController@store` create the `User` (with `role=member`/`role=staff`) and the `Member`/`Staff` row together inside a DB transaction. `destroy()` deletes the `User`, which cascades to delete the `Member`/`Staff` row via the FK.

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/admin/branches` → 201, creates branch
- `POST /api/v1/admin/members` with `branch_id` → 201, creates `User(role=member)` + `Member` linked to branch, response includes `user` + `branch` eager-loaded
- `POST /api/v1/admin/staff` with `branch_id` + `designation` → 201, same pattern with `role=staff`
- `GET /api/v1/admin/members` → 200, paginated list with `user`/`branch` relations loaded
- `PUT /api/v1/admin/staff/{id}` (`status: on_leave`) → 200, updated
- `DELETE /api/v1/admin/members/{id}` → 204, cascade-deletes the linked user
- No token on `/api/v1/admin/branches` → `401 {"message":"Unauthenticated."}`

**Not yet built for these:** Public-facing endpoints (none needed — admin-only for now), Resource/transformer classes (raw model JSON returned instead), soft deletes, branch assignment validation (e.g. preventing deletion of a branch with active members).

## ✅ Implemented — Public registration (approval workflow) — added since last update

- `database/migrations/2026_07_16_124420_create_member_registrations_table.php` — pending sign-up requests, own `password`/profile fields, `status` enum(pending,approved,rejected), `approved_by`/`approved_at`
- `app/Models/MemberRegistration.php` — `belongsTo(Branch)`, `belongsTo(User, 'approved_by')`
- `app/Http/Requests/Api/Public/MemberRegistrationRequest.php` — public sign-up validation (email unique across `users` + pending `member_registrations`)
- `app/Http/Controllers/Api/V1/Public/RegistrationController.php` — `store()`, public, no auth
- `app/Http/Controllers/Api/V1/Admin/MemberRegistrationController.php` — `index`, `show`, `approve` (creates `User(role=member)` + `Member` in a transaction), `reject`
- `routes/api.php` — `POST /api/v1/register` (public), `/api/v1/admin/registrations*` under `auth:sanctum, role:admin,staff`
- Note: `users` table since grew `first_name`/`last_name` (replacing plain `name`, `User::getNameAttribute()` derives it), plus `gender`/`blood_group`/`religion`/`nid_number`/`birth_certificate_number`/`emergency_contact_number`/`date_of_birth`/`joining_date` columns — carried over from registration to the real `User` on approval.

## ✅ Implemented — MembershipPlan + Subscription

- `database/migrations/2026_07_19_000001_create_membership_plans_table.php` — name, description, price, `duration_in_days`, `features` json, status enum(active,inactive)
- `database/migrations/2026_07_19_000002_create_subscriptions_table.php` — `member_id` (FK→members, cascadeOnDelete), `membership_plan_id` (FK→membership_plans, cascadeOnDelete), price_paid, start_date, end_date, status enum(pending,active,expired,cancelled), notes
- `app/Models/MembershipPlan.php` — `hasMany(Subscription)`
- `app/Models/Subscription.php` — `belongsTo(Member)`, `belongsTo(MembershipPlan)`
- `app/Models/Member.php` — added `subscriptions()` hasMany
- `app/Http/Requests/Api/Admin/{PlanRequest,SubscriptionRequest}.php` — separate create/update rules
- `app/Http/Controllers/Api/V1/Admin/PlanController.php` — full CRUD
- `app/Http/Controllers/Api/V1/Admin/SubscriptionController.php` — index (filter by `member_id`/`status`), store (auto-computes `end_date` from plan's `duration_in_days`, defaults `price_paid` to plan price, defaults `status` to `active` since no payment gateway exists yet), show, update, destroy
- `app/Http/Controllers/Api/V1/Public/PricingController.php` — `index()`, public, lists `status=active` plans only
- `routes/api.php` — `GET /api/v1/plans` (public), `Route::apiResource('plans'|'subscriptions', ...)` inside the existing `auth:sanctum, role:admin` admin group

Design note: no Payment/Invoice model exists yet, so `SubscriptionController@store` lets admin manually record `price_paid` and immediately mark the subscription `active` — this is the pre-payment-gateway manual path. Once the Payment module is built, subscription creation should move behind a payment-confirmed flow instead of being open to direct admin activation.

Verified over HTTP (curl, port 8123, MySQL `gms` db, `php artisan migrate:fresh --seed`) — all passing:
- `POST /api/v1/admin/plans` → 201
- `GET /api/v1/plans` (no auth) → 200, only active plans
- `POST /api/v1/admin/subscriptions` (`member_id`, `membership_plan_id`) → 201, `end_date` = `start_date` + plan duration, `status: active`
- `GET /api/v1/admin/subscriptions` → 200, paginated, `member.user` + `membership_plan` eager-loaded
- `PUT /api/v1/admin/subscriptions/{id}` (`status: cancelled`) → 200, updated

**Not yet built for these:** Payment/Invoice models (SSLCommerz integration), automatic subscription expiry (no scheduled job yet — `status` stays whatever it was set to), Resource/transformer classes.

## ✅ Implemented — Trainer system (profile, schedule, specializations, training sessions)

- `database/migrations/2026_07_19_000003_create_trainers_table.php` — `user_id` (FK→users, unique, cascadeOnDelete), `branch_id` (FK→branches, nullable, nullOnDelete), employee_id (unique), specialization, certifications json, experience_years, hourly_rate, session_rate, bio, rating_avg, total_sessions, status enum(active,on_leave,inactive), join_date
- `database/migrations/2026_07_19_000004_create_trainer_specializations_table.php` — `trainer_id` FK cascadeOnDelete, specialization_name, certification_level enum(beginner,intermediate,advanced,expert), certification_date, expiry_date, issuing_authority
- `database/migrations/2026_07_19_000005_create_trainer_schedules_table.php` — `trainer_id` FK cascadeOnDelete, day_of_week (1-7), start_time, end_time, is_available, max_sessions, notes
- `database/migrations/2026_07_19_000006_create_training_sessions_table.php` — `trainer_id`/`member_id` FK cascadeOnDelete, `branch_id` FK nullOnDelete, session_date, start_time, end_time, session_type enum(personal,group,online), status enum(pending,confirmed,completed,cancelled,no_show), fee, payment_status enum(paid,pending,refunded), notes, member_rating, trainer_notes
- `app/Models/{Trainer,TrainerSpecialization,TrainerSchedule,TrainingSession}.php` — Trainer `belongsTo(User,Branch)` + `hasMany(specializations,schedules,trainingSessions)`; others `belongsTo` back
- `app/Models/User.php` — added `trainer()` hasOne; `app/Models/Member.php` — added `trainingSessions()` hasMany
- `app/Http/Requests/Api/Admin/{TrainerRequest,TrainerScheduleRequest,TrainerSpecializationRequest,TrainingSessionRequest}.php`, `app/Http/Requests/Api/User/TrainingSessionRequest.php`
- `app/Http/Controllers/Api/V1/Admin/TrainerController.php` — full CRUD (User+Trainer created together in a transaction, `role=trainer`, same pattern as Member/Staff) + `schedule()`/`updateSchedule()` (full replace: deletes all existing schedule rows, recreates from the posted array) + `specializations()`/`addSpecialization()`/`removeSpecialization()`
- `app/Http/Controllers/Api/V1/Admin/TrainingSessionController.php` — `index` (filter by status/trainer_id/member_id), `show`, `update` (status/fee/payment_status/reschedule/trainer_notes; increments `trainer.total_sessions` on the pending/confirmed → `completed` transition)
- `app/Http/Controllers/Api/V1/Public/TrainerController.php` — `index`/`show`, public, `status=active` only, no auth
- `app/Http/Controllers/Api/V1/User/TrainerController.php` — `index`/`show` for logged-in staff/trainer/member (browse, richer `show` including schedules)
- `app/Http/Controllers/Api/V1/User/TrainingSessionController.php` — member-only (`role:member`): `index` (own sessions), `store` (book — `fee` snapshots `trainer.session_rate` at booking time), `show`, `cancel` (only from pending/confirmed), `rate` (only on `completed`, recomputes `trainer.rating_avg` as the avg of all rated sessions); all four action methods check `member_id` ownership and 403 otherwise
- `routes/api.php` — `GET /api/v1/trainers[/{id}]` (public); `admin/trainers*` + `admin/training-sessions*` under `role:admin`; `user/trainers*` under the existing `role:staff,trainer,member` group; `user/training-sessions*` under a new `role:member`-only group

Design note: no double-booking / schedule-conflict validation yet — `store()` trusts the submitted `session_date`/`start_time`/`end_time` without checking against the trainer's `trainer_schedules` or existing sessions. `updateSchedule()` is a destructive full-replace by design (delete-all-then-recreate) since the whole week's schedule is meant to be submitted together each time, not patched entry-by-entry.

Verified over HTTP (curl, port 8123, MySQL `gms` db, `php artisan migrate:fresh --seed`) — all passing:
- `POST /api/v1/admin/trainers` → 201, creates `User(role=trainer)` + `Trainer`
- `PUT /api/v1/admin/trainers/{id}/schedule` → 200, replaces schedule rows
- `POST /api/v1/admin/trainers/{id}/specializations` → 201
- `GET /api/v1/trainers` (public, no auth) → 200, active trainers with branch+specializations
- `GET /api/v1/user/trainers` (member token) → 200
- `POST /api/v1/user/training-sessions` (member token, `trainer_id`) → 201, `fee` snapshotted from trainer's `session_rate`, `status: pending`
- `PUT /api/v1/admin/training-sessions/{id}` (`status: completed`) → 200, trainer's `total_sessions` incremented 0→1
- `POST /api/v1/user/training-sessions/{id}/rating` (`member_rating: 5`) on the completed session → 200, trainer's `rating_avg` recomputed to `5.00`
- `POST .../cancel` on a pending session → 200, `status: cancelled`; calling `cancel` again → `422` (already processed)
- Member A calling `GET /api/v1/user/training-sessions/{id}` on Member B's session → `403`

**Not yet built for these:** Resource/transformer classes, trainer performance report endpoint (`/reports/trainer-performance`), schedule-conflict / double-booking checks, Review model (rating currently lives directly on `training_sessions.member_rating`, not a separate reviews table).

## ✅ Implemented — Manual Payment (bKash/Nagad, no gateway) tied to registration

No SSLCommerz/payment-gateway account exists, so payment is manual: admin publishes a bKash/Nagad number, the prospect sends money to it themselves and submits the transaction ID (+ optional screenshot) as proof; staff/admin verifies against their own bKash/Nagad statement and approves or rejects.

- `database/migrations/2026_07_19_000007_add_member_id_to_member_registrations_table.php` — adds nullable `member_id` FK (nullOnDelete) to `member_registrations`, set once a registration is turned into a real `Member`
- `database/migrations/2026_07_19_000008_create_payment_numbers_table.php` — `payment_numbers`: method enum(bkash,nagad), number, label, is_active — the admin-managed contact numbers shown to prospects on the frontend
- `database/migrations/2026_07_19_000009_create_payments_table.php` — `payments`: `member_registration_id` (FK cascadeOnDelete), `membership_plan_id` (FK), method enum(bkash,nagad), sender_number, transaction_id (unique — blocks resubmitting/reusing the same trx id), amount, screenshot_path (nullable), status enum(pending,approved,rejected), rejection_reason, approved_by/approved_at
- `app/Models/PaymentNumber.php` — plain model
- `app/Models/Payment.php` — `belongsTo(MemberRegistration, MembershipPlan)`, `belongsTo(User, 'approved_by')`, appends `screenshot_url` (built from the `public` disk)
- `app/Models/MemberRegistration.php` — added `member()` belongsTo, `payments()` hasMany, and a new **`approveIntoMember(int $approvedByUserId): Member`** method — this is the User+Member-creation logic that used to live inline in `MemberRegistrationController@approve`; it's now on the model so both the plain registration-approval path and the payment-approval path share one implementation instead of duplicating it
- `app/Http/Controllers/Api/V1/Admin/MemberRegistrationController.php` — `approve()` simplified to just call `$registration->approveIntoMember(...)`
- `app/Http/Requests/Api/Public/PaymentRequest.php`, `app/Http/Requests/Api/Admin/PaymentNumberRequest.php`
- `app/Http/Controllers/Api/V1/Public/PaymentNumberController.php` — `index()`, public, active numbers only
- `app/Http/Controllers/Api/V1/Public/PaymentController.php` — `store()`, public, `POST /registrations/{memberRegistration}/payments` — creates a `pending` Payment for that registration; rejects (422) if the registration isn't still `pending`; stores the optional `screenshot` file to `storage/app/public/payment-proofs`
- `app/Http/Controllers/Api/V1/Admin/PaymentNumberController.php` — full CRUD (config-style resource, like Plans)
- `app/Http/Controllers/Api/V1/Admin/PaymentController.php` — `index` (filter by status), `show`, `approve` (if the linked registration is still pending, calls `approveIntoMember()`; otherwise reuses the already-linked `member`; then creates an `active` Subscription for that member+plan with `price_paid` = the payment amount and `end_date` computed from the plan's duration; marks the payment `approved`), `reject` (marks `rejected` + reason, registration stays `pending` so the prospect can resubmit a corrected payment)
- `routes/api.php` — `GET /api/v1/payment-numbers` (public), `POST /api/v1/registrations/{memberRegistration}/payments` (public); `admin/payment-numbers` apiResource under `role:admin`; `admin/payments{,/show,/approve,/reject}` under the existing `role:admin,staff` group (same group as registrations)
- `php artisan storage:link` run so `storage/app/public` is served at `/storage` (needed for `screenshot_url`)

Design note: this iteration only covers the **new-registration** payment path (a prospect paying to join for the first time). Renewal payments (an existing, already-approved member paying for their next billing cycle) aren't built yet — `payments.member_registration_id` is required (not nullable), so there's no way yet for an existing `Member` to submit a payment directly. Extending this to renewals is a cheap follow-up: add a nullable `member_id` column to `payments`, require exactly one of `member_registration_id`/`member_id`, and let `PaymentController@approve` extend/renew the existing subscription instead of creating the first one.

Verified over HTTP (curl, port 8123, MySQL `gms` db, `php artisan migrate:fresh --seed`, real file upload) — all passing:
- `POST /api/v1/admin/payment-numbers` → 201; `GET /api/v1/payment-numbers` (no auth) → 200, active numbers only
- `POST /api/v1/register` → 201 pending registration
- `POST /api/v1/registrations/{id}/payments` (multipart, with a real PNG file for `screenshot`) → 201, `screenshot_path` stored, `screenshot_url` resolves to `/storage/payment-proofs/...`
- `GET /api/v1/admin/payments` (admin token) → 200, pending payment with `member_registration` + `membership_plan` eager-loaded
- `POST /api/v1/admin/payments/{id}/approve` → 200, returns the new `active` Subscription; registration flips to `approved` with `member_id` set; `User(role=member)` + `Member` created
- New member can immediately `POST /api/v1/user/login` with the password they registered with → 200, gets a Sanctum token
- `POST .../approve` again on the same payment → `422` (already processed)
- `POST /api/v1/admin/payments/{id2}/reject` with a reason → 200, `status: rejected`; registration stays `pending` (resubmission still allowed)
- Submitting a payment with a `transaction_id` that already exists → `422` validation error (duplicate blocked at the DB/request-validation level)

**Not yet built for these:** renewal-payment path for existing members (see design note above), Invoice/receipt generation (no PDF — a manual bKash/Nagad payment doesn't need one), admin dashboard summary/stats endpoints, Resource/transformer classes, rate-limiting on the public payment-submission endpoint (currently open to anyone who knows a registration id).

## ✅ Implemented — Attendance (member check-in/check-out)

- `database/migrations/2026_07_20_000001_create_attendances_table.php` — `member_id` (FK→members, cascadeOnDelete), `branch_id` (FK→branches, nullable, nullOnDelete), `date`, `check_in`, `check_out` (nullable)
- `app/Models/Attendance.php` — `belongsTo(Member)`, `belongsTo(Branch)`
- `app/Models/Member.php` — added `attendances()` hasMany
- `app/Http/Requests/Api/Admin/AttendanceRequest.php` — `member_id` required (exists:members), `branch_id` nullable (exists:branches) — used only for `checkIn`
- `app/Http/Controllers/Api/V1/Admin/AttendanceController.php` — `index` (filter by `member_id`/`branch_id`/`date`), `show`, `checkIn` (422 if member already has an open record — `check_out` null), `checkOut` (422 if already checked out)
- `app/Http/Controllers/Api/V1/User/AttendanceController.php` — `index` (own paginated history), `calendar` (own records filtered by `?year=&month=`, defaults to current month)
- `routes/api.php` — `admin/attendance*` under the existing `role:admin,staff` group (registrations/payments group — staff manage attendance too); `user/attendance*` (`index`, `/calendar`) under the existing `role:member` group

Design note: no `staff_id` on this table — attendance here is member gym check-in/out only, matching the README ERD (`Members → Attendance`). Staff attendance/leave is a separate concern (`LeaveRequest`, not yet built).

Verified over HTTP (curl, port 8123, MySQL `gms` db) — all passing:
- `POST /api/v1/admin/attendance/check-in` (`member_id`) → 201, `date`/`check_in` set to now
- `POST /api/v1/admin/attendance/check-in` again on the same member (still open) → `422` "already checked in"
- `GET /api/v1/admin/attendance` (admin token) → 200, paginated, `member.user`+`branch` eager-loaded
- `POST /api/v1/admin/attendance/{id}/check-out` → 200, `check_out` set
- `POST .../check-out` again → `422` "already checked out"
- `GET /api/v1/user/attendance` (member token) → 200, own record only
- `GET /api/v1/user/attendance/calendar?year=2026&month=7` (member token) → 200, own records for that month
- No token on `/api/v1/admin/attendance` → `401 {"message":"Unauthenticated."}`

**Not yet built for this:** Resource/transformer classes, branch-level attendance reports (`/reports/attendance`), auto checkout (e.g. end-of-day cron for members who forgot to check out).

## ✅ Implemented — LeadInquiry (public inquiry form)

- `database/migrations/2026_07_20_000002_create_lead_inquiries_table.php` — name, email, phone, `membership_plan_id` (FK→membership_plans, nullable, nullOnDelete), message, status enum(new,contacted,converted,closed) default new, notes
- `app/Models/LeadInquiry.php` — `belongsTo(MembershipPlan)`
- `app/Http/Requests/Api/Public/LeadInquiryRequest.php`, `app/Http/Requests/Api/Admin/LeadInquiryRequest.php` (status/notes only, both `sometimes`)
- `app/Http/Controllers/Api/V1/Public/LeadInquiryController.php` — `store()`, public, no auth
- `app/Http/Controllers/Api/V1/Admin/LeadInquiryController.php` — `index` (filter by `status`), `show`, `update` (status/notes) — under `role:admin,staff` (staff process inquiries per README RBAC table)
- `routes/api.php` — `POST /api/v1/inquiries` (public); `admin/inquiries{,/{id}}` under the existing `role:admin,staff` group

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/inquiries` (no auth) → 201
- `GET /api/v1/admin/inquiries` (admin token) → 200, paginated
- `PUT /api/v1/admin/inquiries/{id}` (`status: contacted`, `notes`) → 200, updated

**Not yet built for this:** Resource/transformer classes, assigning an inquiry to a specific staff member, auto-conversion into a `MemberRegistration` when marked `converted`.

## ✅ Implemented — Coupon/Discount (applied at manual-payment submission)

- `database/migrations/2026_07_20_000003_create_coupons_table.php` — code (unique), type enum(percentage,fixed), discount, min_order (nullable), max_uses (nullable = unlimited), used_count (default 0), expires_at (nullable), status enum(active,inactive)
- `database/migrations/2026_07_20_000004_create_discounts_table.php` — usage audit: `coupon_id` (FK cascadeOnDelete), `member_registration_id` (FK cascadeOnDelete — same registration-first pattern as `payments`), `payment_id` (FK nullable, nullOnDelete), amount (the discount actually applied), used_at
- `database/migrations/2026_07_20_000005_add_coupon_fields_to_payments_table.php` — adds nullable `coupon_id` (FK, nullOnDelete) + nullable `discount_amount` to the existing `payments` table
- `app/Models/Coupon.php` — `hasMany(Discount)`; `Coupon::findValidForAmount(code, amount)` static (throws `ValidationException` if missing/inactive/expired/max-uses-reached/below-min_order) + `calculateDiscount(amount)` instance method (percentage or fixed, capped at the amount itself)
- `app/Models/Discount.php` — `belongsTo(Coupon, MemberRegistration, Payment)`
- `app/Models/Payment.php` — added `coupon_id`/`discount_amount` to fillable+casts, added `coupon()` belongsTo
- `app/Http/Requests/Api/Admin/CouponRequest.php` — `code` unique (ignores self on update via route-bound `{coupon}`), `type`/`discount` required on POST only (same `isMethod('post')` pattern as `PlanRequest`)
- `app/Http/Controllers/Api/V1/Admin/CouponController.php` — full CRUD (config-style resource, like `PlanController`)
- `app/Http/Controllers/Api/V1/Admin/DiscountController.php` — `index` (filter by `coupon_id`), read-only usage log
- `app/Http/Controllers/Api/V1/Public/CouponController.php` — `validateCode()`, `GET /coupons/validate?code=&membership_plan_id=`, public — lets the frontend show the discounted price before submitting payment
- `app/Http/Requests/Api/Public/PaymentRequest.php` — added optional `coupon_code`
- `app/Http/Controllers/Api/V1/Public/PaymentController.php` — `store()` now: if `coupon_code` present, validates it against the plan price, records `coupon_id`+`discount_amount` on the `Payment`, creates a `Discount` row, and increments `coupon.used_count` — all inside the existing DB transaction; an invalid/expired/exhausted coupon throws `ValidationException` (422) before any row is written
- `routes/api.php` — `GET /api/v1/coupons/validate` (public); `admin/coupons` apiResource + `GET /admin/discounts` under `role:admin`

Design note: `amount` on `payments` stays self-reported (member's manual bKash/Nagad transfer, no gateway) — the coupon doesn't force `amount` to match `final_price`, it just records what discount *should* apply so admin can cross-check during approval. Deleting a `Coupon` cascades to delete its `Discount` audit rows (same cascade convention used elsewhere in this schema), but the `Payment.discount_amount` itself survives since `payments.coupon_id` is `nullOnDelete`.

Verified over HTTP (curl, port 8123, MySQL `gms` db) — all passing:
- `POST /api/v1/admin/coupons` (`WELCOME20`, 20% percentage, `max_uses: 5`) → 201
- `GET /api/v1/coupons/validate?code=WELCOME20&membership_plan_id=1` (no auth) → 200, `discount_amount: 300`, `final_price: 1200` (on a 1500 plan)
- `GET /api/v1/coupons/validate?code=BOGUS...` → 422 "Invalid or inactive coupon code."
- `POST /api/v1/registrations/{id}/payments` with `coupon_code: WELCOME20` → 201, payment has `coupon_id`+`discount_amount: 300.00`
- Coupon `used_count` 0→1 after that submission; `GET /api/v1/admin/discounts` → 200, one row linking coupon+registration+payment
- Submitting a payment with an invalid coupon code → 422, no `Payment`/`Discount` row created (validated before the DB transaction)
- Duplicate coupon `code` on create → 422 "The code has already been taken."
- Deactivating a coupon (`status: inactive`) → `GET /coupons/validate` on it → 422 immediately

**Not yet built for this:** Resource/transformer classes, per-member usage cap (currently only a global `max_uses`, so the same member could reuse a coupon across different registrations), coupon application on the renewal-payment path (doesn't exist yet — see the Manual Payment section's design note).

## ✅ Implemented — Diet (plans/meals/member assignment/progress)

- `database/migrations/2026_07_20_000006_create_diet_plans_table.php` — name, description, `duration_in_days`, type enum(weight_loss,muscle_gain,maintenance,general), calories, status enum(active,inactive)
- `database/migrations/2026_07_20_000007_create_diet_meals_table.php` — `diet_plan_id` FK cascadeOnDelete, meal_type enum(breakfast,lunch,dinner,snack), name, calories, protein/carbs/fats
- `database/migrations/2026_07_20_000008_create_member_diets_table.php` — `member_id`/`diet_plan_id` FK cascadeOnDelete, start_date, end_date, status enum(active,completed,cancelled)
- `database/migrations/2026_07_20_000009_create_diet_progress_table.php` — `member_diet_id` FK cascadeOnDelete, weight, date, notes
- `app/Models/{DietPlan,DietMeal,MemberDiet,DietProgress}.php` — `DietPlan` hasMany(meals, memberDiets); `MemberDiet` belongsTo(Member, DietPlan) + hasMany(progress); `DietProgress` belongsTo(MemberDiet)
- `app/Models/Member.php` — added `memberDiets()` hasMany
- `app/Http/Requests/Api/Admin/{DietPlanRequest,DietMealRequest,MemberDietRequest}.php`, `app/Http/Requests/Api/User/DietProgressRequest.php`
- `app/Http/Controllers/Api/V1/Admin/DietPlanController.php` — full CRUD + `meals()`/`addMeal()`/`removeMeal()` (nested under a plan)
- `app/Http/Controllers/Api/V1/Admin/MemberDietController.php` — `index` (filter `member_id`/`status`), `assign` (store)
- `app/Http/Controllers/Api/V1/Admin/DietProgressController.php` — `index` (filter `member_diet_id`), read-only
- `app/Http/Controllers/Api/V1/User/DietController.php` — `availablePlans` (active plans), `currentDiet` (own latest active `MemberDiet` + plan + meals, 404 if none), `progress`/`updateProgress` (scoped to own active `MemberDiet`, 422 if none assigned)
- `routes/api.php` — `admin/diet-plans*` (+ nested meals) + `admin/member-diets` + `admin/diet-progress` under `role:admin`; `user/diet-plans`, `user/my-diet`, `user/diet-progress` under the existing `role:member` group

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/admin/diet-plans` → 201; `POST .../diet-plans/{id}/meals` → 201; `GET .../meals` → 200
- `POST /api/v1/admin/member-diets` (`member_id`, `diet_plan_id`, `start_date`) → 201
- `GET /api/v1/user/diet-plans` (member token) → 200, active plans only
- `GET /api/v1/user/my-diet` → 200, own active plan + meals eager-loaded
- `POST /api/v1/user/diet-progress` (`weight`, `date`) → 201, tied to own active `MemberDiet`
- `GET /api/v1/user/diet-progress` → 200, own entries only

**Not yet built for this:** Resource/transformer classes, `DietType`/status enums as real Enum classes (currently raw DB enum strings), preventing a member from having two simultaneously-`active` `MemberDiet` rows.

## ✅ Implemented — Workout (member workouts/exercises)

- `database/migrations/2026_07_20_000010_create_exercises_table.php` — name, category enum(cardio,strength,flexibility,balance), muscle_group, equipment_needed, description, video_url
- `database/migrations/2026_07_20_000011_create_member_workouts_table.php` — `member_id` FK cascadeOnDelete, `trainer_id` FK nullable nullOnDelete, date, duration_minutes, type enum(personal,group,cardio,strength,mixed), intensity enum(low,medium,high), calories_burned, status enum(scheduled,completed,cancelled), notes
- `database/migrations/2026_07_20_000012_create_workout_exercises_table.php` — `member_workout_id`/`exercise_id` FK cascadeOnDelete, sets, reps, weight
- `app/Models/{Exercise,MemberWorkout,WorkoutExercise}.php` — `MemberWorkout` belongsTo(Member, Trainer) + hasMany(exercises → `WorkoutExercise`); `WorkoutExercise` belongsTo(MemberWorkout, Exercise)
- `app/Models/Member.php` — added `memberWorkouts()` hasMany
- `app/Http/Requests/Api/Admin/{ExerciseRequest,MemberWorkoutRequest}.php` — `MemberWorkoutRequest` accepts an optional nested `exercises[]` array (`exercise_id`, `sets`, `reps`, `weight`)
- `app/Http/Controllers/Api/V1/Admin/ExerciseController.php` — full CRUD (exercise library, config-style like `PlanController`)
- `app/Http/Controllers/Api/V1/Admin/MemberWorkoutController.php` — full CRUD; `store`/`update` accept the nested `exercises[]` and write them inside a DB transaction (`update` does delete-all-then-recreate on the pivot rows when `exercises` is present, same pattern as `TrainerController@updateSchedule`)
- `app/Http/Controllers/Api/V1/User/WorkoutController.php` — `index` (own workouts), `show`, `complete` (422 unless `status=scheduled`; optional `calories_burned`), `exercises` (read-only catalog); all owner-scoped like `User\TrainingSessionController`
- `routes/api.php` — `admin/exercises` + `admin/member-workouts` apiResources under `role:admin`; `user/my-workouts*` + `user/exercises` under the existing `role:member` group

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/admin/exercises` → 201
- `POST /api/v1/admin/member-workouts` with nested `exercises: [{exercise_id, sets, reps, weight}]` → 201, pivot row created with `exercise` eager-loaded
- `GET /api/v1/user/my-workouts` (member token) → 200, own workout with exercises
- `GET /api/v1/user/exercises` → 200, full catalog
- `POST /api/v1/user/my-workouts/{id}/complete` (`calories_burned`) → 200, `status: completed`
- `POST .../complete` again → 422 "Only scheduled workouts can be marked complete."

**Not yet built for this:** Resource/transformer classes, trainer-side view of assigned member workouts, calorie-burn auto-estimation (currently admin/member enters it manually).

## ✅ Implemented — HealthInfo (member health record)

- `database/migrations/2026_07_20_000013_create_health_info_table.php` — `member_id` (FK→members, **unique**, cascadeOnDelete — one record per member), height, weight, bmi, blood_type, allergies, conditions, medications, emergency_contact
- `app/Models/HealthInfo.php` — `belongsTo(Member)`; `static::saving()` hook recomputes `bmi` from `height`/`weight` whenever both are present (`weight_kg / (height_cm/100)^2`), so `bmi` is never client-supplied — always derived
- `app/Http/Requests/Api/Admin/HealthInfoRequest.php` (`member_id` required, rest nullable), `app/Http/Requests/Api/User/HealthInfoRequest.php` (same fields, no `member_id` — always the caller's own)
- `app/Http/Controllers/Api/V1/Admin/HealthInfoController.php` — `index` (filter `member_id`), `store` (422 if that member already has a record — one-to-one enforced at the app layer, not just the DB unique constraint), `show`, `update`
- `app/Http/Controllers/Api/V1/User/HealthController.php` — `show` (own record, 404 if none), `update` (`updateOrCreate` on own `member_id` — member can self-report without admin creating it first)
- `routes/api.php` — `admin/health-info*` under `role:admin`; `user/health-info` (GET/PUT) under the existing `role:member` group

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/admin/health-info` (`member_id`, `height: 175`, `weight: 72.5`) → 201, `bmi: 23.67` auto-computed
- Duplicate `POST` for the same `member_id` → 422 "already has a health record"
- `GET /api/v1/user/health-info` (member token) → 200, own record
- `PUT /api/v1/user/health-info` (`allergies`, `weight: 73`) → 200, `bmi` recomputed to `23.84`

**Not yet built for this:** Resource/transformer classes, historical weight/BMI trend (this table is a single current snapshot, not a time series — that's what `diet_progress` is for on the diet side).

## ✅ Implemented — Review (trainer reviews, moderated)

- `database/migrations/2026_07_20_000014_create_reviews_table.php` — `member_id`/`trainer_id` FK cascadeOnDelete, rating (1-5), comment, status enum(pending,approved,rejected) default pending
- `app/Models/Review.php` — `belongsTo(Member, Trainer)`
- `app/Models/Member.php` — added `reviews()` hasMany; `app/Models/Trainer.php` — added `reviews()` hasMany
- `app/Http/Requests/Api/User/ReviewRequest.php` (`trainer_id`, `rating` 1-5, `comment`), `app/Http/Requests/Api/Admin/ReviewRequest.php` (`status` only — moderation)
- `app/Http/Controllers/Api/V1/Admin/ReviewController.php` — `index` (filter `status`/`trainer_id`), `update` (approve/reject), `destroy`
- `app/Http/Controllers/Api/V1/User/ReviewController.php` — `index` (own, `my-reviews`), `store` (always created `pending` — never auto-approved)
- `app/Http/Controllers/Api/V1/User/TrainerController.php` — added `reviews($trainer)`, returns only `status=approved` reviews for that trainer
- `routes/api.php` — `admin/reviews` (index/update/destroy) under `role:admin`; `user/my-reviews` + `POST user/reviews` under `role:member`; `user/trainers/{trainer}/reviews` under the existing `role:staff,trainer,member` group

Design note: this is a separate testimonial/moderation system from the numeric rating already on `training_sessions.member_rating` (which drives `trainer.rating_avg`, see the Trainer system section). A `Review` here does **not** touch `rating_avg` — the two rating pathways are intentionally independent (one is a mandatory post-session score, this one is an optional public-facing written review that needs admin approval before showing up on a trainer's profile).

Verified over HTTP (curl, port 8123) — all passing:
- `POST /api/v1/user/reviews` (`trainer_id`, `rating: 5`, `comment`) → 201, `status: pending`
- `GET /api/v1/user/trainers/{id}/reviews` while still pending → 200, empty (correctly hidden)
- `GET /api/v1/admin/reviews` (admin token) → 200, shows the pending review
- `PUT /api/v1/admin/reviews/{id}` (`status: approved`) → 200
- `GET /api/v1/user/trainers/{id}/reviews` after approval → 200, review now visible

**Not yet built for this:** Resource/transformer classes, restricting review submission to members who've actually had a completed session with that trainer, a public (no-auth) trainer-reviews endpoint (currently requires `role:staff,trainer,member` login, matching README's placement under `/user`).

## ✅ Implemented — Equipment (+ maintenance log)

- `database/migrations/2026_07_20_000015_create_equipment_table.php` — name, type, `branch_id` (FK nullable, nullOnDelete), status enum(operational,maintenance,out_of_service), purchase_date, cost
- `database/migrations/2026_07_20_000016_create_equipment_maintenance_table.php` — `equipment_id` FK cascadeOnDelete, date, cost, technician, notes
- `app/Models/Equipment.php` — `belongsTo(Branch)` + `hasMany(maintenanceRecords)`; `app/Models/EquipmentMaintenance.php` — `belongsTo(Equipment)`
- `app/Http/Requests/Api/Admin/{EquipmentRequest,EquipmentMaintenanceRequest}.php`
- `app/Http/Controllers/Api/V1/Admin/EquipmentController.php` — full CRUD + `maintenance()`/`addMaintenance()` (adding a record also flips the equipment's `status` to `maintenance` — admin sets it back to `operational` manually via a normal `update()` once fixed)
- `routes/api.php` — `admin/equipment*` (+ nested maintenance) under `role:admin`

Verified over HTTP (curl, port 8123): `POST /api/v1/admin/equipment` → 201; `POST .../equipment/{id}/maintenance` → 201, and the equipment's `status` flipped to `maintenance` automatically.

**Not yet built for this:** Resource/transformer classes, a maintenance-due reminder job.

## ✅ Implemented — Locker / MemberLocker (assignment lifecycle)

- `database/migrations/2026_07_20_000017_create_lockers_table.php` — `branch_id` (FK nullable, nullOnDelete), number, size enum(small,medium,large), status enum(available,occupied,maintenance)
- `database/migrations/2026_07_20_000018_create_member_lockers_table.php` — `member_id`/`locker_id` FK cascadeOnDelete, assigned_at, status enum(active,released)
- `database/migrations/2026_07_20_000021_drop_unique_locker_id_from_member_lockers_table.php` — **bug fix found during testing**: `locker_id` was originally created `unique()` (meant to enforce "one current assignment per locker"), but since `release()` keeps the old row instead of deleting it, that unique constraint permanently blocked re-assigning a released locker to anyone (`500` SQL integrity error, confirmed by testing the exact reassign flow). Fixed by dropping the unique constraint (replaced with a plain index) and moving to the original `2026_07_20_000018` migration too (so a fresh `migrate:fresh` never recreates the bug); "only one active assignment per locker" is now enforced purely at the app layer via the `locker.status !== 'available'` check in `assign()`
- `app/Models/Locker.php` — `belongsTo(Branch)` + `hasOne(memberLocker)`; `app/Models/MemberLocker.php` — `belongsTo(Member, Locker)`
- `app/Models/Member.php` — added `memberLocker()` hasOne
- `app/Http/Requests/Api/Admin/{LockerRequest,MemberLockerRequest}.php`
- `app/Http/Controllers/Api/V1/Admin/LockerController.php` — full CRUD
- `app/Http/Controllers/Api/V1/Admin/MemberLockerController.php` — `index` (active assignments only), `assign` (422 if locker not `available`; flips locker to `occupied` in a DB transaction), `release` (422 if already released; flips locker back to `available`)
- `app/Http/Controllers/Api/V1/User/LockerController.php` — `show`, own active locker assignment (404 if none)
- `routes/api.php` — `admin/lockers` apiResource + `admin/member-lockers` (index/assign/release) under `role:admin`; `user/my-locker` under `role:member`

Verified over HTTP (curl, port 8123) — all passing, including the bug found and fixed mid-testing:
- `POST /api/v1/admin/lockers` → 201; `POST /api/v1/admin/member-lockers` → 201, locker flips to `occupied`
- Assigning the same (occupied) locker again → 422
- `GET /api/v1/user/my-locker` (member token) → 200, own assignment
- `POST /api/v1/admin/member-lockers/{id}/release` → 200, locker flips back to `available`
- Re-assigning that same released locker → **initially 500** (unique constraint violation) → fixed → now 201, new `MemberLocker` row created, old one preserved as history

**Not yet built for this:** Resource/transformer classes, a member-facing "request a locker" self-service flow (currently admin-only assignment).

## ✅ Implemented — LeaveRequest (staff leave)

- `database/migrations/2026_07_20_000019_create_leave_requests_table.php` — `staff_id` FK cascadeOnDelete, leave_type enum(sick,casual,annual,other), start_date, end_date, reason, status enum(pending,approved,rejected), `approved_by` FK nullable nullOnDelete
- `app/Models/LeaveRequest.php` — `belongsTo(Staff, User as approvedBy)`
- `app/Models/Staff.php` — added `leaveRequests()` hasMany
- `app/Http/Requests/Api/Admin/LeaveRequestRequest.php` (`status` only), `app/Http/Requests/Api/User/LeaveRequestRequest.php` (`leave_type`, `start_date` ≥ today, `end_date` ≥ `start_date`, `reason`)
- `app/Http/Controllers/Api/V1/Admin/LeaveRequestController.php` — `index` (filter `status`/`staff_id`), `show`, `update` (sets `status` + `approved_by` = the acting admin)
- `app/Http/Controllers/Api/V1/User/LeaveRequestController.php` — `index` (own), `store` (own, always `pending`) — staff self-service; not in README's explicit endpoint list but required for the admin approval flow to have a source, added under the existing `role:staff,trainer,member` login group since staff authenticate via `/user/login` in this codebase
- `routes/api.php` — `admin/leave-requests*` under `role:admin`; `user/leave-requests` (index/store) under the existing `role:staff,trainer,member` group

Verified over HTTP (curl, port 8123): staff `POST /api/v1/user/leave-requests` → 201 `pending`; staff `GET /api/v1/user/leave-requests` → 200, own only; admin `GET /api/v1/admin/leave-requests` → 200; admin `PUT .../leave-requests/{id}` (`status: approved`) → 200, `approved_by` set to the admin's user id.

**Not yet built for this:** Resource/transformer classes, restricting a staff member to only `index`/`store` their own requests being enforced anywhere but the controller (no Policy class).

## ✅ Implemented — Expense (branch expense tracking)

- `database/migrations/2026_07_20_000020_create_expenses_table.php` — `branch_id` (FK nullable, nullOnDelete), category enum(rent,utilities,salary,equipment,maintenance,marketing,other), amount, date, description, `approved_by` FK nullable nullOnDelete
- `app/Models/Expense.php` — `belongsTo(Branch, User as approvedBy)`
- `app/Http/Requests/Api/Admin/ExpenseRequest.php`
- `app/Http/Controllers/Api/V1/Admin/ExpenseController.php` — full CRUD (filter `branch_id`/`category` on `index`); `store` stamps `approved_by` with the acting admin's user id (expenses are admin-entered, so "approved" = "recorded by")
- `routes/api.php` — `admin/expenses` apiResource under `role:admin`

Verified over HTTP (curl, port 8123): `POST /api/v1/admin/expenses` → 201; `GET ?category=utilities` → 200, filtered; `PUT` → 200; `DELETE` → 204.

**Not yet built for this:** Resource/transformer classes, revenue/expense summary reports (`/reports/revenue` — ties both `Payment` and `Expense` together, not built for either module yet).

## ✅ Implemented — User self-service (Profile, Subscription, Payment history, Trainer self-service)

Discovered while building the frontend user portal: the `/user/*` API surface had role-gated feature endpoints (attendance, diet, workouts, etc.) but **no way for a logged-in staff/trainer/member to see their own profile, and no way for a trainer to manage their own schedule/sessions/specializations** — those existed only on the admin side. Added the missing self-service layer:

- `app/Http/Requests/Api/User/ProfileRequest.php` — first_name/last_name (sometimes), phone, password (nullable min:8), gender/blood_group/religion/nid_number/birth_certificate_number/emergency_contact_number/date_of_birth, `address` (member-only)
- `app/Http/Controllers/Api/V1/User/ProfileController.php` — `show()`/`update()` for the logged-in user, works for all three roles; loads `member.branch` / `staff.branch` / `trainer.branch+specializations+schedules` depending on `role`; `update()` also patches `member.address` when the caller is a member
- `app/Http/Controllers/Api/V1/User/SubscriptionController.php` — `current()` (latest subscription, 404 if none), `history()` (paginated) — member-only
- `app/Http/Controllers/Api/V1/User/PaymentController.php` — `index()`/`show()`, own payment history — queried via `Payment::whereHas('memberRegistration', fn($q) => $q->where('member_id', ...))` since `payments` FKs to `member_registrations`, not `members`, directly (same registration-first design noted in the Manual Payment section)
- `app/Http/Controllers/Api/V1/User/TrainerSelfController.php` — trainer-only, mirrors what `Admin\TrainerController` can do to a trainer but scoped to `$request->user()->trainer`: `schedule()`/`updateSchedule()` (reuses `Admin\TrainerScheduleRequest`), `sessions()`/`updateSession()` (confirm/complete/cancel own sessions, increments `total_sessions` on completion same as the admin path), `specializations()`/`addSpecialization()`/`removeSpecialization()` (reuses `Admin\TrainerSpecializationRequest`), `receivedReviews()` (all reviews about this trainer, any status — a trainer sees pending ones too since it's about them)
- `routes/api.php` — `user/profile` (GET/PUT) under the existing `role:staff,trainer,member` group; new `role:trainer`-only group for `my-schedule`, `my-training-sessions{,/{id}}`, `my-specializations{,/{id}}`, `received-reviews`; `user/subscription{,/history}` + `user/payments{,/{id}}` under the existing `role:member` group

Design note: `received-reviews` (not `my-reviews`, which is already taken by the member's own submitted-reviews endpoint) to avoid a route/path collision on the same `/user/*` prefix.

Verified over HTTP (curl, port 8001) — all passing:
- Member: `GET/PUT /api/v1/user/profile` → 200, member's `address` updatable via the same call; `GET /api/v1/user/subscription` → 200, latest subscription; `/subscription/history` → 200; `GET /api/v1/user/payments` → 200, only this member's payments (via the registration link)
- Trainer: `PUT /api/v1/user/my-schedule` → 200, replaces own schedule; `POST /api/v1/user/my-specializations` → 201; a member's booked session shows up in `GET /api/v1/user/my-training-sessions`; `PUT /api/v1/user/my-training-sessions/{id}` (`status: confirmed` then `completed`) → 200, `trainer.total_sessions` incremented 0→1; `GET /api/v1/user/received-reviews` → 200, shows a review submitted about this trainer
- Staff: `GET /api/v1/user/profile` → 200, own `staff` sub-profile
- Cross-role guard: member token hitting `/api/v1/user/my-schedule` (trainer-only route) → `403 {"message":"Forbidden"}`

**Not yet built for this:** Resource/transformer classes, trainer self-editing `bio`/rates (kept admin-only by design — pricing shouldn't be self-service), a policy layer formalizing the ownership checks (currently inline `abort_if` in each controller, same pattern as the rest of this codebase).

## Backend API — planned tree fully implemented

All 16 domains from the original planned structure now have real code (Auth/RBAC, Branches/Members/Staff, Public registration, MembershipPlan/Subscription, Trainer system, Manual Payment, Attendance, LeadInquiry, Coupon/Discount, Diet, Workout, HealthInfo, Review, Equipment, Locker, LeaveRequest, Expense). Still genuinely missing across the board (not domain-specific, cross-cutting): Resource/transformer classes (raw model JSON everywhere instead), the Repositories/Services/Enums-as-classes/Events/Listeners/Jobs/Notifications/Policies/Exceptions/Helpers layers from the README's aspirational structure (this codebase does the equivalent logic directly in controllers/models instead), report endpoints (`/reports/revenue`, `/reports/attendance`, `/reports/trainer-performance`), and scheduled jobs (subscription expiry, maintenance reminders). See each section above for what's specifically left for that domain.

## 🔲 Remaining Work (as of 2026-07-20)

Everything below is a real, known gap — not a guess. Pick items off this list for the next session.

### Backend — cross-cutting (affects every module)
- No Resource/API-transformer classes anywhere — every endpoint returns raw Eloquent model JSON (includes hidden internals like timestamps on every row, no versioned response shape).
- No Policy classes — ownership/authorization checks are inline `abort_if()` calls duplicated per controller instead of centralized.
- No Service/Repository layer, no custom Enum classes, no Events/Listeners, no Jobs, no Notifications — all business logic lives directly in controllers/models. Works, but means e.g. "send an email on approval" has nowhere to hook into.
- No rate limiting on public endpoints (`/register`, `/inquiries`, `/registrations/{id}/payments`) — currently open to anyone who knows/guesses an id.

### Backend — feature gaps
- **Reports**: `/admin/reports/revenue`, `/admin/reports/attendance`, `/admin/reports/trainer-performance` from the README's route list were never built. No revenue/analytics endpoint exists at all.
- **Scheduled jobs**: no cron/queue job for auto-expiring subscriptions past `end_date` (status just sits stale), no equipment-maintenance-due reminder, no diet-progress reminder.
- **Renewal payments**: `payments.member_registration_id` is required (not nullable) — an existing approved member has no way to submit a payment for their *next* billing cycle, only brand-new registrations can pay. Needs a nullable `member_id` column + "exactly one of registration/member" validation + `PaymentController@approve` extending the existing subscription instead of always creating a new one.
- **Coupons**: only a global `max_uses` cap exists — no per-member usage limit, so one member could reuse the same coupon across multiple registrations.
- **Training sessions**: no schedule-conflict / double-booking check — `store()` trusts the submitted date/time against nothing (not the trainer's `trainer_schedules`, not existing sessions).
- **Lockers**: admin-only assignment — no member-facing "request a locker" self-service endpoint.
- **Password reset**: no forgot-password flow anywhere (README's frontend structure has a `/forgot-password` page planned but there's no backend endpoint to support it, admin or user).
- **Trainer rates/bio**: trainer self-service intentionally excludes editing `bio`/`hourly_rate`/`session_rate` (kept admin-only) — fine as a design choice, but worth confirming that's still wanted before a trainer asks "why can't I fix my bio typo."

### Admin dashboard (`app/frontend`)
- Dashboard overview (`/dashboard`) only shows Branches/Members/Staff/Active-Subscriptions stat cards — none of the 11 newer modules (Attendance, Coupons, Diet, Workouts, Reviews, Equipment, Lockers, Leave Requests, Expenses) have a dashboard tile.
- No revenue/attendance/trainer-performance chart or report page (blocked on the missing backend report endpoints above).
- Member/Staff/Trainer detail views don't cross-link to that person's own attendance, diet, workouts, or payments — those all live on separate flat admin list pages instead.
- No pagination controls on any list page — every table fetches a flat `per_page=20/50/100` with no next/prev, so lists beyond that size are invisible in the UI (data still exists, just not reachable by scrolling).

### Website (public marketing site)
- Public `/trainers/[id]` page doesn't show reviews (the backend's public `TrainerController` never got a `reviews()` method — only the authenticated `/user/trainers/{id}/reviews` one exists). A prospect can't see trainer reviews before signing up.
- Contact form doesn't let a visitor pick a membership plan they're interested in, even though `lead_inquiries.membership_plan_id` exists on the backend — the field is just never sent.
- No coupon code entry anywhere pre-registration (it's only usable at the payment step, after a registration already exists) — can't advertise "use CODE at signup" on the pricing page itself.

### User portal (`app/frontend/portal`)
- No forgot-password flow (matches the backend gap above).
- No pagination in any portal list (same flat `per_page=N` limitation as the admin dashboard).
- Staff portal is thin by design — only Leave Requests, because that's the only staff self-service the backend currently exposes (no staff attendance/shift tracking exists at all, admin or self-service).
- Diet: member can't request cancelling/leaving their own assigned diet plan — only admin can change `member_diets.status`.
- No email/SMS notifications anywhere in the product (registration approved, payment approved/rejected, leave request decided, session confirmed) — there's no Notification layer on the backend to hook into yet (see cross-cutting gap above).
