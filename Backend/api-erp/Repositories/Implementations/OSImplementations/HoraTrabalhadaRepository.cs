using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class HoraTrabalhadaRepository : IHoraTrabalhadaRepository
    {
        private readonly AppDbContext _context;

        public HoraTrabalhadaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<HoraTrabalhada>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<HoraTrabalhada> query = _context.HorasTrabalhadas.AsNoTracking();
            if (includeRelacionamentos)
            {
                query = query.Include(h => h.OrdemServico);
            }
            return await query.ToListAsync(ct);
        }

        public async Task<HoraTrabalhada?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<HoraTrabalhada> query = _context.HorasTrabalhadas.AsNoTracking();
            if (includeRelacionamentos)
            {
                query = query.Include(h => h.OrdemServico);
            }
            return await query.FirstOrDefaultAsync(h => h.Id == id, ct);
        }

        public async Task<HoraTrabalhada> AddAsync(HoraTrabalhada entity, CancellationToken ct = default)
        {
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.HorasTrabalhadas.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(HoraTrabalhada entity, CancellationToken ct = default)
        {
            if (entity.Id is null)
                return false;

            var exists = await _context.HorasTrabalhadas.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            _context.Entry(entity).State = EntityState.Modified;
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.HorasTrabalhadas.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;
            _context.HorasTrabalhadas.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

