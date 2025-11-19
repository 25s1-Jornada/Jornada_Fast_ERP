using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(int id);
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario?> GetByEmailWithPerfilAsync(string email);
        Task AddAsync(UsuarioDTO usuario);
        Task UpdatePasswordAsync(int userId, string hashedPassword);
        Task UpdateAsync(UsuarioDTO usuario);
        void Delete(Usuario usuario);
        Task SaveChangesAsync();
    }
}
