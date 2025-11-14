using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Models;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class ValidacaoRepository : IValidacaoRepository
    {
        private readonly AppDbContext _context;

        public ValidacaoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Validacao>> GetAllAsync(string? status = null, int? armarioId = null)
        {
            var query = _context.Validacoes
                .AsNoTracking()
                .Include(v => v.Armario)
                .Include(v => v.Usuario)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var normalized = status.Trim().ToUpperInvariant();
                query = query.Where(v => v.Status.ToUpper() == normalized);
            }

            if (armarioId.HasValue)
            {
                query = query.Where(v => v.ArmarioId == armarioId.Value);
            }

            return await query
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
        }

        public async Task<Validacao?> GetByIdAsync(int id)
        {
            return await _context.Validacoes
                .Include(v => v.Detalhes)
                .Include(v => v.Armario)
                .Include(v => v.Usuario)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Validacao> AddAsync(ValidacaoDTO dto)
        {
            var entity = MapToEntity(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _context.Validacoes.AddAsync(entity);
            await _context.SaveChangesAsync();

            if (dto.Detalhes?.Any() == true)
            {
                await AddDetalhesAsync(entity.Id, dto.Detalhes);
                entity = (await GetByIdAsync(entity.Id))!;
            }

            return entity;
        }

        public async Task UpdateAsync(ValidacaoDTO dto)
        {
            if (dto.Id == null)
            {
                throw new ArgumentException("Id obrigatório para atualização", nameof(dto.Id));
            }

            var entity = await _context.Validacoes
                .Include(v => v.Detalhes)
                .FirstOrDefaultAsync(v => v.Id == dto.Id.Value);

            if (entity == null)
            {
                throw new KeyNotFoundException($"Validação {dto.Id} não encontrada");
            }

            entity.Status = dto.Status;
            entity.DataValidacao = dto.DataValidacao;
            entity.ArmarioId = dto.ArmarioId;
            entity.UsuarioId = dto.UsuarioId;
            entity.Observacoes = dto.Observacoes;
            entity.TotalConfirmadas = dto.TotalConfirmadas;
            entity.TotalPendentes = dto.TotalPendentes;
            entity.TotalNaoEncontradas = dto.TotalNaoEncontradas;
            entity.TotalExecucoes = dto.TotalExecucoes;
            entity.TempoExecucaoSegundos = dto.TempoExecucaoSegundos;

            if (dto.Detalhes?.Any() == true)
            {
                if (entity.Detalhes?.Any() == true)
                {
                    _context.ValidacaoDetalhes.RemoveRange(entity.Detalhes);
                }

                await AddDetalhesAsync(entity.Id, dto.Detalhes);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Validacoes.FindAsync(id);
            if (entity == null) return false;

            _context.Validacoes.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ValidacaoDetalhe>> GetDetalhesAsync(int validacaoId)
        {
            return await _context.ValidacaoDetalhes
                .AsNoTracking()
                .Where(d => d.ValidacaoId == validacaoId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task AddDetalhesAsync(int validacaoId, IEnumerable<ValidacaoDetalheDTO> detalhes)
        {
            if (!detalhes.Any()) return;

            var entities = detalhes.Select(d => new ValidacaoDetalhe
            {
                ValidacaoId = validacaoId,
                QrCode = d.QrCode,
                ProdutoNome = d.ProdutoNome,
                Status = d.Status,
                CreatedAt = DateTime.UtcNow
            });

            await _context.ValidacaoDetalhes.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        private static Validacao MapToEntity(ValidacaoDTO dto)
        {
            return new Validacao
            {
                Id = dto.Id ?? 0,
                Status = dto.Status,
                DataValidacao = dto.DataValidacao,
                ArmarioId = dto.ArmarioId,
                UsuarioId = dto.UsuarioId,
                Observacoes = dto.Observacoes,
                TotalConfirmadas = dto.TotalConfirmadas,
                TotalPendentes = dto.TotalPendentes,
                TotalNaoEncontradas = dto.TotalNaoEncontradas,
                TotalExecucoes = dto.TotalExecucoes,
                TempoExecucaoSegundos = dto.TempoExecucaoSegundos
            };
        }
    }
}
