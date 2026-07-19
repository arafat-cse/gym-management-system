# Gym Management System (GMS)

A comprehensive gym management system with public marketing website, admin dashboard, and member portal.

## 📁 Project Structure

```
gms/
│
├── website/                              # Next.js 14+ — Public marketing site
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx              # Home page
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx          # About page
│   │   │   │   └── contact/
│   │   │   │       └── page.tsx          # Contact page
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx              # All plans, dynamic from API
│   │   │   ├── register/
│   │   │   │   ├── page.tsx              # Lead inquiry form
│   │   │   │   └── success/
│   │   │   │       └── page.tsx          # Registration success
│   │   │   ├── layout.tsx                # Root layout
│   │   │   └── globals.css               # Global styles
│   │   ├── components/
│   │   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── pricing/
│   │   │   │   ├── pricing-card.tsx     # Individual plan card
│   │   │   │   └── pricing-section.tsx   # Pricing grid
│   │   │   └── forms/
│   │   │       ├── register-form.tsx     # Lead inquiry form
│   │   │       └── contact-form.tsx      # Contact form
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts             # fetch wrapper -> backend-api
│   │   │   │   └── types.ts              # API response types
│   │   │   └── validations/
│   │   │       ├── register.ts           # zod schema for registration
│   │   │       └── contact.ts            # zod schema for contact
│   │   └── types/
│   │       └── index.ts                  # Shared types
│   ├── public/                            # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── app/
    │
    ├── frontend/                          # Next.js 14+ — Admin + User dashboard
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── (auth)/
    │   │   │   │   ├── login/
    │   │   │   │   │   └── page.tsx      # Login page
    │   │   │   │   └── forgot-password/
    │   │   │   │       └── page.tsx      # Password reset
    │   │   │   ├── admin/
    │   │   │   │   ├── overview/
    │   │   │   │   │   └── page.tsx      # Dashboard overview
    │   │   │   │   ├── members/
    │   │   │   │   │   ├── page.tsx      # Members list
    │   │   │   │   │   ├── [id]/
    │   │   │   │   │   │   └── page.tsx  # Member details
    │   │   │   │   │   └── new/
    │   │   │   │   │       └── page.tsx  # Add member
    │   │   │   │   ├── staff/
    │   │   │   │   │   ├── page.tsx      # Staff management
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx  # Staff details
    │   │   │   │   ├── trainers/
    │   │   │   │   │   ├── page.tsx      # Trainer management
    │   │   │   │   │   ├── [id]/
    │   │   │   │   │   │   └── page.tsx  # Trainer details
    │   │   │   │   │   ├── schedule/
    │   │   │   │   │   │   └── page.tsx  # Trainer schedule
    │   │   │   │   │   ├── sessions/
    │   │   │   │   │   │   ├── page.tsx  # Training sessions
    │   │   │   │   │   │   └── [id]/
    │   │   │   │   │   │       └── page.tsx # Session details
    │   │   │   │   │   └── performance/
    │   │   │   │   │       └── page.tsx  # Trainer performance
    │   │   │   │   ├── plans/
    │   │   │   │   │   ├── page.tsx      # Membership plans
    │   │   │   │   │   ├── [id]/
    │   │   │   │   │   │   └── page.tsx  # Plan details
    │   │   │   │   │   └── new/
    │   │   │   │   │       └── page.tsx  # Create plan
    │   │   │   │   ├── inquiries/
    │   │   │   │   │   ├── page.tsx      # Lead inquiries
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx  # Inquiry details
    │   │   │   │   ├── payments/
    │   │   │   │   │   ├── page.tsx      # Payment history
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx  # Payment details
    │   │   │   │   ├── attendance/
    │   │   │   │   │   ├── page.tsx      # Attendance tracking
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx  # Member attendance
    │   │   │   │   ├── reports/
    │   │   │   │   │   ├── page.tsx      # Reports dashboard
    │   │   │   │   │   ├── revenue.tsx   # Revenue reports
    │   │   │   │   │   └── attendance.tsx # Attendance reports
    │   │   │   │   └── settings/
    │   │   │   │       ├── page.tsx      # General settings
    │   │   │   │       ├── profile.tsx   # Admin profile
    │   │   │   │       └── branch.tsx   # Branch settings
    │   │   │   ├── user/
    │   │   │   │   ├── overview/
    │   │   │   │   │   └── page.tsx      # User dashboard
    │   │   │   │   ├── membership/
    │   │   │   │   │   ├── page.tsx      # Current membership
    │   │   │   │   │   └── history.tsx   # Membership history
    │   │   │   │   ├── payments/
    │   │   │   │   │   ├── page.tsx      # Payment history
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx  # Invoice details
    │   │   │   │   ├── attendance/
    │   │   │   │   │   ├── page.tsx      # Attendance history
    │   │   │   │   │   └── calendar.tsx  # Attendance calendar
    │   │   │   │   ├── trainers/
    │   │   │   │   │   ├── page.tsx      # Available trainers
    │   │   │   │   │   ├── [id]/
    │   │   │   │   │   │   └── page.tsx  # Trainer profile
    │   │   │   │   │   ├── book/
    │   │   │   │   │   │   └── page.tsx  # Book training session
    │   │   │   │   │   └── sessions/
    │   │   │   │   │       └── page.tsx  # My training sessions
    │   │   │   │   └── profile/
    │   │   │   │       └── page.tsx      # User profile
    │   │   │   ├── layout.tsx             # Dashboard layout
    │   │   │   ├── globals.css            # Global styles
    │   │   │   └── error.tsx              # Error boundary
    │   │   ├── components/
    │   │   │   ├── ui/                    # shadcn/ui components
    │   │   │   ├── charts/
    │   │   │   │   ├── revenue-chart.tsx # ApexCharts revenue
    │   │   │   │   ├── attendance-chart.tsx # ApexCharts attendance
    │   │   │   │   └── membership-chart.tsx # ApexCharts membership
    │   │   │   └── layout/
    │   │   │       ├── sidebar.tsx       # Dashboard sidebar
    │   │   │       ├── navbar.tsx        # Top navigation
    │   │   │       └── rbac-guard.tsx    # Role-based access control
    │   │   ├── lib/
    │   │   │   ├── api/
    │   │   │   │   ├── client.ts         # API client
    │   │   │   │   └── endpoints.ts      # API endpoints
    │   │   │   ├── auth/
    │   │   │   │   ├── session.ts       # Session management
    │   │   │   │   └── sanctum.ts       # Sanctum token handling
    │   │   │   └── rbac/
    │   │   │       ├── permissions.ts   # Permission definitions
    │   │   │       └── roles.ts         # Role definitions
    │   │   ├── hooks/
    │   │   │   ├── useAuth.ts           # Authentication hook
    │   │   │   ├── usePermissions.ts    # Permission check hook
    │   │   │   └── useApi.ts           # API hook
    │   │   ├── types/
    │   │   │   ├── auth.ts              # Auth types
    │   │   │   ├── member.ts            # Member types
    │   │   │   ├── payment.ts           # Payment types
    │   │   │   └── index.ts            # Shared types
    │   │   └── middleware.ts            # Route protection
    │   ├── package.json
    │   ├── next.config.js
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    │
    └── backend-api/                       # Laravel 12 REST API
        ├── app/
        │   ├── Http/
        │   │   ├── Controllers/
        │   │   │   ├── Api/
        │   │   │   │   └── V1/
        │   │   │   │       ├── Public/
        │   │   │   │       │   ├── PricingController.php       # Get membership plans
        │   │   │   │       │   ├── LeadInquiryController.php    # Submit lead inquiry
        │   │   │   │       │   └── RegisterController.php      # Public registration
        │   │   │   │       ├── Admin/
        │   │   │   │       │   ├── AuthController.php           # Admin login
        │   │   │   │       │   ├── MemberController.php         # CRUD members
        │   │   │   │       │   ├── StaffController.php          # Manage staff
        │   │   │   │       │   ├── TrainerController.php        # Manage trainers
        │   │   │   │       │   ├── TrainingSessionController.php # Training sessions
        │   │   │   │       │   ├── PlanController.php           # CRUD plans
        │   │   │   │       │   ├── InquiryController.php        # Manage inquiries
        │   │   │   │       │   ├── PaymentController.php        # View all payments
        │   │   │   │       │   ├── AttendanceController.php    # Manage attendance
        │   │   │   │       │   ├── ReportController.php         # Generate reports
        │   │   │   │       │   └── SettingsController.php       # System settings
        │   │   │   │       └── User/
        │   │   │   │           ├── AuthController.php           # User login
        │   │   │   │           ├── ProfileController.php        # User profile
        │   │   │   │           ├── SubscriptionController.php  # Current subscription
        │   │   │   │           ├── PaymentController.php        # Payment history
        │   │   │   │           ├── AttendanceController.php    # User attendance
        │   │   │   │           └── TrainerController.php       # Book trainer sessions
        │   │   │   ├── Controller.php                          # Base controller
        │   │   ├── Requests/
        │   │   │   ├── Api/
        │   │   │   │   ├── Public/
        │   │   │   │   │   ├── LeadInquiryRequest.php
        │   │   │   │   │   └── RegistrationRequest.php
        │   │   │   │   ├── Admin/
        │   │   │   │   │   ├── MemberRequest.php
        │   │   │   │   │   ├── PlanRequest.php
        │   │   │   │   │   └── StaffRequest.php
        │   │   │   │   └── User/
        │   │   │   │       └── ProfileRequest.php
        │   │   │   └── Request.php                                # Base request
        │   │   ├── Resources/
        │   │   │   ├── Api/
        │   │   │   │   ├── V1/
        │   │   │   │   │   ├── MemberResource.php
        │   │   │   │   │   ├── PlanResource.php
        │   │   │   │   │   ├── PaymentResource.php
        │   │   │   │   │   └── AttendanceResource.php
        │   │   │   │   └── JsonResource.php                      # Base resource
        │   │   └── Middleware/
        │   │       ├── Api/
        │   │       │   ├── JsonResponseMiddleware.php
        │   │       │   ├── RoleCheckMiddleware.php              # Role validation
        │   │       │   └── RateLimitMiddleware.php              # Rate limiting
        │   │       └── Authenticate.php                          # Authentication
        │   ├── Models/
        │   │   ├── User.php                                       # Users table
        │   │   ├── Member.php                                     # Members table
        │   │   ├── MembershipPlan.php                             # Membership plans
        │   │   ├── Subscription.php                               # Member subscriptions
        │   │   ├── Payment.php                                    # Payment records
        │   │   ├── Invoice.php                                    # Payment invoices
        │   │   ├── LeadInquiry.php                                 # Lead inquiries
        │   │   ├── Staff.php                                      # Staff members
        │   │   ├── Trainer.php                                    # Trainers
        │   │   ├── TrainingSession.php                            # Training sessions
        │   │   ├── TrainerSchedule.php                           # Trainer availability
        │   │   ├── TrainerSpecialization.php                      # Trainer expertise
        │   │   ├── Attendance.php                                  # Attendance records
        │   │   ├── Branch.php                                     # Gym branches
        │   │   ├── DietPlan.php                                   # Diet plans
        │   │   ├── DietMeal.php                                   # Diet meals
        │   │   ├── MemberDiet.php                                 # Member diet assignments
        │   │   ├── DietProgress.php                               # Diet progress tracking
        │   │   ├── MemberWorkout.php                              # Member workout sessions
        │   │   ├── Exercise.php                                   # Exercise library
        │   │   ├── WorkoutExercise.php                            # Workout-exercise pivot
        │   │   ├── Coupon.php                                      # Discount coupons
        │   │   ├── Discount.php                                   # Applied discounts
        │   │   ├── HealthInfo.php                                 # Member health information
        │   │   ├── Equipment.php                                  # Gym equipment
        │   │   ├── EquipmentMaintenance.php                       # Equipment maintenance
        │   │   ├── Locker.php                                     # Gym lockers
        │   │   ├── MemberLocker.php                               # Locker assignments
        │   │   ├── Review.php                                      # Member reviews
        │   │   ├── LeaveRequest.php                               # Staff leave requests
        │   │   └── Expense.php                                    # Expense tracking
        │   ├── Repositories/
        │   │   ├── Contracts/
        │   │   │   ├── MemberRepositoryInterface.php
        │   │   │   ├── PaymentRepositoryInterface.php
        │   │   │   └── SubscriptionRepositoryInterface.php
        │   │   └── Eloquent/
        │   │       ├── MemberRepository.php
        │   │       ├── PaymentRepository.php
        │   │       └── SubscriptionRepository.php
        │   ├── Services/
        │   │   ├── Public/
        │   │   │   ├── PricingService.php                         # Public pricing
        │   │   │   ├── LeadInquiryService.php                    # Lead management
        │   │   │   └── RegistrationService.php                    # Registration flow
        │   │   ├── Payment/
        │   │   │   ├── SslCommerzService.php                     # SSLCommerz integration
        │   │   │   ├── PaymentGatewayInterface.php                # Payment gateway contract
        │   │   │   ├── CouponService.php                          # Coupon management
        │   │   │   └── InvoiceService.php                         # Invoice generation
        │   │   ├── Admin/
        │   │   │   ├── MemberService.php                          # Member management
        │   │   │   ├── TrainerService.php                         # Trainer management
        │   │   │   ├── TrainingSessionService.php                # Training session management
        │   │   │   ├── PlanService.php                            # Plan management
        │   │   │   ├── ReportService.php                          # Report generation
        │   │   │   ├── DietService.php                            # Diet plan management
        │   │   │   ├── WorkoutService.php                         # Workout management
        │   │   │   ├── HealthService.php                          # Health information service
        │   │   │   ├── EquipmentService.php                       # Equipment management
        │   │   │   ├── LockerService.php                          # Locker management
        │   │   │   └── ExpenseService.php                         # Expense management
        │   │   ├── User/
        │   │   │   ├── SubscriptionService.php                    # User subscriptions
        │   │   │   ├── AttendanceService.php                      # Attendance tracking
        │   │   │   └── ReviewService.php                          # Review management
        │   │   └── Staff/
        │   │       └── LeaveService.php                            # Leave management
        │   ├── Enums/
        │   │   ├── PaymentStatus.php                              # Payment statuses
        │   │   ├── SubscriptionStatus.php                         # Subscription statuses
        │   │   ├── InquiryStatus.php                              # Inquiry statuses
        │   │   ├── TrainingSessionStatus.php                      # Training session statuses
        │   │   ├── TrainerStatus.php                              # Trainer employment status
        │   │   ├── SpecializationType.php                         # Training specializations
        │   │   ├── DietType.php                                   # Diet plan types
        │   │   ├── LeaveStatus.php                                # Leave request statuses
        │   │   ├── ReviewStatus.php                               # Review statuses
        │   │   └── ExpenseCategory.php                            # Expense categories
        │   ├── Events/
        │   │   ├── InquiryApproved.php                            # Lead approval event
        │   │   ├── PaymentReceived.php                            # Payment event
        │   │   ├── SubscriptionExpiring.php                       # Expiry warning
        │   │   ├── DietAssigned.php                               # Diet assignment event
        │   │   ├── WorkoutCompleted.php                          # Workout completion event
        │   │   └── LeaveRequested.php                            # Leave request event
        │   ├── Listeners/
        │   │   ├── SendWelcomeEmail.php                           # Welcome email
        │   │   ├── GenerateInvoice.php                            # Invoice generation
        │   │   ├── SendExpiryReminder.php                          # Expiry reminder
        │   │   ├── SendDietPlanEmail.php                          # Diet plan notification
        │   │   └── ProcessLeaveRequest.php                        # Leave processing
        │   ├── Jobs/
        │   │   ├── CheckExpiredSubscriptions.php                 # Scheduled subscription check
        │   │   ├── ProcessRefund.php                              # Refund processing
        │   │   ├── CheckDietProgress.php                          # Diet progress tracking
        │   │   ├── EquipmentMaintenanceReminder.php               # Maintenance reminders
        │   │   └── ProcessExpenses.php                            # Expense processing
        │   ├── Notifications/
        │   │   ├── WelcomeEmail.php                               # Welcome notification
        │   │   ├── PaymentInvoice.php                             # Payment notification
        │   │   ├── ExpiryReminder.php                             # Expiry reminder
        │   │   ├── DietProgressReminder.php                       # Diet progress reminder
        │   │   └── LeaveStatusNotification.php                   # Leave status notification
        │   ├── Policies/
        │   │   ├── MemberPolicy.php                                # Member policies
        │   │   ├── PaymentPolicy.php                               # Payment policies
        │   │   ├── ReviewPolicy.php                                # Review policies
        │   │   └── LeavePolicy.php                                 # Leave policies
        │   ├── Exceptions/
        │   │   ├── Handler.php                                     # Exception handling
        │   │   └── Api/
        │   │       ├── PaymentException.php                        # Payment errors
        │   │       ├── SubscriptionException.php                   # Subscription errors
        │   │       ├── DietException.php                           # Diet-related errors
        │   │       └── ReviewException.php                         # Review-related errors
        │   └── Helpers/
        │       ├── DateHelper.php                                  # Date utilities
        │       ├── PaymentHelper.php                              # Payment utilities
        │       ├── DietHelper.php                                  # Diet calculation utilities
        │       └── WorkoutHelper.php                              # Workout calculation utilities
        ├── database/
        │   ├── migrations/
        │   │   ├── 2024_01_01_000001_create_users_table.php
        │   │   ├── 2024_01_01_000002_create_branches_table.php
        │   │   ├── 2024_01_01_000003_create_membership_plans_table.php
        │   │   ├── 2024_01_01_000004_create_members_table.php
        │   │   ├── 2024_01_01_000005_create_subscriptions_table.php
        │   │   ├── 2024_01_01_000006_create_payments_table.php
        │   │   ├── 2024_01_01_000007_create_invoices_table.php
        │   │   ├── 2024_01_01_000008_create_lead_inquiries_table.php
        │   │   ├── 2024_01_01_000009_create_staff_table.php
        │   │   ├── 2024_01_01_000010_create_trainers_table.php
        │   │   ├── 2024_01_01_000011_create_trainer_specializations_table.php
        │   │   ├── 2024_01_01_000012_create_trainer_schedules_table.php
        │   │   ├── 2024_01_01_000013_create_training_sessions_table.php
        │   │   ├── 2024_01_01_000014_create_attendance_table.php
        │   │   ├── 2024_01_01_000015_create_roles_and_permissions.php
        │   │   ├── 2024_01_01_000016_create_diet_plans_table.php
        │   │   ├── 2024_01_01_000017_create_diet_meals_table.php
        │   │   ├── 2024_01_01_000018_create_member_diets_table.php
        │   │   ├── 2024_01_01_000019_create_diet_progress_table.php
        │   │   ├── 2024_01_01_000020_create_exercises_table.php
        │   │   ├── 2024_01_01_000021_create_member_workouts_table.php
        │   │   ├── 2024_01_01_000022_create_workout_exercises_table.php
        │   │   ├── 2024_01_01_000023_create_coupons_table.php
        │   │   ├── 2024_01_01_000024_create_discounts_table.php
        │   │   ├── 2024_01_01_000025_create_health_info_table.php
        │   │   ├── 2024_01_01_000026_create_equipment_table.php
        │   │   ├── 2024_01_01_000027_create_equipment_maintenance_table.php
        │   │   ├── 2024_01_01_000028_create_lockers_table.php
        │   │   ├── 2024_01_01_000029_create_member_lockers_table.php
        │   │   ├── 2024_01_01_000030_create_reviews_table.php
        │   │   ├── 2024_01_01_000031_create_leave_requests_table.php
        │   │   └── 2024_01_01_000032_create_expenses_table.php
        │   ├── seeders/
        │   │   ├── RolesSeeder.php                                # Admin, Staff, Member roles
        │   │   ├── PlansSeeder.php                                # Default membership plans
        │   │   ├── AdminSeeder.php                                # Default admin user
        │   │   ├── BranchSeeder.php                               # Default branches
        │   │   ├── DietPlansSeeder.php                            # Default diet plans
        │   │   ├── ExercisesSeeder.php                            # Default exercises
        │   │   └── EquipmentSeeder.php                            # Default equipment
        │   └── factories/
        │       ├── MemberFactory.php
        │       ├── PaymentFactory.php
        │       ├── AttendanceFactory.php
        │       ├── WorkoutFactory.php
        │       └── DietProgressFactory.php
        ├── routes/
        │   ├── api.php                                              # API routes (v1/public, v1/admin, v1/user)
        │   └── web.php                                              # Web routes (if needed)
        ├── config/
        │   ├── app.php
        │   ├── auth.php                                            # Sanctum configuration
        │   ├── database.php
        │   ├── payment.php                                         # Payment gateway config
        │   ├── sanctum.php
        │   └── cors.php
        ├── public/
        │   └── index.php
        ├── .env.example
        ├── .env
        ├── artisan
        ├── composer.json
        └── phpunit.xml

├── README.md                            # This file
├── .gitignore
└── docker-compose.yml                   # Docker setup (optional)
```

## 🗄️ Database Relations

### Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Users    │────▶│   Members    │────▶│ Subscriptions│
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - name      │     │ - user_id    │     │ - member_id │
│ - email     │     │ - phone      │     │ - plan_id   │
│ - role      │     │ - address    │     │ - status    │
│ - password  │     │ - branch_id  │     │ - start_date│
└─────────────┘     └──────────────┘     │ - end_date  │
                     ▲                    └─────────────┘
                     │                           │
                     │                           ▼
              ┌──────────────┐          ┌──────────────┐
              │   Branches   │          │MembershipPlan│
              │              │          │              │
              │ - id         │          │ - id         │
              │ - name       │          │ - name       │
              │ - address    │          │ - price      │
              │ - phone      │          │ - duration  │
              └──────────────┘          │ - features  │
                                         └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Payments   │────▶│   Invoices   │────▶│  Attendance │
│             │     │              │     │             │
│ - id        │     │ - id        │     │ - id        │
│ - member_id │     │ - payment_id │     │ - member_id │
│ - amount    │     │ - invoice_no │     │ - date      │
│ - status    │     │ - member_id │     │ - check_in   │
│ - method    │     │ - amount     │     │ - check_out │
│ - txn_id    │     │ - due_date  │     │ - branch_id │
└─────────────┘     └──────────────┘     └─────────────┘
      ▲
      │
┌─────────────┐
│LeadInquiries│
│             │
│ - id        │
│ - name      │
│ - email     │
│ - phone     │
│ - plan_id   │
│ - status    │
│ - notes     │
└─────────────┘

┌─────────────┐
│   Staff     │
│             │
│ - id        │
│ - user_id   │
│ - branch_id │
│ - role      │
│ - status    │
└─────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Trainers   │────▶│TrainingSessions│────▶│  Members    │
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - user_id   │     │ - trainer_id │     │ - user_id   │
│ - branch_id │     │ - member_id  │     │ - name      │
│ - specialty │     │ - date       │     │ - phone     │
│ - cert      │     │ - time       │     │ - branch_id │
│ - rate      │     │ - status     │     │ - address   │
│ - rating    │     │ - fee        │     └─────────────┘
└─────────────┘     └──────────────┘         │
                     ▲                        │
                     │                        ▼
              ┌──────────────┐        ┌──────────────┐
              │TrainerSchedule│        │TrainerSpec   │
              │              │        │              │
              │ - id         │        │ - id         │
              │ - trainer_id │        │ - trainer_id │
              │ - day        │        │ - spec_id    │
              │ - start_time │        │ - name       │
              │ - end_time   │        │ - level      │
              │ - status     │        └──────────────┘
              └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  DietPlans  │────▶│  DietMeals   │────▶│ MemberDiet  │
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - name      │     │ - diet_plan_id│     │ - member_id │
│ - duration  │     │ - meal_type  │     │ - diet_plan_id│
│ - type      │     │ - name       │     │ - start_date│
│ - calories  │     │ - calories  │     │ - end_date  │
│ - status    │     │ - protein   │     │ - status    │
└─────────────┘     │ - carbs     │     └─────────────┘
                     │ - fats      │           │
                     └──────────────┘           │
                                                 ▼
                                          ┌─────────────┐
                                          │DietProgress │
                                          │             │
                                          │ - id        │
                                          │ - member_diet_id│
                                          │ - weight    │
                                          │ - date      │
                                          │ - notes     │
                                          └─────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│MemberWorkout│────▶│ Trainers     │────▶│  Equipment  │
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - member_id │     │ - user_id    │     │ - name      │
│ - trainer_id│     │ - branch_id  │     │ - type      │
│ - date      │     │ - specialty │     │ - status    │
│ - duration  │     │ - cert      │     │ - purchase_date│
│ - type      │     │ - rate      │     │ - maintenance│
│ - intensity │     └──────────────┘     │ - cost      │
│ - calories  │                            └─────────────┘
└─────────────┘                                    ▲
                     ▲                              │
                     │                              │
                ┌──────────────┐              ┌──────────────┐
                │WorkoutExercises│              │  Equipment   │
                │              │              │ Maintenance  │
                │ - id         │              │              │
                │ - workout_id │              │ - id         │
                │ - exercise_id│              │ - equipment_id│
                │ - sets       │              │ - date       │
                │ - reps       │              │ - cost       │
                │ - weight     │              │ - technician │
                └──────────────┘              └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Coupons   │────▶│  Payments    │────▶│  Expenses   │
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - code      │     │ - member_id  │     │ - category  │
│ - type      │     │ - amount     │     │ - amount    │
│ - discount  │     │ - coupon_id  │     │ - date      │
│ - min_order │     │ - status     │     │ - description│
│ - max_uses  │     │ - method     │     │ - approved_by│
│ - expires_at│     │ - txn_id     │     │ - branch_id │
│ - status    │     └──────────────┘     └─────────────┘
└─────────────┘             ▲
                     │
                     ▼
                ┌──────────────┐
                │  Discount    │
                │              │
                │ - id         │
                │ - coupon_id │
                │ - member_id │
                │ - used_at    │
                └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│HealthInfo   │────▶│   Members    │────▶│   Reviews   │
│             │     │              │     │             │
│ - id        │     │ - id         │     │ - id        │
│ - member_id │     │ - user_id    │     │ - member_id │
│ - height    │     │ - phone      │     │ - trainer_id│
│ - weight    │     │ - branch_id  │     │ - rating    │
│ - bmi       │     │ - address    │     │ - comment   │
│ - blood_type│     └──────────────┘     │ - date      │
│ - allergies │             ▲            │ - status    │
│ - conditions│             │            └─────────────┘
│ - medications│             │                   │
│ - emergency_contact│       │                   ▼
└─────────────┘             │          ┌──────────────┐
                            │          │LeaveRequests │
                            │          │              │
                            │          │ - id         │
                     ┌──────────────┐│ - staff_id   │
                     │   Lockers    ││ - leave_type │
                     │              ││ - start_date │
                     │ - id         ││ - end_date   │
                     │ - number     ││ - reason     │
                     │ - branch_id  ││ - status     │
                     │ - size       ││ - approved_by│
                     │ - status     │└──────────────┘
                     └──────────────┘
                            ▲
                            │
                     ┌──────────────┐
                     │MemberLocker  │
                     │              │
                     │ - id         │
                     │ - member_id  │
                     │ - locker_id  │
                     │ - assigned_at│
                     │ - status     │
                     └──────────────┘
```

### Key Relationships

1. **Users → Members**: One-to-One (A user can be a member)
2. **Members → Subscriptions**: One-to-Many (A member can have multiple subscriptions)
3. **Subscriptions → Membership Plans**: Many-to-One (Many subscriptions can belong to one plan)
4. **Members → Payments**: One-to-Many (A member can make multiple payments)
5. **Payments → Invoices**: One-to-One (Each payment has one invoice)
6. **Members → Attendance**: One-to-Many (A member can have multiple attendance records)
7. **Branches → Members**: One-to-Many (A branch can have multiple members)
8. **Branches → Staff**: One-to-Many (A branch can have multiple staff members)
9. **Users → Trainers**: One-to-One (A trainer is a user with trainer role)
10. **Trainers → Training Sessions**: One-to-Many (A trainer can have multiple training sessions)
11. **Members → Training Sessions**: One-to-Many (A member can book multiple training sessions)
12. **Trainers → Trainer Schedule**: One-to-Many (A trainer can have multiple schedule entries)
13. **Trainers → Trainer Specialization**: One-to-Many (A trainer can have multiple specializations)
14. **Branches → Trainers**: One-to-Many (A branch can have multiple trainers)
15. **Diet Plans → Diet Meals**: One-to-Many (A diet plan contains multiple meals)
16. **Members → Member Diet**: One-to-Many (A member can have multiple diet plans)
17. **Member Diet → Diet Progress**: One-to-Many (A member diet has multiple progress records)
18. **Members → Member Workout**: One-to-Many (A member can have multiple workout sessions)
19. **Member Workout → Trainers**: Many-to-One (Workout sessions are assigned to trainers)
20. **Equipment → Equipment Maintenance**: One-to-Many (Equipment can have multiple maintenance records)
21. **Lockers → Member Locker**: One-to-One (A locker is assigned to one member)
22. **Members → Member Locker**: One-to-One (A member can have one locker)
23. **Branches → Lockers**: One-to-Many (A branch has multiple lockers)
24. **Coupons → Payments**: One-to-Many (A coupon can be used in multiple payments)
25. **Members → Health Information**: One-to-One (A member has one health record)
26. **Members → Reviews**: One-to-Many (A member can write multiple reviews)
27. **Trainers → Reviews**: One-to-Many (A trainer can receive multiple reviews)
28. **Staff → Leave Requests**: One-to-Many (A staff member can submit multiple leave requests)
29. **Branches → Expenses**: One-to-Many (A branch has multiple expense records)
30. **Members → Workouts**: One-to-Many (A member can have multiple workout sessions)
31. **Workouts → Exercises**: One-to-Many (A workout contains multiple exercises)

## 🔐 Authentication System

### Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │      │ Backend API │      │   Database   │
│   (Next.js) │      │  (Laravel)  │      │   (MySQL)    │
└──────┬──────┘      └──────┬──────┘      └──────┬───────┘
       │                    │                     │
       │ 1. Login Request   │                     │
       ├───────────────────>│                     │
       │ POST /api/v1/admin/login               │
       │ {email, password}  │                     │
       │                    │                     │
       │                    │ 2. Validate        │
       │                    │ Credentials        │
       │                    ├───────────────────>│
       │                    │                     │
       │                    │ 3. Check User      │
       │                    │ & Role             │
       │                    │<───────────────────│
       │                    │                     │
       │ 4. Generate Sanctum│                     │
       │    Token           │                     │
       │<───────────────────│                     │
       │ {token, user}      │                     │
       │                    │                     │
       │ 5. Store Token      │                     │
       │ (localStorage)     │                     │
       │                    │                     │
       │ 6. Protected Request│                    │
       ├───────────────────>│                     │
       │ Header:            │                     │
       │ Authorization: Bearer {token}             │
       │                    │                     │
       │                    │ 7. Validate Token   │
       │                    │ via Sanctum         │
       │                    │ middleware          │
       │                    │                     │
       │                    │ 8. Return Data      │
       │<───────────────────│                     │
```

### Authentication Components

#### 1. Backend (Laravel Sanctum)
- **Token Management**: Sanctum tokens for API authentication
- **Session Authentication**: Web-based authentication for admin panel
- **Middleware**: Role-based access control middleware
- **Controllers**: Separate auth controllers for Admin and User roles

#### 2. Frontend (Next.js)
- **Auth Context**: React Context for auth state management
- **Token Storage**: localStorage for Sanctum token persistence
- **API Client**: Axios interceptor for Sanctum token injection
- **Route Protection**: Middleware and HOCs for protected routes
- **Auth Hooks**: useAuth hook for authentication state
- **Token Refresh**: Automatic token refresh mechanism

### Role-Based Access Control (RBAC)

```
┌─────────────┬─────────────────────────────────────────┐
│    Role     │              Permissions                 │
├─────────────┼─────────────────────────────────────────┤
│   Admin     │ - Full system access                    │
│             │ - Manage all users and staff             │
│             │ - Manage trainers and schedules          │
│             │ - Create/edit membership plans           │
│             │ - View all payments and reports          │
│             │ - Manage inquiries                       │
│             │ - System settings                        │
├─────────────┼─────────────────────────────────────────┤
│   Staff     │ - View member information                │
│             │ - Manage attendance                      │
│             │ - View assigned branch reports           │
│             │ - Process inquiries                      │
│             │ - Limited payment view                   │
├─────────────┼─────────────────────────────────────────┤
│  Trainer    │ - View assigned member profiles          │
│             │ - Manage own schedule and availability  │
│             │ - View upcoming training sessions        │
│             │ - Access training session history       │
│             │ - Provide session feedback               │
│             │ - View own performance metrics           │
├─────────────┼─────────────────────────────────────────┤
│   Member    │ - View own profile                       │
│             │ - View own subscription                  │
│             │ - View own payment history               │
│             │ - View own attendance                    │
│             │ - Browse and book trainers               │
│             │ - Manage training sessions               │
│             │ - Rate trainers and sessions            │
│             │ - Update personal information            │
└─────────────┴─────────────────────────────────────────┘
```

## 💳 Payment System

### Payment Integration (SSLCommerz)

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   User      │      │ Backend API │      │ SSLCommerz   │
│             │      │             │      │              │
└──────┬──────┘      └──────┬──────┘      └──────┬───────┘
       │                    │                     │
       │ 1. Choose Plan     │                     │
       ├───────────────────>│                     │
       │                    │                     │
       │                    │ 2. Create Payment  │
       │                    │ Record             │
       │                    ├───────────────────>│
       │                    │                     │
       │ 3. Redirect to     │                     │
       │ Payment Gateway    │                     │
       │<───────────────────│                     │
       │                    │                     │
       │ 4. Make Payment    │                     │
       ├─────────────────────────────────────────>│
       │                    │                     │
       │                    │                     │
       │ 5. Payment Success  │                     │
       │<─────────────────────────────────────────│
       │                    │                     │
       │ 6. Update Payment   │                     │
       ├───────────────────>│                     │
       │ Status             │                     │
       │                    │                     │
       │                    │ 7. Generate Invoice│
       │                    │                     │
       │ 8. Redirect to     │                     │
       │ Success Page       │                     │
       │<───────────────────│                     │
```

### Payment Flow

1. **Plan Selection**: User selects membership plan
2. **Payment Initiation**: System creates payment record with SSLCommerz
3. **Gateway Redirect**: User redirected to SSLCommerz payment page
4. **Payment Processing**: SSLCommerz processes payment
5. **Payment Completion**: SSLCommerz sends success callback
6. **Record Update**: System updates payment status
7. **Invoice Generation**: System generates invoice
8. **Subscription Activation**: Member subscription activated

### Payment Status Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Pending │───▶│  Processing│───▶│Completed │    │  Failed  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                      │                                  │
                      │                                  │
                      ▼                                  ▼
                ┌──────────┐                      ┌──────────┐
                │  Refunded│                      │  Cancelled│
                └──────────┘                      └──────────┘
```

### Payment Features

- **Multiple Payment Methods**: Credit Card, Mobile Banking, etc.
- **Automatic Invoice Generation**: PDF invoices for each payment
- **Payment History**: Complete payment history for members
- **Refund Support**: Refund processing capability
- **Payment Reminders**: Automated payment due reminders
- **Revenue Reports**: Comprehensive revenue analytics

## 🏋️ Trainer Management System

### Trainer Management Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Admin     │      │    Trainer  │      │    Member    │
│             │      │             │      │              │
└──────┬──────┘      └──────┬──────┘      └──────┬───────┘
       │                    │                     │
       │ 1. Create/Manage   │                     │
       │ Trainer Profile   │                     │
       ├───────────────────>│                     │
       │                    │                     │
       │                    │ 2. Set Schedule     │
       │                    │ Availability        │
       │                    ├───────────────────>│
       │                    │                     │
       │                    │ 3. Add Specialization│
       │                    │ & Certification     │
       │                    ├────────────────────│
       │                    │                     │
       │                    │                     │ 4. Browse Trainers
       │                    │                     ├────────────────────│
       │                    │                     │
       │                    │                     │ 5. Book Session
       │                    │                     ├────────────────────│
       │                    │                     │
       │ 6. Session Request │                     │
       │<─────────────────────────────────────────│
       │                    │                     │
       │ 7. Confirm/Reject  │                     │
       ├───────────────────>│                     │
       │                    │                     │
       │                    │ 8. Session Confirmed│
       │                    ├───────────────────>│
       │                    │                     │
       │ 9. Conduct Session │                     │
       │                    ├────────────────────│
       │                    │                     │
       │ 10. Payment Process│                     │
       ├─────────────────────────────────────────>│
```

### Trainer Features

#### Admin Panel - Trainer Management
- [ ] **Trainer Profile Management**
  - Create trainer profiles with certification details
  - Update trainer information and specialties
  - Upload trainer photos and bio
  - Set trainer hourly/session rates
  - Manage trainer employment status

- [ ] **Trainer Schedule Management**
  - Set trainer working hours and availability
  - Manage time-off and holidays
  - View trainer schedule calendar
  - Schedule conflict detection
  - Real-time availability updates

- [ ] **Trainer Specialization**
  - Add trainer expertise areas (Yoga, Cardio, Weight Training, etc.)
  - Set certification levels and expiration dates
  - Manage trainer skills and qualifications
  - Specialization categories management

- [ ] **Training Session Management**
  - View all training sessions
  - Monitor session status (pending, confirmed, completed, cancelled)
  - Handle session cancellations and rescheduling
  - Track trainer performance metrics

- [ ] **Trainer Performance Reports**
  - Session completion rates
  - Member satisfaction ratings
  - Revenue generated per trainer
  - Trainer utilization reports
  - Performance analytics and insights

#### User Dashboard - Trainer Booking
- [ ] **Browse Trainers**
  - View all available trainers with profiles
  - Filter by specialization, availability, rating
  - Search trainers by name or expertise
  - View trainer schedules and availability
  - Read trainer reviews and ratings

- [ ] **Book Training Sessions**
  - Select preferred trainer
  - Choose available time slots
  - Specify session type (personal training, group sessions)
  - Confirm booking and make payment
  - Receive booking confirmation

- [ ] **My Training Sessions**
  - View upcoming training sessions
  - Access session history
  - Cancel or reschedule sessions
  - Provide feedback and ratings
  - Track training progress

- [ ] **Trainer Profiles**
  - Detailed trainer information
  - Certification and qualification details
  - Specialization and expertise areas
  - Session pricing and packages
  - Availability calendar

### Trainer Database Tables

#### Trainers Table
```sql
- id (primary key)
- user_id (foreign key to users)
- branch_id (foreign key to branches)
- employee_id (unique employee code)
- specialization (primary training expertise)
- certifications (JSON array of certifications)
- experience_years (total experience)
- hourly_rate (per hour rate)
- session_rate (per session rate)
- bio (trainer biography)
- rating_avg (average member rating)
- total_sessions (completed sessions count)
- status (active, on_leave, inactive)
- join_date (employment start date)
- created_at, updated_at
```

#### Trainer Specializations Table
```sql
- id (primary key)
- trainer_id (foreign key to trainers)
- specialization_name (e.g., Yoga, CrossFit, etc.)
- certification_level (beginner, intermediate, advanced, expert)
- certification_date
- expiry_date (if applicable)
- issuing_authority
- created_at, updated_at
```

#### Trainer Schedules Table
```sql
- id (primary key)
- trainer_id (foreign key to trainers)
- day_of_week (1-7, Monday-Sunday)
- start_time (session start time)
- end_time (session end time)
- is_available (availability status)
- max_sessions (maximum sessions per slot)
- notes (special instructions)
- created_at, updated_at
```

#### Training Sessions Table
```sql
- id (primary key)
- trainer_id (foreign key to trainers)
- member_id (foreign key to members)
- branch_id (foreign key to branches)
- session_date (scheduled date)
- start_time (session start time)
- end_time (session end time)
- session_type (personal, group, online)
- status (pending, confirmed, completed, cancelled, no_show)
- fee (session fee)
- payment_status (paid, pending, refunded)
- payment_id (foreign key to payments)
- notes (session notes)
- member_rating (1-5 stars)
- trainer_notes (trainer feedback)
- created_at, updated_at
```

### Laravel API Route Structure

#### Route Grouping in Laravel (routes/api.php)

```php
<?php

use App\Http\Controllers\Api\V1;
use Illuminate\Support\Facades\Route;

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    
    // Public Routes (No Authentication Required)
    Route::prefix('public')->group(function () {
        Route::get('/plans', [V1\Public\PricingController::class, 'index']);
        Route::get('/trainers', [V1\Public\TrainerController::class, 'index']);
        Route::post('/inquiries', [V1\Public\LeadInquiryController::class, 'store']);
        Route::post('/register', [V1\Public\RegisterController::class, 'store']);
        Route::post('/contact', [V1\Public\ContactController::class, 'store']);
        Route::get('/coupons', [V1\Public\CouponController::class, 'index']);
    });

    // Admin Routes (Admin Authentication Required)
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        
        // Authentication
        Route::post('/login', [V1\Admin\AuthController::class, 'login']);
        Route::post('/logout', [V1\Admin\AuthController::class, 'logout']);
        
        // Members
        Route::apiResource('members', V1\Admin\MemberController::class);
        
        // Staff
        Route::apiResource('staff', V1\Admin\StaffController::class);
        
        // Trainers
        Route::apiResource('trainers', V1\Admin\TrainerController::class);
        Route::get('/trainers/{id}/schedule', [V1\Admin\TrainerController::class, 'schedule']);
        Route::put('/trainers/{id}/schedule', [V1\Admin\TrainerController::class, 'updateSchedule']);
        Route::get('/trainers/reports/performance', [V1\Admin\TrainerController::class, 'performanceReport']);
        
        // Training Sessions
        Route::apiResource('training-sessions', V1\Admin\TrainingSessionController::class);
        
        // Diet Plans
        Route::apiResource('diet-plans', V1\Admin\DietPlanController::class);
        Route::get('/diet-plans/{id}/meals', [V1\Admin\DietPlanController::class, 'meals']);
        Route::post('/diet-plans/{id}/meals', [V1\Admin\DietPlanController::class, 'addMeal']);
        Route::get('/member-diets', [V1\Admin\MemberDietController::class, 'index']);
        Route::post('/member-diets', [V1\Admin\MemberDietController::class, 'assign']);
        Route::get('/diet-progress', [V1\Admin\DietProgressController::class, 'index']);
        
        // Workouts
        Route::apiResource('member-workouts', V1\Admin\MemberWorkoutController::class);
        Route::apiResource('exercises', V1\Admin\ExerciseController::class);
        
        // Health Information
        Route::apiResource('health-info', V1\Admin\HealthInfoController::class);
        
        // Equipment
        Route::apiResource('equipment', V1\Admin\EquipmentController::class);
        Route::get('/equipment/{id}/maintenance', [V1\Admin\EquipmentController::class, 'maintenance']);
        Route::post('/equipment/{id}/maintenance', [V1\Admin\EquipmentController::class, 'addMaintenance']);
        
        // Lockers
        Route::apiResource('lockers', V1\Admin\LockerController::class);
        Route::apiResource('member-lockers', V1\Admin\MemberLockerController::class);
        
        // Coupons & Discounts
        Route::apiResource('coupons', V1\Admin\CouponController::class);
        Route::get('/discounts', [V1\Admin\DiscountController::class, 'index']);
        
        // Reviews
        Route::apiResource('reviews', V1\Admin\ReviewController::class);
        
        // Leave Requests
        Route::apiResource('leave-requests', V1\Admin\LeaveRequestController::class);
        
        // Expenses
        Route::apiResource('expenses', V1\Admin\ExpenseController::class);
        
        // Membership Plans
        Route::apiResource('plans', V1\Admin\PlanController::class);
        
        // Inquiries & Payments
        Route::apiResource('inquiries', V1\Admin\InquiryController::class);
        Route::apiResource('payments', V1\Admin\PaymentController::class);
        
        // Attendance & Reports
        Route::apiResource('attendance', V1\Admin\AttendanceController::class);
        Route::get('/reports/revenue', [V1\Admin\ReportController::class, 'revenue']);
        Route::get('/reports/attendance', [V1\Admin\ReportController::class, 'attendance']);
        Route::get('/reports/trainer-performance', [V1\Admin\ReportController::class, 'trainerPerformance']);
        
        // Settings
        Route::get('/settings', [V1\Admin\SettingsController::class, 'index']);
        Route::put('/settings', [V1\Admin\SettingsController::class, 'update']);
        Route::get('/settings/profile', [V1\Admin\SettingsController::class, 'profile']);
        Route::put('/settings/profile', [V1\Admin\SettingsController::class, 'updateProfile']);
    });

    // User Routes (User Authentication Required)
    Route::middleware(['auth:sanctum', 'role:member'])->prefix('user')->group(function () {
        
        // Authentication
        Route::post('/login', [V1\User\AuthController::class, 'login']);
        Route::post('/logout', [V1\User\AuthController::class, 'logout']);
        
        // Profile
        Route::get('/profile', [V1\User\ProfileController::class, 'show']);
        Route::put('/profile', [V1\User\ProfileController::class, 'update']);
        
        // Subscription
        Route::get('/subscription', [V1\User\SubscriptionController::class, 'current']);
        Route::get('/subscription/history', [V1\User\SubscriptionController::class, 'history']);
        
        // Payments
        Route::apiResource('payments', V1\User\PaymentController::class)->only(['index', 'show']);
        
        // Attendance
        Route::get('/attendance', [V1\User\AttendanceController::class, 'index']);
        Route::get('/attendance/calendar', [V1\User\AttendanceController::class, 'calendar']);
        
        // Trainers
        Route::get('/trainers', [V1\User\TrainerController::class, 'index']);
        Route::get('/trainers/{id}', [V1\User\TrainerController::class, 'show']);
        Route::get('/trainers/{id}/availability', [V1\User\TrainerController::class, 'availability']);
        Route::get('/trainers/{id}/reviews', [V1\User\TrainerController::class, 'reviews']);
        
        // Training Sessions
        Route::apiResource('training-sessions', V1\User\TrainingSessionController::class);
        Route::post('/training-sessions/{id}/rating', [V1\User\TrainingSessionController::class, 'rate']);
        
        // Diet & Nutrition
        Route::get('/diet-plans', [V1\User\DietController::class, 'availablePlans']);
        Route::get('/my-diet', [V1\User\DietController::class, 'currentDiet']);
        Route::get('/diet-progress', [V1\User\DietController::class, 'progress']);
        Route::post('/diet-progress', [V1\User\DietController::class, 'updateProgress']);
        
        // Workouts
        Route::get('/my-workouts', [V1\User\WorkoutController::class, 'index']);
        Route::get('/my-workouts/{id}', [V1\User\WorkoutController::class, 'show']);
        Route::post('/my-workouts/{id}/complete', [V1\User\WorkoutController::class, 'complete']);
        Route::get('/exercises', [V1\User\WorkoutController::class, 'exercises']);
        
        // Health Information
        Route::get('/health-info', [V1\User\HealthController::class, 'show']);
        Route::put('/health-info', [V1\User\HealthController::class, 'update']);
        
        // Reviews
        Route::get('/my-reviews', [V1\User\ReviewController::class, 'index']);
        Route::post('/reviews', [V1\User\ReviewController::class, 'store']);
        
        // Lockers
        Route::get('/my-locker', [V1\User\LockerController::class, 'show']);
    });
});

// Health Check (No Versioning)
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'GMS API']);
});
```

#### Benefits of API Versioning with Laravel:

1. **🔄 Backward Compatibility**: Old v1 APIs continue working while you develop v2
2. **🛡️ Security**: Separate middleware per role group (admin, user, public)
3. **📊 Easy Monitoring**: Track usage patterns per API version
4. **🚀 Smooth Migration**: Gradually migrate clients to newer versions
5. **🎯 Role-Based Access**: Clear separation between admin, user, and public endpoints
6. **📝 Easy Testing**: Test each version independently
7. **🔧 Maintenance**: Maintain multiple API versions simultaneously

#### URL Structure Examples:
- **Public**: `/api/v1/public/plans`
- **Admin**: `/api/v1/admin/members`
- **User**: `/api/v1/user/my-workouts`
- **Health**: `/api/health`

### Complete API Endpoints

#### Admin Endpoints
```
# Authentication
POST   /api/v1/admin/login                    - Admin login
POST   /api/v1/admin/logout                   - Admin logout

# Members
GET    /api/v1/admin/members                  - Get all members
GET    /api/v1/admin/members/{id}             - Get member details
POST   /api/v1/admin/members                  - Create member
PUT    /api/v1/admin/members/{id}             - Update member
DELETE /api/v1/admin/members/{id}             - Delete member

# Staff
GET    /api/v1/admin/staff                    - Get all staff
GET    /api/v1/admin/staff/{id}               - Get staff details
POST   /api/v1/admin/staff                    - Create staff
PUT    /api/v1/admin/staff/{id}               - Update staff
DELETE /api/v1/admin/staff/{id}               - Delete staff

# Trainers
GET    /api/v1/admin/trainers                  - Get all trainers
GET    /api/v1/admin/trainers/{id}             - Get trainer details
POST   /api/v1/admin/trainers                  - Create new trainer
PUT    /api/v1/admin/trainers/{id}             - Update trainer info
DELETE /api/v1/admin/trainers/{id}             - Delete trainer
GET    /api/v1/admin/trainers/{id}/schedule    - Get trainer schedule
PUT    /api/v1/admin/trainers/{id}/schedule    - Update trainer schedule

# Training Sessions
GET    /api/v1/admin/training-sessions         - Get all training sessions
GET    /api/v1/admin/training-sessions/{id}    - Get session details
PUT    /api/v1/admin/training-sessions/{id}    - Update session status

# Diet Plans
GET    /api/v1/admin/diet-plans                - Get all diet plans
GET    /api/v1/admin/diet-plans/{id}           - Get diet plan details
POST   /api/v1/admin/diet-plans                - Create diet plan
PUT    /api/v1/admin/diet-plans/{id}           - Update diet plan
DELETE /api/v1/admin/diet-plans/{id}           - Delete diet plan
GET    /api/v1/admin/diet-plans/{id}/meals     - Get diet plan meals
POST   /api/v1/admin/diet-plans/{id}/meals     - Add meal to plan
GET    /api/v1/admin/member-diets              - Get member diet assignments
POST   /api/v1/admin/member-diets              - Assign diet to member
GET    /api/v1/admin/diet-progress             - Get diet progress tracking

# Workouts
GET    /api/v1/admin/member-workouts           - Get member workouts
GET    /api/v1/admin/member-workouts/{id}      - Get workout details
POST   /api/v1/admin/member-workouts           - Create workout plan
PUT    /api/v1/admin/member-workouts/{id}      - Update workout plan
GET    /api/v1/admin/exercises                 - Get exercise library
POST   /api/v1/admin/exercises                 - Add exercise

# Health Information
GET    /api/v1/admin/health-info               - Get member health info
GET    /api/v1/admin/health-info/{id}          - Get health details
POST   /api/v1/admin/health-info/{id}         - Update health info

# Equipment
GET    /api/v1/admin/equipment                 - Get all equipment
GET    /api/v1/admin/equipment/{id}            - Get equipment details
POST   /api/v1/admin/equipment                 - Add equipment
PUT    /api/v1/admin/equipment/{id}            - Update equipment
DELETE /api/v1/admin/equipment/{id}            - Delete equipment
GET    /api/v1/admin/equipment/{id}/maintenance - Get maintenance history
POST   /api/v1/admin/equipment/{id}/maintenance - Add maintenance record

# Lockers
GET    /api/v1/admin/lockers                   - Get all lockers
GET    /api/v1/admin/lockers/{id}              - Get locker details
POST   /api/v1/admin/lockers                   - Add locker
PUT    /api/v1/admin/lockers/{id}              - Update locker status
POST   /api/v1/admin/member-lockers            - Assign locker to member
GET    /api/v1/admin/member-lockers            - Get locker assignments

# Coupons & Discounts
GET    /api/v1/admin/coupons                   - Get all coupons
POST   /api/v1/admin/coupons                   - Create coupon
PUT    /api/v1/admin/coupons/{id}              - Update coupon
DELETE /api/v1/admin/coupons/{id}              - Delete coupon
GET    /api/v1/admin/discounts                 - Get discount usage

# Reviews
GET    /api/v1/admin/reviews                   - Get all reviews
PUT    /api/v1/admin/reviews/{id}              - Update review status
DELETE /api/v1/admin/reviews/{id}              - Delete review

# Leave Requests
GET    /api/v1/admin/leave-requests            - Get all leave requests
GET    /api/v1/admin/leave-requests/{id}       - Get leave request details
PUT    /api/v1/admin/leave-requests/{id}       - Approve/reject leave request

# Expenses
GET    /api/v1/admin/expenses                  - Get all expenses
GET    /api/v1/admin/expenses/{id}             - Get expense details
POST   /api/v1/admin/expenses                  - Add expense
PUT    /api/v1/admin/expenses/{id}             - Update expense
DELETE /api/v1/admin/expenses/{id}             - Delete expense

# Membership Plans
GET    /api/v1/admin/plans                     - Get all plans
POST   /api/v1/admin/plans                     - Create plan
PUT    /api/v1/admin/plans/{id}                - Update plan
DELETE /api/v1/admin/plans/{id}                - Delete plan

# Inquiries & Payments
GET    /api/v1/admin/inquiries                 - Get all inquiries
PUT    /api/v1/admin/inquiries/{id}            - Update inquiry status
GET    /api/v1/admin/payments                   - Get all payments
GET    /api/v1/admin/payments/{id}              - Get payment details

# Attendance & Reports
GET    /api/v1/admin/attendance                 - Get attendance records
GET    /api/v1/admin/reports/revenue            - Revenue reports
GET    /api/v1/admin/reports/attendance         - Attendance reports
GET    /api/v1/admin/reports/trainer-performance - Trainer performance reports

# Settings
GET    /api/v1/admin/settings                  - Get system settings
PUT    /api/v1/admin/settings                  - Update settings
GET    /api/v1/admin/settings/profile          - Admin profile
PUT    /api/v1/admin/settings/profile          - Update admin profile
```

#### User Endpoints
```
# Authentication
POST   /api/v1/user/login                      - User login
POST   /api/v1/user/logout                     - User logout

# Profile
GET    /api/v1/user/profile                    - Get user profile
PUT    /api/v1/user/profile                    - Update profile

# Subscription
GET    /api/v1/user/subscription               - Current subscription
GET    /api/v1/user/subscription/history       - Subscription history

# Payments
GET    /api/v1/user/payments                   - Payment history
GET    /api/v1/user/payments/{id}              - Payment details
POST   /api/v1/user/payments                   - Make payment

# Attendance
GET    /api/v1/user/attendance                 - Attendance history
GET    /api/v1/user/attendance/calendar        - Attendance calendar

# Trainers
GET    /api/v1/user/trainers                   - Browse available trainers
GET    /api/v1/user/trainers/{id}              - Get trainer profile
GET    /api/v1/user/trainers/{id}/availability - Check trainer availability
GET    /api/v1/user/trainers/{id}/reviews      - Get trainer reviews

# Training Sessions
POST   /api/v1/user/training-sessions          - Book training session
GET    /api/v1/user/training-sessions          - Get my training sessions
GET    /api/v1/user/training-sessions/{id}     - Session details
PUT    /api/v1/user/training-sessions/{id}     - Update/cancel session
POST   /api/v1/user/training-sessions/{id}/rating - Rate trainer session

# Diet & Nutrition
GET    /api/v1/user/diet-plans                 - Available diet plans
GET    /api/v1/user/my-diet                    - Current diet plan
GET    /api/v1/user/diet-progress              - Diet progress tracking
POST   /api/v1/user/diet-progress              - Update diet progress

# Workouts
GET    /api/v1/user/my-workouts                - My workout plans
GET    /api/v1/user/my-workouts/{id}           - Workout details
POST   /api/v1/user/my-workouts/{id}/complete  - Complete workout
GET    /api/v1/user/exercises                  - Exercise library

# Health Information
GET    /api/v1/user/health-info                - My health information
PUT    /api/v1/user/health-info                - Update health information

# Reviews
GET    /api/v1/user/my-reviews                 - My reviews
POST   /api/v1/user/reviews                    - Submit review

# Lockers
GET    /api/v1/user/my-locker                  - My locker assignment
```

#### Public Endpoints
```
GET  /api/v1/public/plans                      - Get membership plans
GET  /api/v1/public/trainers                   - Browse trainers
POST /api/v1/public/inquiries                  - Submit lead inquiry
POST /api/v1/public/register                   - Public registration
POST /api/v1/public/contact                    - Contact form submission
GET  /api/v1/public/coupons                    - Available coupons
```

### Trainer Management Flow

#### Registration & Onboarding
1. Admin creates trainer profile with personal details
2. Add certifications and specializations
3. Set working schedule and availability
4. Set hourly/session rates
5. Upload profile photo and bio

#### Session Booking Flow
1. Member browses available trainers
2. Views trainer profiles and availability
3. Selects preferred time slot
4. Confirms booking and makes payment
5. Trainer receives notification
6. Session is added to both calendars

#### Session Execution
1. Trainer and member meet for session
2. Trainer conducts training session
3. Session marked as completed
4. Member can rate trainer and provide feedback
5. Trainer can add session notes
6. Payment is processed and distributed

### Trainer Commission & Payment
- **Commission Structure**: Trainers receive percentage of session fee
- **Payment Processing**: Automated payment distribution
- **Commission Tracking**: Real-time commission calculation
- **Payment History**: Complete payment records for trainers
- **Tax Documentation**: Generate tax reports and documents

### Trainer Performance Analytics
- **Session Metrics**: Total sessions, completion rate, cancellations
- **Revenue Metrics**: Revenue generated, average session value
- **Member Satisfaction**: Average ratings, feedback analysis
- **Utilization Rate**: Hours booked vs available hours
- **Popular Trainers**: Most booked trainers ranking
- **Trend Analysis**: Performance trends over time

## 📋 Project Requirements

### Functional Requirements

#### Public Website
- [ ] Home page with gym information and features
- [ ] About page with gym details and facilities
- [ ] Contact page with contact form
- [ ] Pricing page with membership plans
- [ ] Registration/Inquiry form for potential members
- [ ] Responsive design for mobile devices

#### Admin Panel
- [ ] Dashboard with overview statistics
- [ ] Member management (CRUD operations)
- [ ] Staff management and permissions
- [ ] **Trainer management and scheduling**
- [ ] **Training session monitoring**
- [ ] **Diet plan management and meal planning**
- [ ] **Workout plan creation and exercise library**
- [ ] **Health information tracking**
- [ ] **Equipment management and maintenance tracking**
- [ ] **Locker allocation and management**
- [ ] **Coupon and discount management**
- [ ] **Review moderation and management**
- [ ] **Staff leave request processing**
- [ ] **Expense tracking and management**
- [ ] Membership plan management
- [ ] Lead inquiry management and approval
- [ ] Payment tracking and management
- [ ] Attendance tracking and monitoring
- [ ] Reports generation (revenue, attendance, trainer performance)
- [ ] System settings and configuration
- [ ] Branch management

#### User Dashboard
- [ ] Personal profile management
- [ ] Current subscription details
- [ ] Payment history and invoices
- [ ] Attendance history and calendar
- [ ] **Browse and book personal trainers**
- [ ] **View trainer profiles and availability**
- [ ] **Manage training sessions**
- [ ] **Rate and review trainers**
- [ ] **Diet plan tracking and progress**
- [ ] **Workout plan management**
- [ ] **Health information management**
- [ ] **Locker assignment and management**
- [ ] **Review and feedback system**
- [ ] Membership renewal options
- [ ] Contact support functionality

### Technical Requirements

#### Backend Requirements
- [ ] RESTful API architecture
- [ ] Laravel 12 framework
- [ ] MySQL database
- [ ] Sanctum authentication
- [ ] Role-based access control
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Input validation and sanitization
- [ ] Error handling and logging
- [ ] Background job processing
- [ ] Email notifications
- [ ] File upload system (images, documents)
- [ ] Database seeding for initial data
- [ ] Query optimization and indexing
- [ ] Database backup and recovery
- [ ] Caching system (Redis)

#### Frontend Requirements
- [ ] Next.js 14+ framework
- [ ] TypeScript for type safety
- [ ] Tailwind CSS for styling
- [ ] shadcn/ui component library
- [ ] Responsive design
- [ ] State management
- [ ] API integration
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states and animations
- [ ] Chart libraries (ApexCharts) for analytics
- [ ] Image upload and preview
- [ ] Real-time notifications
- [ ] File upload functionality
- [ ] Date and time pickers
- [ ] Progress tracking components

#### Payment Requirements
- [ ] SSLCommerz integration
- [ ] Secure payment processing
- [ ] Invoice generation
- [ ] Payment history tracking
- [ ] Refund processing
- [ ] Payment notifications
- [ ] Revenue analytics

### Non-Functional Requirements

#### Security
- [ ] HTTPS/SSL implementation
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure password hashing
- [ ] API rate limiting
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Data encryption

#### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query optimization
- [ ] Caching implementation
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] CDN implementation

#### Scalability
- [ ] Horizontal scaling support
- [ ] Load balancing capability
- [ ] Database indexing
- [ ] Caching strategy
- [ ] Background job processing
- [ ] API rate limiting

#### Reliability
- [ ] Error handling
- [ ] Data backup strategy
- [ ] Disaster recovery plan
- [ ] Monitoring and logging
- [ ] Health checks
- [ ] Automated testing

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gms
   ```

2. **Backend Setup**
   ```bash
   cd app/backend-api
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

3. **Frontend Setup**
   ```bash
   cd app/frontend
   npm install
   npm run dev
   ```

4. **Website Setup**
   ```bash
   cd website
   npm install
   npm run dev
   ```

## 📝 API Documentation

**📋 Complete API Reference**: See the [Complete API Endpoints](#complete-api-endpoints) section above for comprehensive API documentation including:

- ✅ Laravel Route Structure with versioning
- ✅ Admin Endpoints (Complete CRUD operations)
- ✅ User Endpoints (Member functionality)
- ✅ Public Endpoints (No authentication required)
- ✅ All new features (Diet, Workout, Health, Equipment, Lockers, etc.)

**🔐 Authentication**: All protected endpoints use Laravel Sanctum token authentication:
```
Authorization: Bearer {token}
```

### Quick Reference

#### Core Endpoints
```
# Authentication
POST   /api/v1/admin/login                  - Admin login
POST   /api/v1/user/login                   - User login

# Public Access
GET  /api/v1/public/plans                   - Membership plans
POST /api/v1/public/inquiries               - Submit inquiry

# Key Admin Operations
GET    /api/v1/admin/members                - Member list
POST   /api/v1/admin/members                - Create member
GET    /api/v1/admin/trainers               - Trainer list
POST   /api/v1/admin/trainers               - Create trainer
GET    /api/v1/admin/reports/revenue        - Revenue reports

# Key User Operations
GET  /api/v1/user/profile                   - User profile
GET  /api/v1/user/subscription              - Current subscription
GET  /api/v1/user/trainers                  - Browse trainers
POST /api/v1/user/training-sessions         - Book session
```

**📖 For detailed API documentation with all endpoints, see the [Complete API Endpoints](#complete-api-endpoints) section.**

## 🛠️ Technologies Used

### Backend
- **Framework**: Laravel 12
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **Payment Gateway**: SSLCommerz
- **API Documentation**: Swagger/OpenAPI
- **Testing**: PHPUnit

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: ApexCharts
- **State Management**: React Context
- **Forms**: React Hook Form + Zod

### DevOps
- **Version Control**: Git
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Laravel Telescope

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Developer Name]
- **Frontend Developer**: [Developer Name]
- **Database Designer**: [Designer Name]

## 📞 Support

For support, email support@gms.com or contact our team at +880 1234-567890

---

**Version**: 1.0.0
**Last Updated**: 2026-07-13

## 🎯 Trainer Management System Summary

### Key Features Implemented:
✅ Complete trainer profile management with certifications  
✅ Flexible scheduling system with availability management  
✅ Training session booking and management  
✅ Trainer performance analytics and reporting  
✅ Commission tracking and payment distribution  
✅ Member rating and feedback system  
✅ Integration with existing payment system  
✅ Role-based access control for trainers  
✅ Real-time availability checking  
✅ Specialization and expertise management  

### Database Tables Added:
- Trainers (main trainer profiles)
- Trainer Specializations (certifications and expertise)
- Trainer Schedules (working hours and availability)
- Training Sessions (booked sessions with members)

### API Endpoints Added:
- Admin: Full trainer management capabilities
- User: Browse, book, and manage training sessions
- Trainer: Personal schedule and session management

### Dashboard Features:
- Admin: Comprehensive trainer management interface
- User: Trainer discovery and booking system
- Trainer: Personal schedule and session management interface

---

## 🎯 Summary: Complete Gym Management System

### 🏗️ Architecture Overview

**Technology Stack:**
- **Backend**: Laravel 12 + MySQL 8.0 + Sanctum Auth
- **Frontend**: Next.js 14+ + TypeScript + Tailwind CSS
- **API**: RESTful with versioning (v1)
- **Payment**: SSLCommerz Integration
- **Database**: MySQL with comprehensive relationships

### 📊 System Modules

#### 1. **User Management**
- Multi-role authentication (Admin, Staff, Trainer, Member)
- Role-based access control
- Profile management for all user types

#### 2. **Membership System**
- Membership plan management
- Subscription tracking
- Payment processing and invoicing
- Lead inquiry management

#### 3. **Training Management**
- Trainer profiles and specialization
- Schedule management and availability
- Training session booking
- Performance analytics and reporting

#### 4. **Health & Nutrition**
- Diet plan creation and assignment
- Meal planning and calorie tracking
- Progress monitoring
- Health information management

#### 5. **Workout System**
- Workout plan creation
- Exercise library management
- Member workout tracking
- Progress monitoring

#### 6. **Facility Management**
- Equipment tracking and maintenance
- Locker allocation and management
- Branch management
- Staff leave management

#### 7. **Financial Management**
- Payment processing and tracking
- Coupon and discount system
- Expense management
- Revenue reporting and analytics

#### 8. **Communication System**
- Review and feedback system
- Email notifications
- Inquiry management
- Leave request processing

### 🔐 Security Features

- **Authentication**: Laravel Sanctum token-based auth
- **Authorization**: Role-based access control (RBAC)
- **API Security**: Rate limiting and input validation
- **Data Protection**: Secure password hashing, SQL injection prevention
- **HTTPS Support**: SSL/TLS encryption ready

### 📈 Scalability & Performance

- **Database Optimization**: Proper indexing and query optimization
- **Caching**: Redis integration for performance
- **Background Jobs**: Laravel Queue for heavy processing
- **API Versioning**: Smooth migration path for future updates
- **Load Balancing Ready**: Stateless API design

### 🧪 Testing & Quality Assurance

- **Backend**: PHPUnit for Laravel testing
- **Frontend**: Jest for React component testing
- **API Testing**: Postman collections for endpoint testing
- **Integration Tests**: End-to-end workflow testing

### 📱 User Experience

- **Responsive Design**: Works on all devices
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Real-time Updates**: Instant notifications and updates
- **Intuitive Navigation**: User-friendly interface design
- **Accessibility**: WCAG compliance considerations

### 🚀 Deployment Ready

- **Environment Configuration**: Proper .env setup
- **Database Migrations**: Version-controlled database schema
- **API Documentation**: Comprehensive endpoint documentation
- **Monitoring**: Laravel Telescope integration
- **Backup Strategy**: Database and file backup procedures

### 📊 Analytics & Reporting

- **Revenue Analytics**: Income and expense tracking
- **Attendance Reports**: Member participation metrics
- **Trainer Performance**: Session completion and ratings
- **Member Analytics**: Subscription trends and engagement
- **Equipment Usage**: Facility utilization metrics

---

## 🎉 Project Status

**✅ Documentation Complete**: All features documented with API endpoints, database schema, and implementation guidelines.

**🔄 Ready for Development**: Clear structure and specifications for building a complete Gym Management System.

**📈 Enterprise Ready**: Scalable architecture supporting growth and feature expansion.

**🛡️ Production Ready**: Security, performance, and monitoring considerations included.

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-14  
**Tech Stack**: Laravel 12 + Next.js 14 + MySQL  
**Status**: Ready for Development 🚀

---

## 👥 Development Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Developer Name]  
- **Frontend Developer**: [Developer Name]
- **Database Designer**: [Designer Name]
- **QA Engineer**: [QA Name]

---

## 📞 Support & Contact

For technical support or questions about this project:
- **Email**: support@gms.com
- **Phone**: +880 1234-567890
- **Documentation**: See above sections
- **Issues**: Report via project management system

---

**Gym Management System (GMS)** - A complete solution for modern gym operations 🏋️‍♂️✨