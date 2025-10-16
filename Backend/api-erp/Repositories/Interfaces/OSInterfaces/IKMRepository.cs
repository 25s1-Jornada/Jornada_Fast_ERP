using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IKMRepository
    {
        Task<List<KM>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<KM?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<KM> AddAsync(KM entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(KM entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

