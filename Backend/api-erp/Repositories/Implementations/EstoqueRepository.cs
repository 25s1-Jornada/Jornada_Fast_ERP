using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class EstoqueRepository : IEstoqueRepository
    {
        private readonly AppDbContext _context;
        public EstoqueRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<Estoque>> GetAllAsync() => await _context.Estoques.ToListAsync();
        public async Task<Estoque?> GetByIdAsync(int id) => await _context.Estoques.FindAsync(id);
        public async Task AddAsync(Estoque estoque) => await _context.Estoques.AddAsync(estoque);
        public void Update(Estoque estoque) => _context.Estoques.Update(estoque);
        public void Delete(Estoque estoque) => _context.Estoques.Remove(estoque);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
