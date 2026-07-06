using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uniflow.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "universities",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    short_name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    domain = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_universities", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    full_name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    father_name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    mother_name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    nid_or_birth_reg = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    password_hash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_students", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "outbox_events",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    event_type = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    aggregate_id = table.Column<string>(type: "char(36)", nullable: false),
                    payload = table.Column<string>(type: "json", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    processed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_outbox_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "programs",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    university_id = table.Column<string>(type: "char(36)", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    duration_years = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)4),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_programs", x => x.id);
                    table.ForeignKey(
                        name: "FK_programs_universities_university_id",
                        column: x => x.university_id,
                        principalTable: "universities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "admission_cycles",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    program_id = table.Column<string>(type: "char(36)", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    opens_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    closes_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    merit_result_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admission_cycles", x => x.id);
                    table.CheckConstraint("chk_cycle_dates", "closes_at > opens_at");
                    table.ForeignKey(
                        name: "FK_admission_cycles_programs_program_id",
                        column: x => x.program_id,
                        principalTable: "programs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seat_quotas",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    cycle_id = table.Column<string>(type: "char(36)", nullable: false),
                    quota_type = table.Column<string>(type: "enum('general','freedom_fighter','tribal','district_quota','physically_challenged')", nullable: false),
                    total_seats = table.Column<int>(type: "int", nullable: false),
                    filled_seats = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seat_quotas", x => x.id);
                    table.CheckConstraint("chk_seat_quotas_non_negative", "total_seats >= 0 AND filled_seats >= 0");
                    table.CheckConstraint("chk_seat_quotas_not_overfilled", "filled_seats <= total_seats");
                    table.ForeignKey(
                        name: "FK_seat_quotas_admission_cycles_cycle_id",
                        column: x => x.cycle_id,
                        principalTable: "admission_cycles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "applications",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    student_id = table.Column<string>(type: "char(36)", nullable: false),
                    cycle_id = table.Column<string>(type: "char(36)", nullable: false),
                    quota_id = table.Column<string>(type: "char(36)", nullable: false),
                    merit_score = table.Column<decimal>(type: "numeric(6,3)", nullable: false),
                    status = table.Column<string>(type: "enum('pending','seat_reserved','payment_pending','confirmed','rejected','expired','withdrawn')", nullable: false, defaultValue: "pending"),
                    applied_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    confirmed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_applications", x => x.id);
                    table.CheckConstraint("chk_merit_score_range", "merit_score >= 0 AND merit_score <= 100");
                    table.ForeignKey(
                        name: "FK_applications_students_student_id",
                        column: x => x.student_id,
                        principalTable: "students",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_applications_admission_cycles_cycle_id",
                        column: x => x.cycle_id,
                        principalTable: "admission_cycles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_applications_seat_quotas_quota_id",
                        column: x => x.quota_id,
                        principalTable: "seat_quotas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "seat_reservations",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    application_id = table.Column<string>(type: "char(36)", nullable: false),
                    reserved_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    released_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seat_reservations", x => x.id);
                    table.ForeignKey(
                        name: "FK_seat_reservations_applications_application_id",
                        column: x => x.application_id,
                        principalTable: "applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    application_id = table.Column<string>(type: "char(36)", nullable: false),
                    provider = table.Column<string>(type: "enum('bkash','nagad','rocket','sslcommerz','ssl_card')", nullable: false),
                    provider_txn_id = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    status = table.Column<string>(type: "enum('initiated','pending','verified','failed','refunded')", nullable: false, defaultValue: "initiated"),
                    initiated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    verified_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    raw_callback_payload = table.Column<string>(type: "json", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.id);
                    table.CheckConstraint("chk_payments_amount_positive", "amount > 0");
                    table.ForeignKey(
                        name: "FK_payments_applications_application_id",
                        column: x => x.application_id,
                        principalTable: "applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "admit_cards",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    application_id = table.Column<string>(type: "char(36)", nullable: false),
                    pdf_path = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    roll_number = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    exam_date = table.Column<DateOnly>(type: "date", nullable: true),
                    exam_center = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    generated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admit_cards", x => x.id);
                    table.ForeignKey(
                        name: "FK_admit_cards_applications_application_id",
                        column: x => x.application_id,
                        principalTable: "applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notification_logs",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    application_id = table.Column<string>(type: "char(36)", nullable: true),
                    student_id = table.Column<string>(type: "char(36)", nullable: false),
                    channel = table.Column<string>(type: "enum('sms','email','push')", nullable: false),
                    template_key = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    payload = table.Column<string>(type: "json", nullable: true),
                    status = table.Column<string>(type: "enum('pending','sent','failed')", nullable: false, defaultValue: "pending"),
                    attempt_count = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    sent_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_notification_logs_applications_application_id",
                        column: x => x.application_id,
                        principalTable: "applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_notification_logs_students_student_id",
                        column: x => x.student_id,
                        principalTable: "students",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            // ---- Indexes ----
            migrationBuilder.CreateIndex(name: "uq_universities_short_name", table: "universities", column: "short_name", unique: true);

            migrationBuilder.CreateIndex(name: "idx_programs_university_id", table: "programs", column: "university_id");
            migrationBuilder.CreateIndex(name: "uq_programs_university_code", table: "programs", columns: new[] { "university_id", "code" }, unique: true);

            migrationBuilder.CreateIndex(name: "idx_admission_cycles_program_id", table: "admission_cycles", column: "program_id");
            migrationBuilder.CreateIndex(name: "idx_admission_cycles_active_window", table: "admission_cycles", columns: new[] { "opens_at", "closes_at" });

            migrationBuilder.CreateIndex(name: "idx_seat_quotas_cycle_id", table: "seat_quotas", column: "cycle_id");
            migrationBuilder.CreateIndex(name: "uq_seat_quotas_cycle_type", table: "seat_quotas", columns: new[] { "cycle_id", "quota_type" }, unique: true);

            migrationBuilder.CreateIndex(name: "uq_students_phone", table: "students", column: "phone", unique: true);
            migrationBuilder.CreateIndex(name: "idx_students_email", table: "students", column: "email");

            migrationBuilder.CreateIndex(name: "uq_applications_student_cycle", table: "applications", columns: new[] { "student_id", "cycle_id" }, unique: true);
            migrationBuilder.CreateIndex(name: "idx_applications_cycle_status", table: "applications", columns: new[] { "cycle_id", "status" });
            migrationBuilder.CreateIndex(name: "idx_applications_quota_id", table: "applications", column: "quota_id");
            migrationBuilder.CreateIndex(name: "idx_applications_student_id", table: "applications", column: "student_id");
            migrationBuilder.CreateIndex(name: "idx_applications_merit_rank", table: "applications", columns: new[] { "quota_id", "merit_score" });

            migrationBuilder.CreateIndex(name: "uq_seat_reservations_application", table: "seat_reservations", column: "application_id", unique: true);
            migrationBuilder.CreateIndex(name: "idx_seat_reservations_expiry", table: "seat_reservations", column: "expires_at");

            migrationBuilder.CreateIndex(name: "uq_payments_provider_txn", table: "payments", columns: new[] { "provider", "provider_txn_id" }, unique: true);
            migrationBuilder.CreateIndex(name: "idx_payments_application_id", table: "payments", column: "application_id");
            migrationBuilder.CreateIndex(name: "idx_payments_status", table: "payments", column: "status");

            migrationBuilder.CreateIndex(name: "uq_admit_cards_application", table: "admit_cards", column: "application_id", unique: true);
            migrationBuilder.CreateIndex(name: "uq_admit_cards_roll_number", table: "admit_cards", column: "roll_number", unique: true);

            migrationBuilder.CreateIndex(name: "idx_notification_logs_student_id", table: "notification_logs", column: "student_id");
            migrationBuilder.CreateIndex(name: "idx_notification_logs_status", table: "notification_logs", column: "status");
            migrationBuilder.CreateIndex(name: "idx_notification_logs_application_id", table: "notification_logs", column: "application_id");

            migrationBuilder.CreateIndex(name: "idx_outbox_events_unprocessed", table: "outbox_events", column: "created_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "notification_logs");
            migrationBuilder.DropTable(name: "admit_cards");
            migrationBuilder.DropTable(name: "payments");
            migrationBuilder.DropTable(name: "seat_reservations");
            migrationBuilder.DropTable(name: "applications");
            migrationBuilder.DropTable(name: "seat_quotas");
            migrationBuilder.DropTable(name: "admission_cycles");
            migrationBuilder.DropTable(name: "programs");
            migrationBuilder.DropTable(name: "outbox_events");
            migrationBuilder.DropTable(name: "students");
            migrationBuilder.DropTable(name: "universities");
        }
    }
}
