using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IHoraTrabalhadaRepository
    {
        Task<List<HoraTrabalhada>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<HoraTrabalhada?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<HoraTrabalhada> AddAsync(HoraTrabalhada entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(HoraTrabalhada entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

