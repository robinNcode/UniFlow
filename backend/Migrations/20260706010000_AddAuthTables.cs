using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uniflow.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    permissions = table.Column<string>(type: "json", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "staff_users",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    university_id = table.Column<string>(type: "char(36)", nullable: true),
                    role_id = table.Column<string>(type: "char(36)", nullable: false),
                    full_name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    password_hash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    last_login_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_staff_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_staff_users_universities_university_id",
                        column: x => x.university_id,
                        principalTable: "universities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_staff_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    subject_type = table.Column<string>(type: "enum('student','staff')", nullable: false),
                    subject_id = table.Column<string>(type: "char(36)", nullable: false),
                    token_hash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    jti = table.Column<string>(type: "char(36)", nullable: false),
                    issued_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    revoked_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    replaced_by_token_id = table.Column<string>(type: "char(36)", nullable: true),
                    created_by_ip = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true),
                    user_agent = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_refresh_tokens_refresh_tokens_replaced_by_token_id",
                        column: x => x.replaced_by_token_id,
                        principalTable: "refresh_tokens",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "revoked_access_tokens",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    jti = table.Column<string>(type: "char(36)", nullable: false),
                    subject_type = table.Column<string>(type: "enum('student','staff')", nullable: false),
                    subject_id = table.Column<string>(type: "char(36)", nullable: false),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    revoked_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    reason = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_revoked_access_tokens", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(36)", nullable: false, defaultValueSql: "(UUID())"),
                    subject_type = table.Column<string>(type: "enum('student','staff')", nullable: false),
                    subject_id = table.Column<string>(type: "char(36)", nullable: false),
                    token_hash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    used_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_password_reset_tokens", x => x.id);
                });

            // ---- Indexes ----
            migrationBuilder.CreateIndex(name: "uq_roles_name", table: "roles", column: "name", unique: true);

            migrationBuilder.CreateIndex(name: "uq_staff_users_email", table: "staff_users", column: "email", unique: true);
            migrationBuilder.CreateIndex(name: "idx_staff_users_university_id", table: "staff_users", column: "university_id");
            migrationBuilder.CreateIndex(name: "idx_staff_users_role_id", table: "staff_users", column: "role_id");

            migrationBuilder.CreateIndex(name: "uq_refresh_tokens_jti", table: "refresh_tokens", column: "jti", unique: true);
            migrationBuilder.CreateIndex(name: "uq_refresh_tokens_token_hash", table: "refresh_tokens", column: "token_hash", unique: true);
            migrationBuilder.CreateIndex(name: "idx_refresh_tokens_subject", table: "refresh_tokens", columns: new[] { "subject_type", "subject_id" });
            migrationBuilder.CreateIndex(name: "idx_refresh_tokens_expiry", table: "refresh_tokens", column: "expires_at");
            migrationBuilder.CreateIndex(name: "IX_refresh_tokens_replaced_by_token_id", table: "refresh_tokens", column: "replaced_by_token_id");

            migrationBuilder.CreateIndex(name: "uq_revoked_access_tokens_jti", table: "revoked_access_tokens", column: "jti", unique: true);
            migrationBuilder.CreateIndex(name: "idx_revoked_access_tokens_subject", table: "revoked_access_tokens", columns: new[] { "subject_type", "subject_id" });
            migrationBuilder.CreateIndex(name: "idx_revoked_access_tokens_expiry", table: "revoked_access_tokens", column: "expires_at");

            migrationBuilder.CreateIndex(name: "uq_password_reset_tokens_token_hash", table: "password_reset_tokens", column: "token_hash", unique: true);
            migrationBuilder.CreateIndex(name: "idx_password_reset_tokens_subject", table: "password_reset_tokens", columns: new[] { "subject_type", "subject_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "password_reset_tokens");
            migrationBuilder.DropTable(name: "revoked_access_tokens");
            migrationBuilder.DropTable(name: "refresh_tokens");
            migrationBuilder.DropTable(name: "staff_users");
            migrationBuilder.DropTable(name: "roles");
        }
    }
}
