using api_erp.Model;

namespace api_erp.Interfaces
{
    public interface IPerfilRepository
    {
        Task<IEnumerable<Perfil>> GetAllAsync();
        Task<Perfil?> GetByIdAsync(int id);
        Task AddAsync(Perfil perfil);
        void Update(Perfil perfil);
        void Delete(Perfil perfil);
        Task SaveChangesAsync();
    }
}
