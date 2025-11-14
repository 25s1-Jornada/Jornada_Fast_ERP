using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly AppDbContext _context;

        public ProdutoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _context.Produtos.ToListAsync();
        }

        public async Task<Produto?> GetByIdAsync(int id)
        {
            return await _context.Produtos.FindAsync(id);
        }

        public async Task AddAsync(ProdutoDTO produtoDto)
        {
            var produto = new Produto
            {
                IdIntegracao = produtoDto.IdIntegracao,
                Sku = produtoDto.Sku,
                Nome = produtoDto.Nome,
                Descricao = produtoDto.Descricao,
                Preco = produtoDto.Preco,
                CategoriaId = produtoDto.CategoriaId,
                Status = produtoDto.Status
            };

            await _context.Produtos.AddAsync(produto);
        }

        public void Update(ProdutoDTO produtoDto)
        {
            var produto = new Produto
            {
                Id = produtoDto.Id ?? 0,
                IdIntegracao = produtoDto.IdIntegracao,
                Sku = produtoDto.Sku,
                Nome = produtoDto.Nome,
                Descricao = produtoDto.Descricao,
                Preco = produtoDto.Preco,
                CategoriaId = produtoDto.CategoriaId,
                Status = produtoDto.Status
            };

            _context.Produtos.Update(produto);
        }

        public void Delete(Produto produto)
        {
            _context.Produtos.Remove(produto);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
