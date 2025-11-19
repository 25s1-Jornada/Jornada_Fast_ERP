
using api_erp.EntityConfig;
using api_erp.Repositories.Implementations;
using api_erp.Repositories.Implementations.OSImplementations;
using api_erp.Repositories.Interfaces;
using api_erp.Repositories.Interfaces.OSInterfaces;
using api_erp.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace api_erp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var jwtSettings = builder.Configuration.GetSection("Jwt");
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? string.Empty)),
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            });

            builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
            builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
            builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
            builder.Services.AddScoped<IEnderecoRepository, EnderecoRepository>();
            builder.Services.AddScoped<IPerfilRepository, PerfilRepository>();
            //builder.Services.AddScoped<IArmarioRepository, ArmarioRepository>();
            builder.Services.AddScoped<IEstoqueRepository, EstoqueRepository>();
            builder.Services.AddScoped<IMovimentacaoEstoqueRepository, MovimentacaoEstoqueRepository>();
            builder.Services.AddScoped<IPecaQrCodeRepository, PecaQrCodeRepository>();
            builder.Services.AddScoped<IDescricaoDoChamadoRepository, DescricaoDoChamadoRepository>();
            builder.Services.AddScoped<ICustoRepository, CustoRepository>();
            builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
            builder.Services.AddScoped<IConfirmacaoClienteRepository, ConfirmacaoClienteRepository>();
            builder.Services.AddScoped<IImagemRepository, ImagemRepository>();
            builder.Services.AddScoped<IOrdemServicoRepository, OrdemServicoRepository>();
            builder.Services.AddScoped<IDeslocamentoRepository, DeslocamentoRepository>();
            builder.Services.AddScoped<IHoraTrabalhadaRepository, HoraTrabalhadaRepository>();
            builder.Services.AddScoped<IKMRepository, KMRepository>();
            builder.Services.AddScoped<IDescricaoDefeitoRepository, DescricaoDefeitoRepository>();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            var secondConnection = builder.Configuration.GetConnectionString("SecondConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    options.UseInMemoryDatabase("ApiErpDev");
                }
                else if (connectionString.Contains("Data Source=", StringComparison.OrdinalIgnoreCase))
                {
                    options.UseSqlite(connectionString);
                }
                else
                {
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
                }
            });


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("cors", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            var app = builder.Build();


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Ensure databases are created and up-to-date (apply EF Core migrations)
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    var mainDb = scope.ServiceProvider.GetRequiredService<api_erp.EntityConfig.AppDbContext>();
                    mainDb.Database.Migrate();

                    // Perfis padrão
                    var perfisPadrao = new[] { "Administrador", "Tecnico", "Cliente" };
                    foreach (var nomePerfil in perfisPadrao)
                    {
                        if (!mainDb.Perfis.Any(p => p.Nome == nomePerfil))
                        {
                            mainDb.Perfis.Add(new api_erp.Model.Perfil { Nome = nomePerfil });
                        }
                    }

                    mainDb.SaveChanges();

                    var defaultEmail = "usuario@teste.com";
                    var defaultUser = mainDb.Usuarios.FirstOrDefault(u => u.Email == defaultEmail);
                    var perfilAdminId = mainDb.Perfis.FirstOrDefault(p => p.Nome == "Administrador")?.Id;
                    if (defaultUser == null)
                    {
                        mainDb.Usuarios.Add(new api_erp.Model.Usuario
                        {
                            Nome = "User",
                            Email = defaultEmail,
                            Senha = SecurityHelper.HashPassword("123"),
                            PerfilId = perfilAdminId
                        });
                    }
                    else
                    {
                        if (defaultUser.Senha.Length != 64) // se por acaso a senha ficou salva em texto puro, re-hash
                        {
                            defaultUser.Senha = SecurityHelper.HashPassword("123");
                        }

                        if (perfilAdminId.HasValue && defaultUser.PerfilId != perfilAdminId)
                        {
                            defaultUser.PerfilId = perfilAdminId;
                        }

                        mainDb.Usuarios.Update(defaultUser);
                    }

                    mainDb.SaveChanges();
                }
                catch { }

             
            }

            app.UseCors("cors");

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
            
        }
    }
}
