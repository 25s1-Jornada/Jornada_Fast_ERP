using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class OrdemServicoRepository : IOrdemServicoRepository
    {
        private readonly AppDbContext _context;

        public OrdemServicoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrdemServico>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<OrdemServico> query = _context.OrdensServico.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query
                    .Include(o => o.Empresa)
                    .Include(o => o.Tecnico)
                    .Include(o => o.DescricaoDoChamadoList);
            }

            return await query.ToListAsync(ct);
        }

        public async Task<OrdemServico?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<OrdemServico> query = _context.OrdensServico.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query
                    .Include(o => o.Empresa)
                    .Include(o => o.Tecnico)
                    .Include(o => o.DescricaoDoChamadoList);
            }

            return await query.FirstOrDefaultAsync(o => o.Id == id, ct);
        }

        public async Task<OrdemServico> AddAsync(OrdemServico entity, CancellationToken ct = default)
        {
            if (entity.Empresa != null)
                _context.Entry(entity.Empresa).State = EntityState.Unchanged;
            if (entity.Tecnico != null)
                _context.Entry(entity.Tecnico).State = EntityState.Unchanged;

            await _context.OrdensServico.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(OrdemServico entity, CancellationToken ct = default)
        {
            var exists = await _context.OrdensServico.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            _context.Entry(entity).State = EntityState.Modified;
            if (entity.Empresa != null)
                _context.Entry(entity.Empresa).State = EntityState.Unchanged;
            if (entity.Tecnico != null)
                _context.Entry(entity.Tecnico).State = EntityState.Unchanged;

            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.OrdensServico.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;
            _context.OrdensServico.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

