-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- Using native Postgres ENUM over VARCHAR + CHECK for two reasons:
-- 1. Storage efficiency (4 bytes vs variable-length string)
-- 2. Schema-level enforcement visible in \d, not buried in app code
-- Trade-off: adding a new enum value requires ALTER TYPE ... ADD VALUE,
-- which cannot run inside a transaction in older Postgres versions
-- (fixed in PG 12+). Acceptable given this is a slow-changing domain.
-- ============================================================
CREATE TYPE quota_type AS ENUM ('general', 'freedom_fighter', 'tribal', 'district_quota', 'physically_challenged');
CREATE TYPE application_status AS ENUM ('pending', 'seat_reserved', 'payment_pending', 'confirmed', 'rejected', 'expired', 'withdrawn');
CREATE TYPE payment_status AS ENUM ('initiated', 'pending', 'verified', 'failed', 'refunded');
CREATE TYPE payment_provider AS ENUM ('bkash', 'nagad', 'rocket', 'sslcommerz', 'ssl_card');
CREATE TYPE notification_channel AS ENUM ('sms', 'email', 'push');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

-- ============================================================
-- UNIVERSITIES
-- ============================================================
CREATE TABLE universities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    short_name      VARCHAR(50)  NOT NULL,
    domain          VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_universities_short_name UNIQUE (short_name)
);

-- ============================================================
-- PROGRAMS (e.g., CSE, EEE under a university)
-- ============================================================
CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id   UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50)  NOT NULL,
    duration_years  SMALLINT NOT NULL DEFAULT 4,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_programs_university_code UNIQUE (university_id, code)
);

CREATE INDEX idx_programs_university_id ON programs(university_id);

-- ============================================================
-- ADMISSION CYCLES
-- One cycle = one admission window for a program (e.g., "CSE 2026 Fall")
-- ============================================================
CREATE TABLE admission_cycles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    opens_at        TIMESTAMPTZ NOT NULL,
    closes_at       TIMESTAMPTZ NOT NULL,
    merit_result_at TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_cycle_dates CHECK (closes_at > opens_at)
);

CREATE INDEX idx_admission_cycles_program_id ON admission_cycles(program_id);
CREATE INDEX idx_admission_cycles_active_window ON admission_cycles(opens_at, closes_at) WHERE is_active = TRUE;

-- ============================================================
-- SEAT QUOTAS
-- filled_seats is mutated only inside a `SELECT ... FOR UPDATE`
-- transaction from the application layer — this table is the
-- single contended resource in the whole system.
-- ============================================================
CREATE TABLE seat_quotas (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id        UUID NOT NULL REFERENCES admission_cycles(id) ON DELETE CASCADE,
    quota_type      quota_type NOT NULL,
    total_seats     INTEGER NOT NULL,
    filled_seats    INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_seat_quotas_cycle_type UNIQUE (cycle_id, quota_type),
    CONSTRAINT chk_seat_quotas_non_negative CHECK (total_seats >= 0 AND filled_seats >= 0),
    CONSTRAINT chk_seat_quotas_not_overfilled CHECK (filled_seats <= total_seats)
);

CREATE INDEX idx_seat_quotas_cycle_id ON seat_quotas(cycle_id);

-- ============================================================
-- STUDENTS
-- Phone is the primary identity anchor (BD-context: most reliable
-- unique field pre-account-creation). Stored normalized — E.164
-- format enforcement happens at the application layer, not DB,
-- since regex CHECK constraints on phone formats are brittle
-- against edge cases (e.g., legacy 10-digit vs 11-digit numbers).
-- ============================================================
CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    full_name       VARCHAR(255) NOT NULL,
    father_name     VARCHAR(255),
    mother_name     VARCHAR(255),
    date_of_birth   DATE,
    nid_or_birth_reg VARCHAR(50),
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_students_phone UNIQUE (phone)
);

CREATE INDEX idx_students_email ON students(email) WHERE email IS NOT NULL;

-- ============================================================
-- APPLICATIONS
-- status is the state machine driving the whole workflow:
-- pending -> seat_reserved -> payment_pending -> confirmed
--                          -> expired (reservation timeout)
--          -> rejected / withdrawn (terminal, from any pre-confirmed state)
-- ============================================================
CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id          UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    cycle_id            UUID NOT NULL REFERENCES admission_cycles(id) ON DELETE RESTRICT,
    quota_id            UUID NOT NULL REFERENCES seat_quotas(id) ON DELETE RESTRICT,
    merit_score         NUMERIC(6,3) NOT NULL,
    status              application_status NOT NULL DEFAULT 'pending',
    applied_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_applications_student_cycle UNIQUE (student_id, cycle_id),
    CONSTRAINT chk_merit_score_range CHECK (merit_score >= 0 AND merit_score <= 100)
);

CREATE INDEX idx_applications_cycle_status ON applications(cycle_id, status);
CREATE INDEX idx_applications_quota_id ON applications(quota_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
-- Supports live merit list fallback query / rebuild-from-source-of-truth
CREATE INDEX idx_applications_merit_rank ON applications(quota_id, merit_score DESC);

-- ============================================================
-- SEAT RESERVATIONS
-- Temporary hold, mirrors e-commerce cart-reservation pattern.
-- Expired rows are cleared by a Hangfire recurring job, not
-- deleted synchronously — deletion happens alongside the
-- quota.filled_seats decrement in the same transaction.
-- ============================================================
CREATE TABLE seat_reservations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    reserved_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL,
    released_at     TIMESTAMPTZ,
    CONSTRAINT uq_seat_reservations_application UNIQUE (application_id)
);

CREATE INDEX idx_seat_reservations_expiry ON seat_reservations(expires_at) WHERE released_at IS NULL;

-- ============================================================
-- PAYMENTS
-- provider_txn_id UNIQUE constraint is the idempotency guard —
-- duplicate webhook callbacks from the MFS provider hit this
-- constraint and are handled as no-ops at the application layer,
-- not as errors.
-- ============================================================
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id      UUID NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
    provider            payment_provider NOT NULL,
    provider_txn_id     VARCHAR(100),
    amount              NUMERIC(10,2) NOT NULL,
    status              payment_status NOT NULL DEFAULT 'initiated',
    initiated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at         TIMESTAMPTZ,
    raw_callback_payload JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_payments_provider_txn UNIQUE (provider, provider_txn_id),
    CONSTRAINT chk_payments_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payments_application_id ON payments(application_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- ADMIT CARDS
-- ============================================================
CREATE TABLE admit_cards (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    pdf_path        VARCHAR(500) NOT NULL,
    roll_number     VARCHAR(50) NOT NULL,
    exam_date       DATE,
    exam_center     VARCHAR(255),
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_admit_cards_application UNIQUE (application_id),
    CONSTRAINT uq_admit_cards_roll_number UNIQUE (roll_number)
);

-- ============================================================
-- NOTIFICATION LOGS
-- ============================================================
CREATE TABLE notification_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID REFERENCES applications(id) ON DELETE SET NULL,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    channel         notification_channel NOT NULL,
    template_key    VARCHAR(100) NOT NULL,
    payload         JSONB,
    status          notification_status NOT NULL DEFAULT 'pending',
    attempt_count   SMALLINT NOT NULL DEFAULT 0,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_logs_student_id ON notification_logs(student_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status) WHERE status = 'pending';

-- ============================================================
-- OUTBOX EVENTS
-- Transactional outbox pattern: written in the SAME transaction
-- as the domain state change (e.g., application confirmed),
-- polled by a background worker to trigger admit card generation
-- and notifications — avoids dual-write inconsistency between
-- the DB commit and downstream side effects.
-- ============================================================
CREATE TABLE outbox_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      VARCHAR(100) NOT NULL,
    aggregate_id    UUID NOT NULL,
    payload         JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at    TIMESTAMPTZ
);

CREATE INDEX idx_outbox_events_unprocessed ON outbox_events(created_at) WHERE processed_at IS NULL;