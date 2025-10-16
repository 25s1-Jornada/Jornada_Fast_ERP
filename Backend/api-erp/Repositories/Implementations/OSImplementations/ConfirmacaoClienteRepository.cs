using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class ConfirmacaoClienteRepository : IConfirmacaoClienteRepository
    {
        private readonly AppDbContext _context;

        public ConfirmacaoClienteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConfirmacaoCliente>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<ConfirmacaoCliente> q = _context.ConfirmacoesCliente.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(c => c.OrdemServico);
            }
            return await q.ToListAsync(ct);
        }

        public async Task<ConfirmacaoCliente?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<ConfirmacaoCliente> q = _context.ConfirmacoesCliente.AsNoTracking();
            if (includeRelacionamentos)
            {
                q = q.Include(c => c.OrdemServico);
            }
            return await q.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<ConfirmacaoCliente> AddAsync(ConfirmacaoCliente entity, CancellationToken ct = default)
        {
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;
            await _context.ConfirmacoesCliente.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(ConfirmacaoCliente entity, CancellationToken ct = default)
        {
            if (entity.Id is null) return false;
            var exists = await _context.ConfirmacoesCliente.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;
            _context.Entry(entity).State = EntityState.Modified;
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var found = await _context.ConfirmacoesCliente.FindAsync(new object?[] { id }, ct);
            if (found == null) return false;
            _context.ConfirmacoesCliente.Remove(found);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

