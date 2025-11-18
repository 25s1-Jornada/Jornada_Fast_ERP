
using System.Text;
using api_erp.Configurations;
using api_erp.EntityConfig;
using api_erp.Repositories.Implementations;
using api_erp.Repositories.Implementations.OSImplementations;
using api_erp.Repositories.Interfaces;
using api_erp.Repositories.Interfaces.OSInterfaces;
using api_erp.Services.Implementations;
using api_erp.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api_erp
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

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
            builder.Services.AddScoped<ITokenService, JwtTokenService>();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            var jwtSection = builder.Configuration.GetSection("Jwt");
            var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new InvalidOperationException("Configuração JWT não encontrada.");

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
            builder.Services.Configure<JwtSettings>(jwtSection);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });

            builder.Services.AddAuthorization();

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

            await DataSeeder.SeedAsync(app.Services);

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("cors");

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            await app.RunAsync();
            
        }
    }
}
