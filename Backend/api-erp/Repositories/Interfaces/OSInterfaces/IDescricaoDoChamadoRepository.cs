using api_erp.Models.OSModels;

namespace api_erp.Repositories.Interfaces.OSInterfaces
{
        public interface IDescricaoDoChamadoRepository
        {
           
            Task<List<DescricaoDoChamado>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default);
            Task<DescricaoDoChamado?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default);
            Task<List<DescricaoDoChamado>> GetByOrdemServicoIdAsync(int ordemServicoId, bool includeRelacionamentos = true, CancellationToken ct = default);
            Task<DescricaoDoChamado> AddAsync(DescricaoDoChamado entity, CancellationToken ct = default);
            Task<bool> UpdateAsync(DescricaoDoChamado entity, CancellationToken ct = default);
            Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        
        }
}
