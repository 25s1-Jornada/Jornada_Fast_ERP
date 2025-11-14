using api_erp.DTOs;
using api_erp.Models;

namespace api_erp.Repositories.Interfaces
{
    public interface IValidacaoRepository
    {
        Task<IEnumerable<Validacao>> GetAllAsync(string? status = null, int? armarioId = null);
        Task<Validacao?> GetByIdAsync(int id);
        Task<Validacao> AddAsync(ValidacaoDTO dto);
        Task UpdateAsync(ValidacaoDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ValidacaoDetalhe>> GetDetalhesAsync(int validacaoId);
        Task AddDetalhesAsync(int validacaoId, IEnumerable<ValidacaoDetalheDTO> detalhes);
    }
}
