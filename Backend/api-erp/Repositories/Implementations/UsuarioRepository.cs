using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories.Implementations
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task AddAsync(UsuarioDTO usuarioDto)
        {
            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                EnderecoId = usuarioDto.EnderecoId,
                Telefone = usuarioDto.Telefone,
                Email = usuarioDto.Email,
                Senha = usuarioDto.Senha,
                Cpf = usuarioDto.Cpf,
                PerfilId = usuarioDto.PerfilId,
                EmpresaId = usuarioDto.EmpresaId
            };

            await _context.Usuarios.AddAsync(usuario);
        }

        public void Update(UsuarioDTO usuarioDto)
        {
            var usuario = new Usuario
            {
                Id = usuarioDto.Id ?? 0,
                Nome = usuarioDto.Nome,
                EnderecoId = usuarioDto.EnderecoId,
                Telefone = usuarioDto.Telefone,
                Email = usuarioDto.Email,
                Senha = usuarioDto.Senha,
                Cpf = usuarioDto.Cpf,
                PerfilId = usuarioDto.PerfilId,
                EmpresaId = usuarioDto.EmpresaId
            };

            _context.Usuarios.Update(usuario);
        }

        public void Delete(Usuario usuario)
        {
            _context.Usuarios.Remove(usuario);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
