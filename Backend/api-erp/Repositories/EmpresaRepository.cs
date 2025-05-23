using api_erp.EntityConfig;
using api_erp.Interfaces;
using api_erp.Model;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories
{
    public class EmpresaRepository : IEmpresaRepository
    {
        private readonly AppDbContext _context;
        public EmpresaRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<Empresa>> GetAllAsync() => await _context.Empresas.ToListAsync();
        public async Task<Empresa?> GetByIdAsync(int id) => await _context.Empresas.FindAsync(id);
        public async Task AddAsync(Empresa empresa) => await _context.Empresas.AddAsync(empresa);
        public void Update(Empresa empresa) => _context.Empresas.Update(empresa);
        public void Delete(Empresa empresa) => _context.Empresas.Remove(empresa);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
