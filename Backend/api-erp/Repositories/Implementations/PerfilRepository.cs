using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class PerfilRepository : IPerfilRepository
    {
        private readonly AppDbContext _context;

        public PerfilRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Perfil>> GetAllAsync()
        {
            return await _context.Perfis.ToListAsync();
        }

        public async Task<Perfil?> GetByIdAsync(int id)
        {
            return await _context.Perfis.FindAsync(id);
        }

        public async Task AddAsync(PerfilDTO perfilDto)
        {
            var perfil = new Perfil
            {
                Nome = perfilDto.Nome
            };

            await _context.Perfis.AddAsync(perfil);
        }

        public void Update(PerfilDTO perfilDto)
        {
            var perfil = new Perfil
            {
                Id = perfilDto.Id ?? 0,
                Nome = perfilDto.Nome
            };

            _context.Perfis.Update(perfil);
        }

        public void Delete(Perfil perfil)
        {
            _context.Perfis.Remove(perfil);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
