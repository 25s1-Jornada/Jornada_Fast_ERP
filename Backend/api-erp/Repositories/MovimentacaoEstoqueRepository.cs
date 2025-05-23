using api_erp.EntityConfig;
using api_erp.Interfaces;
using api_erp.Model;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories
{
    public class MovimentacaoEstoqueRepository : IMovimentacaoEstoqueRepository
    {
        private readonly AppDbContext _context;
        public MovimentacaoEstoqueRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<MovimentacaoEstoque>> GetAllAsync() => await _context.MovimentacoesEstoque.ToListAsync();
        public async Task<MovimentacaoEstoque?> GetByIdAsync(int id) => await _context.MovimentacoesEstoque.FindAsync(id);
        public async Task AddAsync(MovimentacaoEstoque movimentacao) => await _context.MovimentacoesEstoque.AddAsync(movimentacao);
        public void Update(MovimentacaoEstoque movimentacao) => _context.MovimentacoesEstoque.Update(movimentacao);
        public void Delete(MovimentacaoEstoque movimentacao) => _context.MovimentacoesEstoque.Remove(movimentacao);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }

}
