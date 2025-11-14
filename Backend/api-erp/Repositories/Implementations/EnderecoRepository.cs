using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class EnderecoRepository : IEnderecoRepository
    {
        private readonly AppDbContext _context;

        public EnderecoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Endereco>> GetAllAsync()
        {
            return await _context.Enderecos.ToListAsync();
        }

        public async Task<Endereco?> GetByIdAsync(int id)
        {
            return await _context.Enderecos.FindAsync(id);
        }

        public async Task AddAsync(EnderecoDTO enderecoDto)
        {
            var endereco = new Endereco
            {
                Logradouro = enderecoDto.Logradouro,
                Numero = enderecoDto.Numero,
                Bairro = enderecoDto.Bairro,
                Cidade = enderecoDto.Cidade,
                UF = enderecoDto.UF
            };

            await _context.Enderecos.AddAsync(endereco);
        }

        public void Update(EnderecoDTO enderecoDto)
        {
            var endereco = new Endereco
            {
                Id = enderecoDto.Id ?? 0,
                Logradouro = enderecoDto.Logradouro,
                Numero = enderecoDto.Numero,
                Bairro = enderecoDto.Bairro,
                Cidade = enderecoDto.Cidade,
                UF = enderecoDto.UF
            };

            _context.Enderecos.Update(endereco);
        }

        public void Delete(Endereco endereco)
        {
            _context.Enderecos.Remove(endereco);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
