using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
    public interface IDescricaoDefeitoRepository
    {
        Task<List<DescricaoDefeito>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<DescricaoDefeito?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
        Task<DescricaoDefeito> AddAsync(DescricaoDefeito entity, CancellationToken ct = default);
        Task<bool> UpdateAsync(DescricaoDefeito entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}

