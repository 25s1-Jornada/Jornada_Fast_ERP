using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Models.OSModels;
using Microsoft.EntityFrameworkCore;

namespace api_erp.EntityConfig
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Endereco> Enderecos { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Armario> Armarios { get; set; }
        public DbSet<Estoque> Estoques { get; set; }
        public DbSet<MovimentacaoEstoque> MovimentacoesEstoque { get; set; }
        public DbSet<PecaQrCode> PecasQrCode { get; set; }
        public DbSet<DescricaoDoChamado> DescricoesDoChamado { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>()
                .HasIndex(p => p.Sku)
                .IsUnique();

            modelBuilder.Entity<Produto>()
                .HasIndex(p => p.IdIntegracao)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<PecaQrCode>()
                .HasIndex(p => p.Guid)
                .IsUnique();
        }
    }

}
