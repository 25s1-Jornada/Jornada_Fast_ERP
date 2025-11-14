using api_erp.Model;
using api_erp.Models;
using api_erp.Models.OSModels;
using api_erp.Models.Views;
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
        public DbSet<ConfirmacaoCliente> ConfirmacoesCliente { get; set; }
        public DbSet<Custo> Custos { get; set; }
        public DbSet<DescricaoDefeito> DescricoesDefeito { get; set; }
        public DbSet<DescricaoDoChamado> DescricoesDoChamado { get; set; }
        public DbSet<Deslocamento> Deslocamentos { get; set; }
        public DbSet<HoraTrabalhada> HorasTrabalhadas { get; set; }
        public DbSet<KM> Kms { get; set; }
        public DbSet<Material> Materiais { get; set; }
        public DbSet<OrdemServico> OrdensServico { get; set; }
        public DbSet<Imagem> Imagens { get; set; }
        public DbSet<Validacao> Validacoes { get; set; }
        public DbSet<ValidacaoDetalhe> ValidacaoDetalhes { get; set; }
        public DbSet<MovimentacaoDetalhadaView> MovimentacaoDetalhada { get; set; }
        public DbSet<PecasQrCodeDetalhadasView> PecasQrCodeDetalhadas { get; set; }
        public DbSet<EstoqueResumidoView> EstoqueResumido { get; set; }
        public DbSet<ArmarioUsuarioView> ArmarioUsuario { get; set; }
        public DbSet<MovimentacaoMensalView> MovimentacaoMensal { get; set; }
        public DbSet<UsuariosPorEmpresaView> UsuariosPorEmpresa { get; set; }
        public DbSet<AcessoUsuarioView> AcessoUsuario { get; set; }
        public DbSet<EstoquePorArmarioView> EstoquePorArmario { get; set; }

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

            modelBuilder.Entity<Validacao>()
                .HasMany(v => v.Detalhes)
                .WithOne(d => d.Validacao)
                .HasForeignKey(d => d.ValidacaoId);

            modelBuilder.Entity<MovimentacaoDetalhadaView>()
                .ToView("vw_movimentacao_detalhada")
                .HasNoKey();

            modelBuilder.Entity<PecasQrCodeDetalhadasView>()
                .ToView("vw_pecas_qrcode_detalhadas")
                .HasNoKey();

            modelBuilder.Entity<EstoqueResumidoView>()
                .ToView("vw_estoque_resumido")
                .HasNoKey();

            modelBuilder.Entity<ArmarioUsuarioView>()
                .ToView("vw_armario_usuario")
                .HasNoKey();

            modelBuilder.Entity<MovimentacaoMensalView>()
                .ToView("vw_movimentacao_mensal")
                .HasNoKey();

            modelBuilder.Entity<UsuariosPorEmpresaView>()
                .ToView("vw_usuarios_por_empresa")
                .HasNoKey();

            modelBuilder.Entity<AcessoUsuarioView>()
                .ToView("vw_acesso_usuario")
                .HasNoKey();

            modelBuilder.Entity<EstoquePorArmarioView>()
                .ToView("vw_estoque_por_armario")
                .HasNoKey();
        }
    }
}
