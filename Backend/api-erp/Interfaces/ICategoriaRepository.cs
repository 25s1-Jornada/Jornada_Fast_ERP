using api_erp.Model;

namespace api_erp.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetAllAsync();
        Task<Categoria?> GetByIdAsync(int id);
        Task AddAsync(Categoria categoria);
        void Update(Categoria categoria);
        void Delete(Categoria categoria);
        Task SaveChangesAsync();
    }
}
