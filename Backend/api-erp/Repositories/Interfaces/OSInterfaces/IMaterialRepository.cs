using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IMaterialRepository
    {
        Task<List<Material>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Material?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<Material> AddAsync(Material entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(Material entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

