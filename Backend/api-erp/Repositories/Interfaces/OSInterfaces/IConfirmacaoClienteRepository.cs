using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IConfirmacaoClienteRepository
    {
        Task<List<ConfirmacaoCliente>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<ConfirmacaoCliente?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<ConfirmacaoCliente> AddAsync(ConfirmacaoCliente entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(ConfirmacaoCliente entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

