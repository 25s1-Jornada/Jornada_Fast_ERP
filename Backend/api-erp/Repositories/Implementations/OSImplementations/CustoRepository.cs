using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class CustoRepository : ICustoRepository
    {
        private readonly AppDbContext _context;

        public CustoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Custo>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Custo> q = _context.Custos.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q
                    .Include(c => c.OrdemServico)
                    .Include(c => c.Deslocamento_List)
                    .Include(c => c.HoraTrabalhada_List)
                    .Include(c => c.KM_List)
                    .Include(c => c.Material_List);
            }
            return await q.ToListAsync(ct);
        }

        public async Task<Custo?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Custo> q = _context.Custos.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q
                    .Include(c => c.OrdemServico)
                    .Include(c => c.Deslocamento_List)
                    .Include(c => c.HoraTrabalhada_List)
                    .Include(c => c.KM_List)
                    .Include(c => c.Material_List);
            }
            return await q.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<Custo> AddAsync(Custo entity, CancellationToken ct = default)
        {
            await _context.Custos.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(Custo entity, CancellationToken ct = default)
        {
            if (entity.Id is null) return false;
            var exists = await _context.Custos.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var found = await _context.Custos.FindAsync(new object?[] { id }, ct);
            if (found == null) return false;
            _context.Custos.Remove(found);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

