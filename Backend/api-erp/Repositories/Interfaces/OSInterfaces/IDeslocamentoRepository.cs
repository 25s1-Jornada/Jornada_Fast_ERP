using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IDeslocamentoRepository
    {
        Task<List<Deslocamento>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Deslocamento?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Deslocamento> AddAsync(Deslocamento entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(Deslocamento entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

