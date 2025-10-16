using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class MaterialRepository : IMaterialRepository
    {
        private readonly AppDbContext _context;

        public MaterialRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Material>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Material> q = _context.Materiais.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(m => m.Custo);
            }
            return await q.ToListAsync(ct);
        }

        public async Task<Material?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<Material> q = _context.Materiais.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(m => m.Custo);
            }
            return await q.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<Material> AddAsync(Material entity, CancellationToken ct = default)
        {
            if (entity.Custo != null)
                _context.Entry(entity.Custo).State = EntityState.Unchanged;
            await _context.Materiais.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(Material entity, CancellationToken ct = default)
        {
            if (entity.Id is null) return false;
            var exists = await _context.Materiais.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;
            _context.Entry(entity).State = EntityState.Modified;
            if (entity.Custo != null)
                _context.Entry(entity.Custo).State = EntityState.Unchanged;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var found = await _context.Materiais.FindAsync(new object?[] { id }, ct);
            if (found == null) return false;
            _context.Materiais.Remove(found);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

