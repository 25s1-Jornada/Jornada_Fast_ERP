using api_erp.Models.Views;

namespace api_erp.Repositories.Interfaces
{
    public interface IAnalyticsRepository
    {
        Task<IEnumerable<MovimentacaoDetalhadaView>> GetMovimentacaoDetalhadaAsync();
        Task<IEnumerable<PecasQrCodeDetalhadasView>> GetPecasQrCodeDetalhadasAsync();
        Task<IEnumerable<EstoqueResumidoView>> GetEstoqueResumidoAsync();
        Task<IEnumerable<ArmarioUsuarioView>> GetArmarioUsuarioAsync();
        Task<IEnumerable<MovimentacaoMensalView>> GetMovimentacaoMensalAsync();
        Task<IEnumerable<UsuariosPorEmpresaView>> GetUsuariosPorEmpresaAsync();
        Task<IEnumerable<AcessoUsuarioView>> GetAcessoUsuarioAsync();
        Task<IEnumerable<EstoquePorArmarioView>> GetEstoquePorArmarioAsync();
    }
}
