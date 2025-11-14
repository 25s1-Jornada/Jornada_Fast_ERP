using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(int id);
        Task AddAsync(UsuarioDTO usuario);
        void Update(UsuarioDTO usuario);
        void Delete(Usuario usuario);
        Task SaveChangesAsync();
    }
}
