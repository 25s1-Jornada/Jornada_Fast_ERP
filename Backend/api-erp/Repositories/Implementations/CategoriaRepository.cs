using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly AppDbContext _context;

        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Categoria>> GetAllAsync()
        {
            return await _context.Categorias.ToListAsync();
        }

        public async Task<Categoria?> GetByIdAsync(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        public async Task AddAsync(CategoriaDTO categoriaDto)
        {
            var categoria = new Categoria
            {
                Nome = categoriaDto.Nome,
                Descricao = categoriaDto.Descricao
            };

            await _context.Categorias.AddAsync(categoria);
        }

        public void Update(CategoriaDTO categoria)
        {
            var categoriaEdit = new Categoria
            {
                Id = categoria.Id,
                Nome = categoria.Nome,
                Descricao = categoria.Descricao
            };
            _context.Categorias.Update(categoriaEdit);
        }

        public void Delete(Categoria categoria)
        {
            _context.Categorias.Remove(categoria);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
