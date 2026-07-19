# Postman API Test Guide — Auth (Login/Logout) + Role/Permission + Branch/Member/Staff

## 0. Server start

```bash
cd app/backend-api
php artisan serve
```

Base URL: `http://127.0.0.1:8000`

## 1. Login

### Admin login
```
POST http://127.0.0.1:8000/api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@gms.test",
  "password": "password"
}
```
(default seeded admin — created by `database/seeders/AdminSeeder.php`)

### User login (staff / trainer / member)
```
POST http://127.0.0.1:8000/api/v1/user/login
Content-Type: application/json

{
  "email": "<user email>",
  "password": "<user password>"
}
```

### Response (both)
```json
{
  "user": { "id": 1, "name": "Super Admin", "email": "admin@gms.test", "role": "admin", ... },
  "token": "1|abcdEFGH1234..."
}
```
`token` — eita Sanctum plain-text token, protected route hit korte lagbe.

## 2. Token diye protected route call

Postman e:
- **Authorization** tab → Type: **Bearer Token** → paste `token` value
- OR manually header: `Authorization: Bearer 1|abcdEFGH1234...`

### Logout
```
POST http://127.0.0.1:8000/api/v1/admin/logout      (admin token diye)
POST http://127.0.0.1:8000/api/v1/user/logout       (user token diye)
Authorization: Bearer <token>
```
Response: `{"message": "Logged out"}` — token DB theke revoke hoye jabe, abar use korle 401.

## 3. Role create korar niyom (ekhono kono API endpoint nai — `php artisan tinker` diye)

```bash
php artisan tinker
```
```php
App\Models\Role::create(['name' => 'branch_manager']);
```
Existing roles (seeded): `admin`, `staff`, `trainer`, `member` — `database/seeders/RolesSeeder.php` e.

## 4. Permission create + role ke assign

```php
$permission = App\Models\Permission::create(['name' => 'manage-branch']);

$role = App\Models\Role::where('name', 'branch_manager')->first();
$role->permissions()->attach($permission->id);

// ekbar e shob set (replace) korte chaile:
$role->permissions()->sync([$permission->id]);
```

Existing permissions (seeded): `manage-members`, `manage-staff`, `manage-trainers`, `manage-plans`, `view-payments`, `manage-payments`, `manage-settings`, `view-own-profile`, `manage-own-profile`.

## 5. Notun user create kore role dewa (test login korar jonno)

```php
App\Models\User::create([
    'name' => 'Test Member',
    'email' => 'member@gms.test',
    'password' => bcrypt('password'),
    'role' => 'member', // admin | staff | trainer | member
]);
```

## 6. Code theke permission check korar niyom

```php
$user->hasRole('admin');                 // bool
$user->hasRole('staff', 'trainer');       // multiple role check, jekono ekta match korle true
$user->hasPermission('manage-members');   // role -> permission table check kore
```

## Notes

- Role/permission manage korar jonno kono Admin UI/API endpoint akhono nai — sob `tinker` diye. Future e `Admin/SettingsController` type controller banaile UI theke role/permission CRUD add kora jabe.
- `admin` role diye `/user/login` e login hobe na (blocked), `admin` chara onno role diye `/admin/login` e login hobe na.

## 7. Branches (Admin, `auth:sanctum` + `role:admin` lage — token header e pathate hobe)

### Create branch
```
POST http://127.0.0.1:8000/api/v1/admin/branches
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Dhanmondi Branch",
  "address": "Road 27, Dhanmondi",
  "phone": "01700000000"
}
```
Response: created branch `{ id, name, address, phone, status: "active", ... }`

### List / Get / Update / Delete
```
GET    /api/v1/admin/branches          (paginated list)
GET    /api/v1/admin/branches/{id}
PUT    /api/v1/admin/branches/{id}     body: kono field partial update
DELETE /api/v1/admin/branches/{id}
```

## 8. Members (Admin) — User + Member ekshathe create hoy

Member create korle nicher User o create hoy (`role: member`) ekta DB transaction e — ei jonno `store` e `name`/`email`/`password` o dite hobe, alada User create korte hobe na.

### Create member
```
POST http://127.0.0.1:8123/api/v1/admin/members
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Rahim Uddin",
  "email": "rahim@gms.test",
  "password": "password",
  "phone": "01711111111",
  "address": "Mirpur",
  "branch_id": 1
}
```
Response: `member` object soho eager-loaded `user` + `branch`.

### List / Get / Update / Delete
```
GET    /api/v1/admin/members            (paginated, user+branch loaded)
GET    /api/v1/admin/members/{id}
PUT    /api/v1/admin/members/{id}       body: name/email/password/phone/address/branch_id (jekono kotogula, sob optional)
DELETE /api/v1/admin/members/{id}       -> linked User o delete hoye jabe (cascade)
```

## 9. Staff (Admin) — User + Staff ekshathe create hoy (role: staff)

### Create staff
```
POST http://127.0.0.1:8123/api/v1/admin/staff
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Karim Sheikh",
  "email": "karim@gms.test",
  "password": "password",
  "branch_id": 1,
  "designation": "Receptionist"
}
```

### List / Get / Update / Delete
```
GET    /api/v1/admin/staff              (paginated, user+branch loaded)
GET    /api/v1/admin/staff/{id}
PUT    /api/v1/admin/staff/{id}         body: name/email/password/branch_id/designation/status (active|inactive|on_leave)
DELETE /api/v1/admin/staff/{id}         -> linked User o delete hoye jabe (cascade)
```

## Notes (Branch/Member/Staff)

- Shob route `auth:sanctum` + `role:admin` er niche — admin token chara 401 dibe.
- Member/Staff delete korle underlying User o delete hoy (foreign key `cascadeOnDelete`) — relational integrity thik thake.
- Branch delete korle linked Member/Staff er `branch_id` NULL hoye jabe (`nullOnDelete`), Member/Staff delete hobe na.

## 10. Membership Plans (public list + admin CRUD)

### Public — list active plans (no token lagbe na)
```
GET http://127.0.0.1:8123/api/v1/plans
```

### Admin CRUD
```
POST   /api/v1/admin/plans
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Gold Monthly",
  "description": "Gold tier",
  "price": 1500,
  "duration_in_days": 30,
  "features": ["gym-access", "locker"]
}
```
```
GET    /api/v1/admin/plans          (paginated, sob status shoho)
GET    /api/v1/admin/plans/{id}
PUT    /api/v1/admin/plans/{id}     body: kono field partial update
DELETE /api/v1/admin/plans/{id}
```

## 11. Subscriptions (Admin) — member ke plan assign kora

Payment gateway ekhono nai, tai admin direct `active` status diye subscription create korte pare — `end_date` automatic calculate hoy `start_date + plan.duration_in_days`.

### Create subscription
```
POST http://127.0.0.1:8123/api/v1/admin/subscriptions
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "member_id": 1,
  "membership_plan_id": 1
}
```
Optional fields: `start_date` (default today), `price_paid` (default plan price), `status` (default `active`), `notes`.

### List / Get / Update / Delete
```
GET    /api/v1/admin/subscriptions               (paginated, member.user + membership_plan loaded)
GET    /api/v1/admin/subscriptions?member_id=1    (filter by member)
GET    /api/v1/admin/subscriptions?status=active  (filter by status)
GET    /api/v1/admin/subscriptions/{id}
PUT    /api/v1/admin/subscriptions/{id}           body: status (pending|active|expired|cancelled), start_date, end_date, price_paid, notes
DELETE /api/v1/admin/subscriptions/{id}
```

## 12. Trainers (public browse + admin CRUD + schedule/specializations + booking)

### Public — browse active trainers (no token lagbe na)
```
GET http://127.0.0.1:8123/api/v1/trainers
GET http://127.0.0.1:8123/api/v1/trainers/{id}
```

### Admin — create trainer (User + Trainer ekshathe create hoy, role: trainer)
```
POST http://127.0.0.1:8123/api/v1/admin/trainers
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "first_name": "Kabir",
  "last_name": "Hossain",
  "email": "kabir@gms.test",
  "password": "password",
  "branch_id": 1,
  "specialization": "CrossFit",
  "session_rate": 800
}
```
```
GET    /api/v1/admin/trainers          (paginated)
GET    /api/v1/admin/trainers/{id}     (+ specializations + schedules loaded)
PUT    /api/v1/admin/trainers/{id}
DELETE /api/v1/admin/trainers/{id}     -> linked User o delete hoye jabe (cascade)
```

### Admin — set weekly schedule (full replace — pura array pathate hobe, patch na)
```
PUT /api/v1/admin/trainers/{id}/schedule
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "schedules": [
    {"day_of_week": 1, "start_time": "09:00", "end_time": "17:00"},
    {"day_of_week": 3, "start_time": "09:00", "end_time": "17:00"}
  ]
}
```
`GET /api/v1/admin/trainers/{id}/schedule` — current schedule dekhar jonno.

### Admin — specializations
```
GET    /api/v1/admin/trainers/{id}/specializations
POST   /api/v1/admin/trainers/{id}/specializations   body: {"specialization_name": "Yoga", "certification_level": "advanced"}
DELETE /api/v1/admin/trainers/{id}/specializations/{specializationId}
```

### Admin — training sessions (view + status update, no create — member e create kore)
```
GET /api/v1/admin/training-sessions                    (filter: ?status=, ?trainer_id=, ?member_id=)
GET /api/v1/admin/training-sessions/{id}
PUT /api/v1/admin/training-sessions/{id}                body: status (pending|confirmed|completed|cancelled|no_show), fee, payment_status, trainer_notes
```
`status: completed` e set korle trainer er `total_sessions` counter automatic +1 hoy.

### User (member) — browse trainers + book session
```
GET  /api/v1/user/trainers                              (staff/trainer/member shobai dekhte pare)
GET  /api/v1/user/trainers/{id}                          (+ schedules shoho)
```
```
POST /api/v1/user/training-sessions
Authorization: Bearer <member-token>
Content-Type: application/json

{
  "trainer_id": 1,
  "session_date": "2026-07-20",
  "start_time": "10:00",
  "end_time": "11:00"
}
```
`fee` automatic trainer er `session_rate` theke snapshot hoy, `status: pending` diye shuru hoy.

```
GET  /api/v1/user/training-sessions                      (nijer sob session)
GET  /api/v1/user/training-sessions/{id}
POST /api/v1/user/training-sessions/{id}/cancel           (pending/confirmed obostha theke)
POST /api/v1/user/training-sessions/{id}/rating           body: {"member_rating": 5}  — sudhu completed session e
```
Onno member er session dekhte gele (member_id mismatch) → `403`.

## Notes (Trainer)

- Trainer create/delete Member/Staff er moto — User + Trainer transaction e ekshathe, delete korle cascade.
- Schedule-conflict / double-booking check ekhono nai — jekono time e book kora jay, trainer er actual `trainer_schedules` er against validate hoy na.
- Review model alada nai — rating shorashori `training_sessions.member_rating` e thake, `rate()` call korle trainer er `rating_avg` shob completed+rated session er average hishebe recompute hoy.
