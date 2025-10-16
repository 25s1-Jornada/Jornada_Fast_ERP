using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class KMRepository : IKMRepository
    {
        private readonly AppDbContext _context;

        public KMRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<KM>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            // KM não possui navegações atualmente
            return await _context.Kms.AsNoTracking().ToListAsync(ct);
        }

        public async Task<KM?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            return await _context.Kms.AsNoTracking().FirstOrDefaultAsync(k => k.Id == id, ct);
        }

        public async Task<KM> AddAsync(KM entity, CancellationToken ct = default)
        {
            await _context.Kms.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(KM entity, CancellationToken ct = default)
        {
            if (entity.Id is null)
                return false;

            var exists = await _context.Kms.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.Kms.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;
            _context.Kms.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

