-- ============================================================
-- MySQL 8.0+ version of uniflow_v1 schema
-- Notes on conversions:
-- - UUID PK -> CHAR(36) DEFAULT (UUID())
-- - Native ENUM types -> inline ENUM(...) per column
-- - JSONB -> JSON
-- - TIMESTAMPTZ -> DATETIME
-- - Partial indexes (WHERE ...) are not supported in MySQL, so those
--   indexes are created as regular (non-partial) indexes instead.
-- ============================================================

SET NAMES utf8mb4;

-- ============================================================
-- UNIVERSITIES
-- ============================================================
CREATE TABLE universities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    short_name      VARCHAR(50)  NOT NULL,
    domain          VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_universities_short_name UNIQUE (short_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PROGRAMS
-- ============================================================
CREATE TABLE programs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    university_id   CHAR(36) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50)  NOT NULL,
    duration_years  SMALLINT NOT NULL DEFAULT 4,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_programs_university_code UNIQUE (university_id, code),
    CONSTRAINT fk_programs_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    INDEX idx_programs_university_id (university_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ADMISSION CYCLES
-- ============================================================
CREATE TABLE admission_cycles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    program_id      CHAR(36) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    opens_at        DATETIME NOT NULL,
    closes_at       DATETIME NOT NULL,
    merit_result_at DATETIME,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_cycle_dates CHECK (closes_at > opens_at),
    CONSTRAINT fk_admission_cycles_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    INDEX idx_admission_cycles_program_id (program_id),
    INDEX idx_admission_cycles_active_window (opens_at, closes_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEAT QUOTAS
-- ============================================================
CREATE TABLE seat_quotas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cycle_id        CHAR(36) NOT NULL,
    quota_type      ENUM('general', 'freedom_fighter', 'tribal', 'district_quota', 'physically_challenged') NOT NULL,
    total_seats     INT NOT NULL,
    filled_seats    INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_seat_quotas_cycle_type UNIQUE (cycle_id, quota_type),
    CONSTRAINT chk_seat_quotas_non_negative CHECK (total_seats >= 0 AND filled_seats >= 0),
    CONSTRAINT chk_seat_quotas_not_overfilled CHECK (filled_seats <= total_seats),
    CONSTRAINT fk_seat_quotas_cycle FOREIGN KEY (cycle_id) REFERENCES admission_cycles(id) ON DELETE CASCADE,
    INDEX idx_seat_quotas_cycle_id (cycle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE students (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    full_name       VARCHAR(255) NOT NULL,
    father_name     VARCHAR(255),
    mother_name     VARCHAR(255),
    date_of_birth   DATE,
    nid_or_birth_reg VARCHAR(50),
    password_hash   VARCHAR(255) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_students_phone UNIQUE (phone),
    INDEX idx_students_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE TABLE applications (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id          CHAR(36) NOT NULL,
    cycle_id            CHAR(36) NOT NULL,
    quota_id            CHAR(36) NOT NULL,
    merit_score         NUMERIC(6,3) NOT NULL,
    status              ENUM('pending', 'seat_reserved', 'payment_pending', 'confirmed', 'rejected', 'expired', 'withdrawn') NOT NULL DEFAULT 'pending',
    applied_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at        DATETIME,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_applications_student_cycle UNIQUE (student_id, cycle_id),
    CONSTRAINT chk_merit_score_range CHECK (merit_score >= 0 AND merit_score <= 100),
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    CONSTRAINT fk_applications_cycle FOREIGN KEY (cycle_id) REFERENCES admission_cycles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_applications_quota FOREIGN KEY (quota_id) REFERENCES seat_quotas(id) ON DELETE RESTRICT,
    INDEX idx_applications_cycle_status (cycle_id, status),
    INDEX idx_applications_quota_id (quota_id),
    INDEX idx_applications_student_id (student_id),
    INDEX idx_applications_merit_rank (quota_id, merit_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEAT RESERVATIONS
-- ============================================================
CREATE TABLE seat_reservations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    application_id  CHAR(36) NOT NULL,
    reserved_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME NOT NULL,
    released_at     DATETIME,
    CONSTRAINT uq_seat_reservations_application UNIQUE (application_id),
    CONSTRAINT fk_seat_reservations_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_seat_reservations_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id      CHAR(36) NOT NULL,
    provider            ENUM('bkash', 'nagad', 'rocket', 'sslcommerz', 'ssl_card') NOT NULL,
    provider_txn_id     VARCHAR(100),
    amount              NUMERIC(10,2) NOT NULL,
    status              ENUM('initiated', 'pending', 'verified', 'failed', 'refunded') NOT NULL DEFAULT 'initiated',
    initiated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at         DATETIME,
    raw_callback_payload JSON,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_payments_provider_txn UNIQUE (provider, provider_txn_id),
    CONSTRAINT chk_payments_amount_positive CHECK (amount > 0),
    CONSTRAINT fk_payments_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    INDEX idx_payments_application_id (application_id),
    INDEX idx_payments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ADMIT CARDS
-- ============================================================
CREATE TABLE admit_cards (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    application_id  CHAR(36) NOT NULL,
    pdf_path        VARCHAR(500) NOT NULL,
    roll_number     VARCHAR(50) NOT NULL,
    exam_date       DATE,
    exam_center     VARCHAR(255),
    generated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_admit_cards_application UNIQUE (application_id),
    CONSTRAINT uq_admit_cards_roll_number UNIQUE (roll_number),
    CONSTRAINT fk_admit_cards_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- NOTIFICATION LOGS
-- ============================================================
CREATE TABLE notification_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    application_id  CHAR(36),
    student_id      CHAR(36) NOT NULL,
    channel         ENUM('sms', 'email', 'push') NOT NULL,
    template_key    VARCHAR(100) NOT NULL,
    payload         JSON,
    status          ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
    attempt_count   SMALLINT NOT NULL DEFAULT 0,
    sent_at         DATETIME,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_logs_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
    CONSTRAINT fk_notification_logs_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_notification_logs_student_id (student_id),
    INDEX idx_notification_logs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- OUTBOX EVENTS
-- ============================================================
CREATE TABLE outbox_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_type      VARCHAR(100) NOT NULL,
    aggregate_id    CHAR(36) NOT NULL,
    payload         JSON NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at    DATETIME,
    INDEX idx_outbox_events_unprocessed (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;