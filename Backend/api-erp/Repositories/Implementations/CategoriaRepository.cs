using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly AppDbContext _context;

        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Categoria>> GetAllAsync() => await _context.Categorias.ToListAsync();
        public async Task<Categoria?> GetByIdAsync(int id) => await _context.Categorias.FindAsync(id);
        public async Task AddAsync(Categoria categoria) => await _context.Categorias.AddAsync(categoria);
        public void Update(Categoria categoria) => _context.Categorias.Update(categoria);
        public void Delete(Categoria categoria) => _context.Categorias.Remove(categoria);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
