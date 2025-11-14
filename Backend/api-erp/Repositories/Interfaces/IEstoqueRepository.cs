using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IEstoqueRepository
    {
        Task<IEnumerable<Estoque>> GetAllAsync();
        Task<Estoque?> GetByIdAsync(int id);
        Task AddAsync(Estoque estoque);
        void Update(Estoque estoque);
        void Delete(Estoque estoque);
        Task SaveChangesAsync();

    }
}
