using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class DescricaoDefeitoRepository : IDescricaoDefeitoRepository
    {
        private readonly AppDbContext _context;

        public DescricaoDefeitoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DescricaoDefeito>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDefeito> q = _context.DescricoesDefeito.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(d => d.OrdemServico);
            }
            return await q.ToListAsync(ct);
        }

        public async Task<DescricaoDefeito?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDefeito> q = _context.DescricoesDefeito.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(d => d.OrdemServico);
            }
            return await q.FirstOrDefaultAsync(d => d.Id == id, ct);
        }

        public async Task<DescricaoDefeito?> GetByOrdemServicoIdAsync(int ordemServicoId, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDefeito> q = _context.DescricoesDefeito.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(d => d.OrdemServico);
            }
            return await q.FirstOrDefaultAsync(d => d.OrdemServicoId == ordemServicoId, ct);
        }

        public async Task<DescricaoDefeito> AddAsync(DescricaoDefeito entity, CancellationToken ct = default)
        {
            await _context.DescricoesDefeito.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(DescricaoDefeito entity, CancellationToken ct = default)
        {
            if (entity.Id is null)
                return false;

            var exists = await _context.DescricoesDefeito.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.DescricoesDefeito.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;
            _context.DescricoesDefeito.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

