using api_erp.EntityConfig;
using api_erp.Models;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class ImagemRepository : IImagemRepository
    {
        private readonly AppDbContext _context;
        public ImagemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Imagem>> GetAllAsync(CancellationToken ct = default)
            => await _context.Set<Imagem>().AsNoTracking().ToListAsync(ct);

        public async Task<List<Imagem>> GetByOrdemServicoAsync(int ordemServicoId, CancellationToken ct = default)
            => await _context.Set<Imagem>().AsNoTracking().Where(i => i.OrdemServicoId == ordemServicoId).ToListAsync(ct);

        public async Task<List<Imagem>> GetByDescricaoDoChamadoAsync(int descricaoId, CancellationToken ct = default)
            => await _context.Set<Imagem>().AsNoTracking().Where(i => i.DescricaoDoChamadoId == descricaoId).ToListAsync(ct);

        public async Task<Imagem?> GetByIdAsync(long id, CancellationToken ct = default)
            => await _context.Set<Imagem>().AsNoTracking().FirstOrDefaultAsync(i => i.Id == id, ct);

        public async Task<Imagem> AddAsync(Imagem entity, CancellationToken ct = default)
        {
            await _context.Set<Imagem>().AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> DeleteAsync(long id, CancellationToken ct = default)
        {
            var it = await _context.Set<Imagem>().FindAsync(new object?[] { id }, ct);
            if (it == null) return false;
            _context.Set<Imagem>().Remove(it);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

