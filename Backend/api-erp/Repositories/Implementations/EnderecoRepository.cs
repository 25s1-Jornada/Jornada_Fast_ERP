using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class EnderecoRepository : IEnderecoRepository
    {
        private readonly AppDbContext _context;
        public EnderecoRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<Endereco>> GetAllAsync() => await _context.Enderecos.ToListAsync();
        public async Task<Endereco?> GetByIdAsync(int id) => await _context.Enderecos.FindAsync(id);
        public async Task AddAsync(Endereco endereco) => await _context.Enderecos.AddAsync(endereco);
        public void Update(Endereco endereco) => _context.Enderecos.Update(endereco);
        public void Delete(Endereco endereco) => _context.Enderecos.Remove(endereco);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
