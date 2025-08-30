
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

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

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

            app.UseCors("cors");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
            
        }
    }
}
