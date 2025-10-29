using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IOrdemServicoRepository
    {
        Task<List<OrdemServico>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<OrdemServico?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<OrdemServico> AddAsync(OrdemServico entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(OrdemServico entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

