using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface ICustoRepository
    {
        Task<List<Custo>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Custo?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Custo> AddAsync(Custo entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(Custo entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

