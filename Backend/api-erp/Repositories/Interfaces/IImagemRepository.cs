using api_erp.Models;

namespace api_erp.Repositories.Interfaces
{
    public interface IImagemRepository
    {
        Task<List<Imagem>> GetAllAsync(CancellationToken ct = default);
        Task<List<Imagem>> GetByOrdemServicoAsync(int ordemServicoId, CancellationToken ct = default);
        Task<List<Imagem>> GetByDescricaoDoChamadoAsync(int descricaoId, CancellationToken ct = default);
        Task<Imagem?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<Imagem> AddAsync(Imagem entity, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);
    }
}

