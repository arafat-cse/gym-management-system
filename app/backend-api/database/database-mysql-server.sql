-- =====================================================================
--  GYM MANAGEMENT SYSTEM — MySQL Server Schema Script
--  Tested for: MySQL 8.x (Workbench / phpMyAdmin / CLI)
--
--  Run options:
--    CLI      : mysql -u root -p < database-mysql-server.sql
--    Workbench: open file > Execute (lightning bolt icon)
--    phpMyAdmin: Import > choose file > Go
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Database
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS gym_management_system
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gym_management_system;

-- ---------------------------------------------------------------------
-- Note: re-run korar age niche-commented line ta uncomment korun,
-- nahole existing table thakle "Table already exists" error dibe.
-- ---------------------------------------------------------------------
-- DROP DATABASE IF EXISTS gym_management_system;

-- =====================================================================
-- 1. USERS & ACCESS MANAGEMENT
-- =====================================================================

CREATE TABLE users (
    id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name               VARCHAR(255) NOT NULL,
    last_name                VARCHAR(255) NOT NULL,
    email                    VARCHAR(255) NOT NULL,
    phone                    VARCHAR(255) NULL,
    email_verified_at        TIMESTAMP NULL,
    password                 VARCHAR(255) NOT NULL,
    role                     ENUM('admin','staff','trainer','member') NOT NULL DEFAULT 'member',
    gender                   ENUM('male','female','other') NULL,
    blood_group              VARCHAR(255) NULL,
    religion                 VARCHAR(255) NULL,
    nid_number               VARCHAR(255) NULL,
    birth_certificate_number VARCHAR(255) NULL,
    emergency_contact_number VARCHAR(255) NULL,
    date_of_birth            DATE NULL,
    joining_date             DATE NULL,
    remember_token           VARCHAR(100) NULL,
    created_at               TIMESTAMP NULL,
    updated_at               TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY roles_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY permissions_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Many-to-many: roles <-> permissions
CREATE TABLE permission_role (
    role_id       BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_permission_role_role FOREIGN KEY (role_id)
        REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_permission_role_permission FOREIGN KEY (permission_id)
        REFERENCES permissions (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API tokens (polymorphic — no FK)
CREATE TABLE personal_access_tokens (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id   BIGINT UNSIGNED NOT NULL,
    name           VARCHAR(255) NOT NULL,
    token          VARCHAR(64) NOT NULL,
    abilities      TEXT NULL,
    last_used_at   TIMESTAMP NULL,
    expires_at     TIMESTAMP NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY personal_access_tokens_token_unique (token),
    INDEX personal_access_tokens_tokenable_index (tokenable_type, tokenable_id),
    INDEX personal_access_tokens_expires_at_index (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 2. BRANCHES
-- =====================================================================

CREATE TABLE branches (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    address         VARCHAR(255) NULL,
    phone           VARCHAR(255) NULL,
    contact_details JSON NULL,
    operating_hours JSON NULL,
    status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 3. MEMBERS
-- =====================================================================

CREATE TABLE members (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT UNSIGNED NOT NULL,
    branch_id  BIGINT UNSIGNED NULL,
    phone      VARCHAR(255) NULL,
    address    VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY members_user_id_unique (user_id),
    CONSTRAINT fk_members_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_members_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE member_registrations (
    id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id                BIGINT UNSIGNED NULL,
    first_name               VARCHAR(255) NOT NULL,
    last_name                VARCHAR(255) NOT NULL,
    email                    VARCHAR(255) NOT NULL,
    phone                    VARCHAR(255) NULL,
    password                 VARCHAR(255) NOT NULL,
    address                  VARCHAR(255) NULL,
    branch_id                BIGINT UNSIGNED NULL,
    gender                   ENUM('male','female','other') NULL,
    blood_group              VARCHAR(255) NULL,
    religion                 VARCHAR(255) NULL,
    nid_number               VARCHAR(255) NULL,
    birth_certificate_number VARCHAR(255) NULL,
    emergency_contact_number VARCHAR(255) NULL,
    date_of_birth            DATE NULL,
    joining_date             DATE NULL,
    status                   ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    rejection_reason         TEXT NULL,
    approved_by              BIGINT UNSIGNED NULL,
    approved_at              TIMESTAMP NULL,
    created_at               TIMESTAMP NULL,
    updated_at               TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_member_registrations_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_member_registrations_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_member_registrations_approved_by FOREIGN KEY (approved_by)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE health_info (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id         BIGINT UNSIGNED NOT NULL,
    height            DECIMAL(5,2) NULL,
    weight            DECIMAL(5,2) NULL,
    bmi               DECIMAL(5,2) NULL,
    blood_type        VARCHAR(255) NULL,
    allergies         TEXT NULL,
    conditions        TEXT NULL,
    medications       TEXT NULL,
    emergency_contact VARCHAR(255) NULL,
    created_at        TIMESTAMP NULL,
    updated_at        TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY health_info_member_id_unique (member_id),
    CONSTRAINT fk_health_info_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendances (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id  BIGINT UNSIGNED NOT NULL,
    branch_id  BIGINT UNSIGNED NULL,
    date       DATE NOT NULL,
    check_in   DATETIME NOT NULL,
    check_out  DATETIME NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_attendances_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attendances_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 4. MEMBERSHIP PLANS & SUBSCRIPTIONS
-- =====================================================================

CREATE TABLE membership_plans (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name             VARCHAR(255) NOT NULL,
    description      TEXT NULL,
    price            DECIMAL(10,2) NOT NULL,
    duration_in_days INT UNSIGNED NOT NULL,
    features         JSON NULL,
    status           ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at       TIMESTAMP NULL,
    updated_at       TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subscriptions (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id          BIGINT UNSIGNED NOT NULL,
    membership_plan_id BIGINT UNSIGNED NOT NULL,
    price_paid         DECIMAL(10,2) NULL,
    start_date         DATE NOT NULL,
    end_date           DATE NOT NULL,
    status             ENUM('pending','active','expired','cancelled') NOT NULL DEFAULT 'pending',
    notes              TEXT NULL,
    created_at         TIMESTAMP NULL,
    updated_at         TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_subscriptions_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_subscriptions_plan FOREIGN KEY (membership_plan_id)
        REFERENCES membership_plans (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lead_inquiries (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name               VARCHAR(255) NOT NULL,
    email              VARCHAR(255) NOT NULL,
    phone              VARCHAR(255) NOT NULL,
    membership_plan_id BIGINT UNSIGNED NULL,
    message            TEXT NULL,
    status             ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    notes              TEXT NULL,
    created_at         TIMESTAMP NULL,
    updated_at         TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lead_inquiries_plan FOREIGN KEY (membership_plan_id)
        REFERENCES membership_plans (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. STAFF & HR
-- =====================================================================

CREATE TABLE staff (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     BIGINT UNSIGNED NOT NULL,
    branch_id   BIGINT UNSIGNED NULL,
    designation VARCHAR(255) NULL,
    status      ENUM('active','inactive','on_leave') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY staff_user_id_unique (user_id),
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_staff_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE leave_requests (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    staff_id    BIGINT UNSIGNED NOT NULL,
    leave_type  ENUM('sick','casual','annual','other') NOT NULL DEFAULT 'casual',
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    reason      TEXT NULL,
    status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    approved_by BIGINT UNSIGNED NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_leave_requests_staff FOREIGN KEY (staff_id)
        REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_leave_requests_approved_by FOREIGN KEY (approved_by)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 6. TRAINERS & TRAINING SESSIONS
-- =====================================================================

CREATE TABLE trainers (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id          BIGINT UNSIGNED NOT NULL,
    branch_id        BIGINT UNSIGNED NULL,
    employee_id      VARCHAR(255) NULL,
    specialization   VARCHAR(255) NULL,
    certifications   JSON NULL,
    experience_years INT UNSIGNED NOT NULL DEFAULT 0,
    hourly_rate      DECIMAL(10,2) NULL,
    session_rate     DECIMAL(10,2) NULL,
    bio              TEXT NULL,
    rating_avg       DECIMAL(3,2) NOT NULL DEFAULT 0,
    total_sessions   INT UNSIGNED NOT NULL DEFAULT 0,
    status           ENUM('active','on_leave','inactive') NOT NULL DEFAULT 'active',
    join_date        DATE NULL,
    created_at       TIMESTAMP NULL,
    updated_at       TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY trainers_user_id_unique (user_id),
    UNIQUE KEY trainers_employee_id_unique (employee_id),
    CONSTRAINT fk_trainers_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_trainers_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trainer_specializations (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    trainer_id          BIGINT UNSIGNED NOT NULL,
    specialization_name VARCHAR(255) NOT NULL,
    certification_level ENUM('beginner','intermediate','advanced','expert') NULL,
    certification_date  DATE NULL,
    expiry_date         DATE NULL,
    issuing_authority   VARCHAR(255) NULL,
    created_at          TIMESTAMP NULL,
    updated_at          TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_trainer_specializations_trainer FOREIGN KEY (trainer_id)
        REFERENCES trainers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trainer_schedules (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    trainer_id   BIGINT UNSIGNED NOT NULL,
    day_of_week  TINYINT UNSIGNED NOT NULL,
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    max_sessions INT UNSIGNED NOT NULL DEFAULT 1,
    notes        VARCHAR(255) NULL,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_trainer_schedules_trainer FOREIGN KEY (trainer_id)
        REFERENCES trainers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE training_sessions (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    trainer_id     BIGINT UNSIGNED NOT NULL,
    member_id      BIGINT UNSIGNED NOT NULL,
    branch_id      BIGINT UNSIGNED NULL,
    session_date   DATE NOT NULL,
    start_time     TIME NOT NULL,
    end_time       TIME NOT NULL,
    session_type   ENUM('personal','group','online') NOT NULL DEFAULT 'personal',
    status         ENUM('pending','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
    fee            DECIMAL(10,2) NULL,
    payment_status ENUM('paid','pending','refunded') NOT NULL DEFAULT 'pending',
    notes          TEXT NULL,
    member_rating  TINYINT UNSIGNED NULL,
    trainer_notes  TEXT NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_training_sessions_trainer FOREIGN KEY (trainer_id)
        REFERENCES trainers (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_training_sessions_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_training_sessions_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id  BIGINT UNSIGNED NOT NULL,
    trainer_id BIGINT UNSIGNED NOT NULL,
    rating     TINYINT UNSIGNED NOT NULL,
    comment    TEXT NULL,
    status     ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_reviews_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_trainer FOREIGN KEY (trainer_id)
        REFERENCES trainers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 7. PAYMENTS & COUPONS
-- =====================================================================

CREATE TABLE payment_numbers (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    method     ENUM('bkash','nagad') NOT NULL,
    number     VARCHAR(255) NOT NULL,
    label      VARCHAR(255) NULL,
    is_active  TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE coupons (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code       VARCHAR(255) NOT NULL,
    type       ENUM('percentage','fixed') NOT NULL,
    discount   DECIMAL(10,2) NOT NULL,
    min_order  DECIMAL(10,2) NULL,
    max_uses   INT UNSIGNED NULL,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATE NULL,
    status     ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY coupons_code_unique (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_registration_id BIGINT UNSIGNED NOT NULL,
    membership_plan_id     BIGINT UNSIGNED NOT NULL,
    coupon_id              BIGINT UNSIGNED NULL,
    method                 ENUM('bkash','nagad') NOT NULL,
    sender_number          VARCHAR(255) NOT NULL,
    transaction_id         VARCHAR(255) NOT NULL,
    amount                 DECIMAL(10,2) NOT NULL,
    discount_amount        DECIMAL(10,2) NULL,
    screenshot_path        VARCHAR(255) NULL,
    status                 ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    rejection_reason       TEXT NULL,
    approved_by            BIGINT UNSIGNED NULL,
    approved_at            TIMESTAMP NULL,
    created_at             TIMESTAMP NULL,
    updated_at             TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY payments_transaction_id_unique (transaction_id),
    CONSTRAINT fk_payments_registration FOREIGN KEY (member_registration_id)
        REFERENCES member_registrations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_payments_plan FOREIGN KEY (membership_plan_id)
        REFERENCES membership_plans (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payments_coupon FOREIGN KEY (coupon_id)
        REFERENCES coupons (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_payments_approved_by FOREIGN KEY (approved_by)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE discounts (
    id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    coupon_id              BIGINT UNSIGNED NOT NULL,
    member_registration_id BIGINT UNSIGNED NOT NULL,
    payment_id             BIGINT UNSIGNED NULL,
    amount                 DECIMAL(10,2) NOT NULL,
    used_at                DATETIME NOT NULL,
    created_at             TIMESTAMP NULL,
    updated_at             TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_discounts_coupon FOREIGN KEY (coupon_id)
        REFERENCES coupons (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_discounts_registration FOREIGN KEY (member_registration_id)
        REFERENCES member_registrations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_discounts_payment FOREIGN KEY (payment_id)
        REFERENCES payments (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE expenses (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    branch_id   BIGINT UNSIGNED NULL,
    category    ENUM('rent','utilities','salary','equipment','maintenance','marketing','other') NOT NULL DEFAULT 'other',
    amount      DECIMAL(10,2) NOT NULL,
    date        DATE NOT NULL,
    description TEXT NULL,
    approved_by BIGINT UNSIGNED NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_expenses_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_approved_by FOREIGN KEY (approved_by)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 8. DIET MANAGEMENT
-- =====================================================================

CREATE TABLE diet_plans (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name             VARCHAR(255) NOT NULL,
    description      TEXT NULL,
    duration_in_days INT UNSIGNED NOT NULL,
    type             ENUM('weight_loss','muscle_gain','maintenance','general') NOT NULL DEFAULT 'general',
    calories         INT UNSIGNED NULL,
    status           ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at       TIMESTAMP NULL,
    updated_at       TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE diet_meals (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    diet_plan_id BIGINT UNSIGNED NOT NULL,
    meal_type    ENUM('breakfast','lunch','dinner','snack') NOT NULL,
    name         VARCHAR(255) NOT NULL,
    calories     INT UNSIGNED NULL,
    protein      DECIMAL(6,2) NULL,
    carbs        DECIMAL(6,2) NULL,
    fats         DECIMAL(6,2) NULL,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_diet_meals_plan FOREIGN KEY (diet_plan_id)
        REFERENCES diet_plans (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE member_diets (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id    BIGINT UNSIGNED NOT NULL,
    diet_plan_id BIGINT UNSIGNED NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE NULL,
    status       ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_member_diets_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_member_diets_plan FOREIGN KEY (diet_plan_id)
        REFERENCES diet_plans (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE diet_progress (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_diet_id BIGINT UNSIGNED NOT NULL,
    weight         DECIMAL(5,2) NOT NULL,
    date           DATE NOT NULL,
    notes          TEXT NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_diet_progress_member_diet FOREIGN KEY (member_diet_id)
        REFERENCES member_diets (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 9. WORKOUTS & EXERCISES
-- =====================================================================

CREATE TABLE exercises (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name             VARCHAR(255) NOT NULL,
    category         ENUM('cardio','strength','flexibility','balance') NOT NULL DEFAULT 'strength',
    muscle_group     VARCHAR(255) NULL,
    equipment_needed VARCHAR(255) NULL,
    description      TEXT NULL,
    video_url        VARCHAR(255) NULL,
    created_at       TIMESTAMP NULL,
    updated_at       TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE member_workouts (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id        BIGINT UNSIGNED NOT NULL,
    trainer_id       BIGINT UNSIGNED NULL,
    date             DATE NOT NULL,
    duration_minutes INT UNSIGNED NULL,
    type             ENUM('personal','group','cardio','strength','mixed') NOT NULL DEFAULT 'personal',
    intensity        ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
    calories_burned  INT UNSIGNED NULL,
    status           ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
    notes            TEXT NULL,
    created_at       TIMESTAMP NULL,
    updated_at       TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_member_workouts_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_member_workouts_trainer FOREIGN KEY (trainer_id)
        REFERENCES trainers (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Many-to-many: member_workouts <-> exercises
CREATE TABLE workout_exercises (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_workout_id BIGINT UNSIGNED NOT NULL,
    exercise_id       BIGINT UNSIGNED NOT NULL,
    sets              INT UNSIGNED NULL,
    reps              INT UNSIGNED NULL,
    weight            DECIMAL(6,2) NULL,
    created_at        TIMESTAMP NULL,
    updated_at        TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_workout_exercises_workout FOREIGN KEY (member_workout_id)
        REFERENCES member_workouts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_workout_exercises_exercise FOREIGN KEY (exercise_id)
        REFERENCES exercises (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 10. EQUIPMENT & FACILITIES
-- =====================================================================

CREATE TABLE equipment (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,
    type          VARCHAR(255) NULL,
    branch_id     BIGINT UNSIGNED NULL,
    status        ENUM('operational','maintenance','out_of_service') NOT NULL DEFAULT 'operational',
    purchase_date DATE NULL,
    cost          DECIMAL(10,2) NULL,
    created_at    TIMESTAMP NULL,
    updated_at    TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_equipment_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipment_maintenance (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    equipment_id BIGINT UNSIGNED NOT NULL,
    date         DATE NOT NULL,
    cost         DECIMAL(10,2) NULL,
    technician   VARCHAR(255) NULL,
    notes        TEXT NULL,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_equipment_maintenance_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lockers (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    branch_id  BIGINT UNSIGNED NULL,
    number     VARCHAR(255) NOT NULL,
    size       ENUM('small','medium','large') NOT NULL DEFAULT 'medium',
    status     ENUM('available','occupied','maintenance') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lockers_branch FOREIGN KEY (branch_id)
        REFERENCES branches (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- locker_id intentionally NOT unique (assignment history allowed)
CREATE TABLE member_lockers (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id   BIGINT UNSIGNED NOT NULL,
    locker_id   BIGINT UNSIGNED NOT NULL,
    assigned_at DATETIME NOT NULL,
    status      ENUM('active','released') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX member_lockers_locker_id_index (locker_id),
    CONSTRAINT fk_member_lockers_member FOREIGN KEY (member_id)
        REFERENCES members (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_member_lockers_locker FOREIGN KEY (locker_id)
        REFERENCES lockers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- END OF SCRIPT — 36 tables | database: gym_management_system
-- =====================================================================
