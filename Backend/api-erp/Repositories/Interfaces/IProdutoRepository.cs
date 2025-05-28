using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IProdutoRepository
    {
        Task<IEnumerable<Produto>> GetAllAsync();
        Task<Produto?> GetByIdAsync(int id);
        Task AddAsync(ProdutoDTO produto);
        void Update(ProdutoDTO produto);
        void Delete(Produto produto);
        Task SaveChangesAsync();
    }
}
