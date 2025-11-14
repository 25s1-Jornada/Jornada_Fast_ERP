using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class EmpresaRepository : IEmpresaRepository
    {
        private readonly AppDbContext _context;

        public EmpresaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Empresa>> GetAllAsync()
        {
            return await _context.Empresas.ToListAsync();
        }

        public async Task<Empresa?> GetByIdAsync(int id)
        {
            return await _context.Empresas.FindAsync(id);
        }

        public async Task AddAsync(EmpresaDTO empresaDto)
        {
            var empresa = new Empresa
            {
                Nome = empresaDto.Nome,
                Cnpj = empresaDto.Cnpj,
                EnderecoId = empresaDto.EnderecoId,
                TipoEmpresa = empresaDto.TipoEmpresa,
                Email = empresaDto.Email
            };

            await _context.Empresas.AddAsync(empresa);
        }

        public void Update(EmpresaDTO empresaDto)
        {
            var empresa = new Empresa
            {
                Id = empresaDto.Id ?? 0, 
                Nome = empresaDto.Nome,
                Cnpj = empresaDto.Cnpj,
                EnderecoId = empresaDto.EnderecoId,
                TipoEmpresa = empresaDto.TipoEmpresa,
                Email = empresaDto.Email
            };

            _context.Empresas.Update(empresa);
        }


        public void Delete(Empresa empresa)
        {
            _context.Empresas.Remove(empresa);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
