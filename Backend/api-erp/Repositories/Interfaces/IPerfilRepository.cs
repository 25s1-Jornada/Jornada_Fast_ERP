using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IPerfilRepository
    {
        Task<IEnumerable<Perfil>> GetAllAsync();
        Task<Perfil?> GetByIdAsync(int id);
        Task AddAsync(PerfilDTO perfil);
        void Update(PerfilDTO perfil);
        void Delete(Perfil perfil);
        Task SaveChangesAsync();
    }
}
