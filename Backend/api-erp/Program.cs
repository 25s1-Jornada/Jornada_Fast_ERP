
using api_erp.EntityConfig;
using api_erp.Repositories.Implementations;
using api_erp.Repositories.Implementations.OSImplementations;
using api_erp.Repositories.Interfaces;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp
{
    public class Program
    {
        public static void Main(string[] args)
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

            // Segundo DbContext apontando para outra base
            builder.Services.AddDbContext<api_erp.EntityConfig.SecondDbContext>(options =>
            {
                if (string.IsNullOrWhiteSpace(secondConnection))
                {
                    options.UseInMemoryDatabase("ApiErpDev2");
                }
                else if (secondConnection.Contains("Data Source=", StringComparison.OrdinalIgnoreCase))
                {
                    options.UseSqlite(secondConnection);
                }
                else
                {
                    options.UseMySql(secondConnection, ServerVersion.AutoDetect(secondConnection));
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
                }
                catch { }

                try
                {
                    var secondDb = scope.ServiceProvider.GetRequiredService<api_erp.EntityConfig.SecondDbContext>();
                    secondDb.Database.Migrate();
                }
                catch { }
            }

            app.UseCors("cors");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
            
        }
    }
}
