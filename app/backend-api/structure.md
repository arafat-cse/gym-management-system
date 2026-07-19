
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

## Not started (see root `README.md` for full planned tree)

Everything else in the original planned structure — LeadInquiry, Payment/Invoice, Attendance, Diet (plans/meals/member assignment/progress), Workout (member workouts/exercises), Coupon/Discount, HealthInfo, Equipment/maintenance, Locker/MemberLocker, Review, LeaveRequest, Expense, plus the supporting Repositories, Services, Enums, Events, Listeners, Jobs, Notifications, Policies, Exceptions, Helpers layers — has no code or files yet. Recreate/add a file only when actually implementing it, following the paths laid out in the root `README.md` structure diagram.
