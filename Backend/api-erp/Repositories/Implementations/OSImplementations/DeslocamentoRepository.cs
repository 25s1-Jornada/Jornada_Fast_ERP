using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class DeslocamentoRepository : IDeslocamentoRepository
    {
        private readonly AppDbContext _context;

        public DeslocamentoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Deslocamento>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Deslocamento> query = _context.Deslocamentos.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query.Include(d => d.OrdemServico);
            }

            return await query.ToListAsync(ct);
        }

        public async Task<Deslocamento?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Deslocamento> query = _context.Deslocamentos.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query.Include(d => d.OrdemServico);
            }

            return await query.FirstOrDefaultAsync(d => d.Id == id, ct);
        }

        public async Task<Deslocamento> AddAsync(Deslocamento entity, CancellationToken ct = default)
        {
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.Deslocamentos.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(Deslocamento entity, CancellationToken ct = default)
        {
            if (entity.Id is null)
                return false;

            var exists = await _context.Deslocamentos.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            _context.Entry(entity).State = EntityState.Modified;
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.Deslocamentos.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;
            _context.Deslocamentos.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

