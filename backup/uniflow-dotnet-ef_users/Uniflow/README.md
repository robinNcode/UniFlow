# Uniflow — EF Core Migrations & Seeder

.NET 8 / EF Core 8 (Pomelo MySQL provider) scaffold generated from
`uniflow_v1_postgre.sql`, matching the MySQL translation of that schema.

## What's in here

```
Uniflow/
├── Enums/Enums.cs                 # QuotaType, ApplicationStatus, PaymentStatus, PaymentProvider, NotificationChannel, NotificationStatus
├── Entities/                      # POCOs for all 11 tables
│   └── AcademicProgram.cs         # maps to "programs" table (renamed to avoid clashing with C#'s Program class)
├── Data/
│   ├── UniflowDbContext.cs        # DbSets + full Fluent API config (columns, indexes, FKs, check constraints)
│   ├── UniflowDbContextFactory.cs # design-time factory so `dotnet ef` works standalone
│   └── Seeders/DbSeeder.cs        # idempotent sample data seeder
├── Migrations/
│   ├── 20260706000000_InitialCreate.cs         # Up()/Down() creating all tables, FKs, indexes, checks
│   └── UniflowDbContextModelSnapshot.cs        # placeholder — see note below
├── Program.cs                     # standalone runner: migrate + seed
├── appsettings.json                # connection string
└── Uniflow.csproj
```

## Before you run it

1. **Install the .NET 8 SDK** if you don't have it.
2. `cd Uniflow && dotnet restore`
3. Update the connection string in `appsettings.json` to point at your MySQL instance.
4. Create the database first: `CREATE DATABASE uniflow CHARACTER SET utf8mb4;`

## Regenerate the model snapshot (important)

`UniflowDbContextModelSnapshot.cs` is left as a thin placeholder because it
must exactly mirror EF Core's internal model representation — that file is
normally 100% machine-generated and isn't something to hand-write reliably.
The `InitialCreate` migration itself is complete and correct; the snapshot
just needs to be brought in sync once, which EF does for you automatically:

```bash
dotnet ef migrations add InitialCreate --force
```

Running this once (in a project referencing this DbContext) will
regenerate an accurate snapshot from `UniflowDbContext.OnModelCreating()`.
If `20260706000000_InitialCreate.cs` already matches what EF wants to
generate, EF will just overwrite the snapshot without duplicating the
migration; if you'd rather not risk a duplicate, delete the two migration
files first and let `migrations add` regenerate both from scratch — the
Fluent API in `UniflowDbContext` already encodes every column, enum,
index, and check constraint from the original schema.

## Apply the migration

```bash
dotnet ef database update
```

or, to just migrate + seed via the console runner:

```bash
dotnet run
```

## Auth layer (JWT, stateless)

Added on top of the original schema:

- **`roles`**, **`staff_users`** — RBAC for the admin/university side (students already had `password_hash` for their own login).
- **`refresh_tokens`** — persisted (hashed), rotated on every refresh, with reuse detection via `replaced_by_token_id` + `jti` family revocation.
- **`revoked_access_tokens`** — a `jti` denylist, checked only where immediate revocation matters (logout, password change, admin force-logout). Everything else validates the JWT by signature + `exp` alone — no DB hit.
- **`password_reset_tokens`** — standard hashed, single-use, expiring reset flow.

`subject_type` + `subject_id` (not a real FK) lets these four tables serve both `students` and `staff_users`, since MySQL can't FK one column to two tables — that pairing is enforced in application code (`Uniflow.Auth.JwtTokenService`).

`Auth/JwtTokenService.cs` is a reference implementation: `IssueTokensAsync`, `RefreshAsync` (rotation + reuse detection), `RevokeFamilyAsync`, `RevokeAccessTokenAsync`, `IsAccessTokenRevokedAsync`. Wire it up with your actual JWT signing key/issuer/audience (e.g. from configuration, not hardcoded) before using it.

`AuthSeeder.cs` seeds four roles (`super_admin`, `admission_officer`, `finance_officer`, `support_staff`) and one platform-wide super admin (`admin@uniflow.local` / `ChangeMe123!` — **rotate this immediately**, it's a placeholder SHA-256 hash, not a real password hasher).

Migration order matters: `InitialCreate` then `AddAuthTables`. Run `dotnet ef database update` to apply both in sequence.

## Notes / deviations from the SQL

- **UUID**: `CHAR(36)` with `DEFAULT (UUID())`, matching the MySQL DDL. EF entities use `Guid` — Pomelo converts transparently.
- **ENUM columns**: mapped with `.HasConversion<string>()` plus `HasColumnType("enum(...)")` so the column stays a real MySQL `ENUM`, not an int.
- **JSON columns** (`raw_callback_payload`, `payload`, outbox `payload`): mapped as `string` holding raw JSON. Swap in `System.Text.Json.JsonDocument` or a strongly-typed DTO with a value converter if you want typed access.
- **Partial indexes** from Postgres (`WHERE is_active = TRUE`, `WHERE released_at IS NULL`, etc.) aren't supported in MySQL, so they're plain indexes here — same as the MySQL DDL you already have.
- **CHECK constraints** require MySQL 8.0.16+; EF Core emits them via `HasCheckConstraint` in `OnModelCreating`.
- The seeder's password hashing is a **placeholder** (SHA-256, not salted) — swap in ASP.NET Core Identity's `PasswordHasher<T>` or `BCrypt.Net-Next` before using this anywhere real.
- `AcademicProgram` corresponds 1:1 to the `programs` table; it's just renamed in C# to avoid colliding with the top-level `Program` class name.

## Not verified by compiling

This container doesn't have network access to nuget.org, so I wasn't able
to run `dotnet restore && dotnet build` here to confirm it compiles clean.
The API usage matches EF Core 8 / Pomelo 8.x conventions, but please run a
build locally before relying on it — happy to fix anything that comes up.
