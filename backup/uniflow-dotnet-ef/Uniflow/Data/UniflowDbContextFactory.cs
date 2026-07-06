using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Uniflow.Data;

/// <summary>
/// Lets `dotnet ef migrations add / database update` work without a
/// running Startup/Program host. Reads connection string from
/// appsettings.json (or falls back to a local default).
/// </summary>
public class UniflowDbContextFactory : IDesignTimeDbContextFactory<UniflowDbContext>
{
    public UniflowDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("UniflowDb")
            ?? "server=localhost;port=3306;database=uniflow;user=root;password=root;";

        var optionsBuilder = new DbContextOptionsBuilder<UniflowDbContext>();
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

        return new UniflowDbContext(optionsBuilder.Options);
    }
}
