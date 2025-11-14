using api_erp.EntityConfig;
using api_erp.Models.Views;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly AppDbContext _context;

        public AnalyticsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MovimentacaoDetalhadaView>> GetMovimentacaoDetalhadaAsync()
            => await _context.MovimentacaoDetalhada.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<PecasQrCodeDetalhadasView>> GetPecasQrCodeDetalhadasAsync()
            => await _context.PecasQrCodeDetalhadas.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<EstoqueResumidoView>> GetEstoqueResumidoAsync()
            => await _context.EstoqueResumido.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<ArmarioUsuarioView>> GetArmarioUsuarioAsync()
            => await _context.ArmarioUsuario.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<MovimentacaoMensalView>> GetMovimentacaoMensalAsync()
            => await _context.MovimentacaoMensal.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<UsuariosPorEmpresaView>> GetUsuariosPorEmpresaAsync()
            => await _context.UsuariosPorEmpresa.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<AcessoUsuarioView>> GetAcessoUsuarioAsync()
            => await _context.AcessoUsuario.AsNoTracking().ToListAsync();

        public async Task<IEnumerable<EstoquePorArmarioView>> GetEstoquePorArmarioAsync()
            => await _context.EstoquePorArmario.AsNoTracking().ToListAsync();
    }
}
