using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IMovimentacaoEstoqueRepository
    {
        Task<IEnumerable<MovimentacaoEstoque>> GetAllAsync();
        Task<MovimentacaoEstoque?> GetByIdAsync(int id);
        Task AddAsync(MovimentacaoEstoque movimentacao);
        void Update(MovimentacaoEstoque movimentacao);
        void Delete(MovimentacaoEstoque movimentacao);
        Task SaveChangesAsync();
    }
}
