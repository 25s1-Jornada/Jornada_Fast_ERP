using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetAllAsync();
        Task<Categoria?> GetByIdAsync(int id);
        Task AddAsync(CategoriaDTO categoria);
        void Update(CategoriaDTO categoria);
        void Delete(Categoria categoria);
        Task SaveChangesAsync();
    }
}
