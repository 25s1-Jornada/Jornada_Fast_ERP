using System.Linq;
using api_erp.Model;
using api_erp.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace api_erp.EntityConfig
{
    public static class DataSeeder
    {
        private static readonly string[] PerfisPadrao = ["Administrador", "Técnico", "Operador"];
        public const string DefaultAdminEmail = "admin@fast.com";
        public const string DefaultAdminPassword = "fast123";

        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            if (context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
            {
                await context.Database.MigrateAsync();
            }

            await GarantirPerfisAsync(context);
            await GarantirUsuarioAdminAsync(context);
        }

        private static async Task GarantirPerfisAsync(AppDbContext context)
        {
            var perfisExistentes = await context.Perfis
                .Where(p => PerfisPadrao.Contains(p.Nome))
                .Select(p => p.Nome)
                .ToListAsync();

            foreach (var perfil in PerfisPadrao.Except(perfisExistentes))
            {
                context.Perfis.Add(new Perfil { Nome = perfil });
            }

            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }
        }

        private static async Task GarantirUsuarioAdminAsync(AppDbContext context)
        {
            var usuarioAdmin = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == DefaultAdminEmail);
            if (usuarioAdmin != null)
            {
                return;
            }

            var perfilAdmin = await context.Perfis.FirstAsync(p => p.Nome == "Administrador");

            context.Usuarios.Add(new Usuario
            {
                Nome = "Administrador FAST",
                Email = DefaultAdminEmail,
                Senha = PasswordHasher.HashPassword(DefaultAdminPassword),
                PerfilId = perfilAdmin.Id
            });

            await context.SaveChangesAsync();
        }
    }
}
