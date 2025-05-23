using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;
        public UsuarioRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<Usuario>> GetAllAsync() => await _context.Usuarios.ToListAsync();
        public async Task<Usuario?> GetByIdAsync(int id) => await _context.Usuarios.FindAsync(id);
        public async Task AddAsync(Usuario usuario) => await _context.Usuarios.AddAsync(usuario);
        public void Update(Usuario usuario) => _context.Usuarios.Update(usuario);
        public void Delete(Usuario usuario) => _context.Usuarios.Remove(usuario);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
