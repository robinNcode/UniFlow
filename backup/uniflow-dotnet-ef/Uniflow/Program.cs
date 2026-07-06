using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Uniflow.Data;
using Uniflow.Data.Seeders;

// Minimal console entry point: applies pending migrations, then seeds
// sample data. Wire UniflowDbContext into your actual ASP.NET Core
// Program.cs via services.AddDbContext<UniflowDbContext>(...) instead
// if this is going into a web project — this file is just so the
// migration + seeder can be run standalone with `dotnet run`.

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true)
    .Build();

var connectionString = configuration.GetConnectionString("UniflowDb")
    ?? "server=localhost;port=3306;database=uniflow;user=root;password=root;";

var optionsBuilder = new DbContextOptionsBuilder<UniflowDbContext>();
optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

await using var db = new UniflowDbContext(optionsBuilder.Options);

Console.WriteLine("Applying migrations...");
await db.Database.MigrateAsync();

Console.WriteLine("Seeding data...");
await DbSeeder.SeedAsync(db);

Console.WriteLine("Done.");
