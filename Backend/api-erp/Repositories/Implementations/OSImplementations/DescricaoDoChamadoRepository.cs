using api_erp.EntityConfig;
using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations.OSImplementations
{
    public class DescricaoDoChamadoRepository : IDescricaoDoChamadoRepository
    {
        private readonly AppDbContext _context;

        public DescricaoDoChamadoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DescricaoDoChamado>> GetAllAsync(bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDoChamado> query = _context.DescricoesDoChamado.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query
                    .Include(d => d.Categoria)
                    .Include(d => d.OrdemServico);
            }

            return await query.ToListAsync(ct);
        }

        public async Task<DescricaoDoChamado?> GetByIdAsync(int id, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDoChamado> query = _context.DescricoesDoChamado.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query
                    .Include(d => d.Categoria)
                    .Include(d => d.OrdemServico);
            }

            return await query.FirstOrDefaultAsync(d => d.Id == id, ct);
        }

        public async Task<List<DescricaoDoChamado>> GetByOrdemServicoIdAsync(int ordemServicoId, bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            IQueryable<DescricaoDoChamado> query = _context.DescricoesDoChamado.AsNoTracking();

            if (includeRelacionamentos)
            {
                query = query
                    .Include(d => d.Categoria)
                    .Include(d => d.OrdemServico);
            }

            return await query.Where(d => d.OrdemServicoId == ordemServicoId).ToListAsync(ct);
        }

        public async Task<DescricaoDoChamado> AddAsync(DescricaoDoChamado entity, CancellationToken ct = default)
        {
            // Garante FK de categoria válida; se não existir, zera para evitar erro de FK
            if (entity.CategoriaId.HasValue)
            {
                var existsCategoria = await _context.Categorias
                    .AsNoTracking()
                    .AnyAsync(c => c.Id == entity.CategoriaId, ct);
                if (!existsCategoria)
                    entity.CategoriaId = null;
            }

            // Evita inserção acidental de navegações
            if (entity.Categoria != null)
                _context.Entry(entity.Categoria).State = EntityState.Unchanged;
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.DescricoesDoChamado.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<bool> UpdateAsync(DescricaoDoChamado entity, CancellationToken ct = default)
        {
            if (entity.Id is null)
                return false;

            var exists = await _context.DescricoesDoChamado.AnyAsync(x => x.Id == entity.Id, ct);
            if (!exists) return false;

            if (entity.CategoriaId.HasValue)
            {
                var existsCategoria = await _context.Categorias
                    .AsNoTracking()
                    .AnyAsync(c => c.Id == entity.CategoriaId, ct);
                if (!existsCategoria)
                    entity.CategoriaId = null;
            }

            _context.Entry(entity).State = EntityState.Modified;

            if (entity.Categoria != null)
                _context.Entry(entity.Categoria).State = EntityState.Unchanged;
            if (entity.OrdemServico != null)
                _context.Entry(entity.OrdemServico).State = EntityState.Unchanged;

            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _context.DescricoesDoChamado.FindAsync(new object?[] { id }, ct);
            if (entity == null) return false;

            _context.DescricoesDoChamado.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}
