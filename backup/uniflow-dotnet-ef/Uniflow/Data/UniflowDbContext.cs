using Microsoft.EntityFrameworkCore;
using Uniflow.Entities;

namespace Uniflow.Data;

public class UniflowDbContext : DbContext
{
    public UniflowDbContext(DbContextOptions<UniflowDbContext> options) : base(options) { }

    public DbSet<University> Universities => Set<University>();
    public DbSet<AcademicProgram> Programs => Set<AcademicProgram>();
    public DbSet<AdmissionCycle> AdmissionCycles => Set<AdmissionCycle>();
    public DbSet<SeatQuota> SeatQuotas => Set<SeatQuota>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<SeatReservation> SeatReservations => Set<SeatReservation>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<AdmitCard> AdmitCards => Set<AdmitCard>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();
    public DbSet<OutboxEvent> OutboxEvents => Set<OutboxEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ============================================================
        // UNIVERSITIES
        // ============================================================
        modelBuilder.Entity<University>(e =>
        {
            e.ToTable("universities");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            e.Property(x => x.ShortName).HasColumnName("short_name").HasMaxLength(50).IsRequired();
            e.Property(x => x.Domain).HasColumnName("domain").HasMaxLength(100);
            e.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();
            e.HasIndex(x => x.ShortName).IsUnique().HasDatabaseName("uq_universities_short_name");
        });

        // ============================================================
        // PROGRAMS (AcademicProgram)
        // ============================================================
        modelBuilder.Entity<AcademicProgram>(e =>
        {
            e.ToTable("programs");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.UniversityId).HasColumnName("university_id").HasColumnType("char(36)");
            e.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            e.Property(x => x.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
            e.Property(x => x.DurationYears).HasColumnName("duration_years").HasDefaultValue((short)4);
            e.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => x.UniversityId).HasDatabaseName("idx_programs_university_id");
            e.HasIndex(x => new { x.UniversityId, x.Code }).IsUnique().HasDatabaseName("uq_programs_university_code");

            e.HasOne(x => x.University)
                .WithMany(u => u.Programs)
                .HasForeignKey(x => x.UniversityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // ADMISSION CYCLES
        // ============================================================
        modelBuilder.Entity<AdmissionCycle>(e =>
        {
            e.ToTable("admission_cycles", t => t.HasCheckConstraint("chk_cycle_dates", "closes_at > opens_at"));
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.ProgramId).HasColumnName("program_id").HasColumnType("char(36)");
            e.Property(x => x.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            e.Property(x => x.OpensAt).HasColumnName("opens_at").IsRequired();
            e.Property(x => x.ClosesAt).HasColumnName("closes_at").IsRequired();
            e.Property(x => x.MeritResultAt).HasColumnName("merit_result_at");
            e.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => x.ProgramId).HasDatabaseName("idx_admission_cycles_program_id");
            e.HasIndex(x => new { x.OpensAt, x.ClosesAt }).HasDatabaseName("idx_admission_cycles_active_window");

            e.HasOne(x => x.Program)
                .WithMany(p => p.AdmissionCycles)
                .HasForeignKey(x => x.ProgramId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // SEAT QUOTAS
        // ============================================================
        modelBuilder.Entity<SeatQuota>(e =>
        {
            e.ToTable("seat_quotas", t =>
            {
                t.HasCheckConstraint("chk_seat_quotas_non_negative", "total_seats >= 0 AND filled_seats >= 0");
                t.HasCheckConstraint("chk_seat_quotas_not_overfilled", "filled_seats <= total_seats");
            });
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.CycleId).HasColumnName("cycle_id").HasColumnType("char(36)");
            e.Property(x => x.QuotaType)
                .HasColumnName("quota_type")
                .HasConversion<string>()
                .HasColumnType("enum('general','freedom_fighter','tribal','district_quota','physically_challenged')")
                .IsRequired();
            e.Property(x => x.TotalSeats).HasColumnName("total_seats").IsRequired();
            e.Property(x => x.FilledSeats).HasColumnName("filled_seats").HasDefaultValue(0);
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => x.CycleId).HasDatabaseName("idx_seat_quotas_cycle_id");
            e.HasIndex(x => new { x.CycleId, x.QuotaType }).IsUnique().HasDatabaseName("uq_seat_quotas_cycle_type");

            e.HasOne(x => x.Cycle)
                .WithMany(c => c.SeatQuotas)
                .HasForeignKey(x => x.CycleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // STUDENTS
        // ============================================================
        modelBuilder.Entity<Student>(e =>
        {
            e.ToTable("students");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20).IsRequired();
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(255);
            e.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(255).IsRequired();
            e.Property(x => x.FatherName).HasColumnName("father_name").HasMaxLength(255);
            e.Property(x => x.MotherName).HasColumnName("mother_name").HasMaxLength(255);
            e.Property(x => x.DateOfBirth).HasColumnName("date_of_birth").HasColumnType("date");
            e.Property(x => x.NidOrBirthReg).HasColumnName("nid_or_birth_reg").HasMaxLength(50);
            e.Property(x => x.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => x.Phone).IsUnique().HasDatabaseName("uq_students_phone");
            e.HasIndex(x => x.Email).HasDatabaseName("idx_students_email");
        });

        // ============================================================
        // APPLICATIONS
        // ============================================================
        modelBuilder.Entity<Application>(e =>
        {
            e.ToTable("applications", t => t.HasCheckConstraint("chk_merit_score_range", "merit_score >= 0 AND merit_score <= 100"));
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.StudentId).HasColumnName("student_id").HasColumnType("char(36)");
            e.Property(x => x.CycleId).HasColumnName("cycle_id").HasColumnType("char(36)");
            e.Property(x => x.QuotaId).HasColumnName("quota_id").HasColumnType("char(36)");
            e.Property(x => x.MeritScore).HasColumnName("merit_score").HasColumnType("numeric(6,3)").IsRequired();
            e.Property(x => x.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasColumnType("enum('pending','seat_reserved','payment_pending','confirmed','rejected','expired','withdrawn')")
                .HasDefaultValue(Enums.ApplicationStatus.pending);
            e.Property(x => x.AppliedAt).HasColumnName("applied_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.ConfirmedAt).HasColumnName("confirmed_at");
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => new { x.StudentId, x.CycleId }).IsUnique().HasDatabaseName("uq_applications_student_cycle");
            e.HasIndex(x => new { x.CycleId, x.Status }).HasDatabaseName("idx_applications_cycle_status");
            e.HasIndex(x => x.QuotaId).HasDatabaseName("idx_applications_quota_id");
            e.HasIndex(x => x.StudentId).HasDatabaseName("idx_applications_student_id");
            e.HasIndex(x => new { x.QuotaId, x.MeritScore }).HasDatabaseName("idx_applications_merit_rank");

            e.HasOne(x => x.Student)
                .WithMany(s => s.Applications)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Cycle)
                .WithMany(c => c.Applications)
                .HasForeignKey(x => x.CycleId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Quota)
                .WithMany(q => q.Applications)
                .HasForeignKey(x => x.QuotaId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ============================================================
        // SEAT RESERVATIONS
        // ============================================================
        modelBuilder.Entity<SeatReservation>(e =>
        {
            e.ToTable("seat_reservations");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("char(36)");
            e.Property(x => x.ReservedAt).HasColumnName("reserved_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.ExpiresAt).HasColumnName("expires_at").IsRequired();
            e.Property(x => x.ReleasedAt).HasColumnName("released_at");

            e.HasIndex(x => x.ApplicationId).IsUnique().HasDatabaseName("uq_seat_reservations_application");
            e.HasIndex(x => x.ExpiresAt).HasDatabaseName("idx_seat_reservations_expiry");

            e.HasOne(x => x.Application)
                .WithOne(a => a.SeatReservation)
                .HasForeignKey<SeatReservation>(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // PAYMENTS
        // ============================================================
        modelBuilder.Entity<Payment>(e =>
        {
            e.ToTable("payments", t => t.HasCheckConstraint("chk_payments_amount_positive", "amount > 0"));
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("char(36)");
            e.Property(x => x.Provider)
                .HasColumnName("provider")
                .HasConversion<string>()
                .HasColumnType("enum('bkash','nagad','rocket','sslcommerz','ssl_card')")
                .IsRequired();
            e.Property(x => x.ProviderTxnId).HasColumnName("provider_txn_id").HasMaxLength(100);
            e.Property(x => x.Amount).HasColumnName("amount").HasColumnType("numeric(10,2)").IsRequired();
            e.Property(x => x.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasColumnType("enum('initiated','pending','verified','failed','refunded')")
                .HasDefaultValue(Enums.PaymentStatus.initiated);
            e.Property(x => x.InitiatedAt).HasColumnName("initiated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.VerifiedAt).HasColumnName("verified_at");
            e.Property(x => x.RawCallbackPayload).HasColumnName("raw_callback_payload").HasColumnType("json");
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => new { x.Provider, x.ProviderTxnId }).IsUnique().HasDatabaseName("uq_payments_provider_txn");
            e.HasIndex(x => x.ApplicationId).HasDatabaseName("idx_payments_application_id");
            e.HasIndex(x => x.Status).HasDatabaseName("idx_payments_status");

            e.HasOne(x => x.Application)
                .WithMany(a => a.Payments)
                .HasForeignKey(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ============================================================
        // ADMIT CARDS
        // ============================================================
        modelBuilder.Entity<AdmitCard>(e =>
        {
            e.ToTable("admit_cards");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("char(36)");
            e.Property(x => x.PdfPath).HasColumnName("pdf_path").HasMaxLength(500).IsRequired();
            e.Property(x => x.RollNumber).HasColumnName("roll_number").HasMaxLength(50).IsRequired();
            e.Property(x => x.ExamDate).HasColumnName("exam_date").HasColumnType("date");
            e.Property(x => x.ExamCenter).HasColumnName("exam_center").HasMaxLength(255);
            e.Property(x => x.GeneratedAt).HasColumnName("generated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            e.HasIndex(x => x.ApplicationId).IsUnique().HasDatabaseName("uq_admit_cards_application");
            e.HasIndex(x => x.RollNumber).IsUnique().HasDatabaseName("uq_admit_cards_roll_number");

            e.HasOne(x => x.Application)
                .WithOne(a => a.AdmitCard)
                .HasForeignKey<AdmitCard>(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // NOTIFICATION LOGS
        // ============================================================
        modelBuilder.Entity<NotificationLog>(e =>
        {
            e.ToTable("notification_logs");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("char(36)");
            e.Property(x => x.StudentId).HasColumnName("student_id").HasColumnType("char(36)");
            e.Property(x => x.Channel)
                .HasColumnName("channel")
                .HasConversion<string>()
                .HasColumnType("enum('sms','email','push')")
                .IsRequired();
            e.Property(x => x.TemplateKey).HasColumnName("template_key").HasMaxLength(100).IsRequired();
            e.Property(x => x.Payload).HasColumnName("payload").HasColumnType("json");
            e.Property(x => x.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasColumnType("enum('pending','sent','failed')")
                .HasDefaultValue(Enums.NotificationStatus.pending);
            e.Property(x => x.AttemptCount).HasColumnName("attempt_count").HasDefaultValue((short)0);
            e.Property(x => x.SentAt).HasColumnName("sent_at");
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            e.HasIndex(x => x.StudentId).HasDatabaseName("idx_notification_logs_student_id");
            e.HasIndex(x => x.Status).HasDatabaseName("idx_notification_logs_status");

            e.HasOne(x => x.Application)
                .WithMany(a => a.NotificationLogs)
                .HasForeignKey(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(x => x.Student)
                .WithMany(s => s.NotificationLogs)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================
        // OUTBOX EVENTS
        // ============================================================
        modelBuilder.Entity<OutboxEvent>(e =>
        {
            e.ToTable("outbox_events");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").HasColumnType("char(36)").HasDefaultValueSql("(UUID())");
            e.Property(x => x.EventType).HasColumnName("event_type").HasMaxLength(100).IsRequired();
            e.Property(x => x.AggregateId).HasColumnName("aggregate_id").HasColumnType("char(36)").IsRequired();
            e.Property(x => x.Payload).HasColumnName("payload").HasColumnType("json").IsRequired();
            e.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(x => x.ProcessedAt).HasColumnName("processed_at");

            e.HasIndex(x => x.CreatedAt).HasDatabaseName("idx_outbox_events_unprocessed");
        });
    }
}
