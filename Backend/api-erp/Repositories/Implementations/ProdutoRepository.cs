using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly AppDbContext _context;

        public ProdutoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Produto>> GetAllAsync() => await _context.Produtos.ToListAsync();
        public async Task<Produto?> GetByIdAsync(int id) => await _context.Produtos.FindAsync(id);
        public async Task AddAsync(Produto produto) => await _context.Produtos.AddAsync(produto);
        public void Update(Produto produto) => _context.Produtos.Update(produto);
        public void Delete(Produto produto) => _context.Produtos.Remove(produto);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }

}
