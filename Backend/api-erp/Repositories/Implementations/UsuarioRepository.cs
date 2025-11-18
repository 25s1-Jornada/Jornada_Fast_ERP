using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using api_erp.Security;
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

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _context.Usuarios
                .Include(u => u.Perfil)
                .Include(u => u.Empresa)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(UsuarioDTO usuarioDto)
        {
            if (string.IsNullOrWhiteSpace(usuarioDto.Senha))
            {
                throw new ArgumentException("Senha obrigatória para criação do usuário.");
            }

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Telefone = usuarioDto.Telefone,
                Email = usuarioDto.Email,
                Senha = PasswordHasher.HashPassword(usuarioDto.Senha),
                PerfilId = usuarioDto.PerfilId,
                EmpresaId = usuarioDto.EmpresaId
            };

            await _context.Usuarios.AddAsync(usuario);
        }

        public async Task UpdateAsync(UsuarioDTO usuarioDto)
        {
            if (usuarioDto.Id is null)
            {
                throw new ArgumentException("Usuário inválido para atualização.");
            }

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == usuarioDto.Id);

            if (usuario == null)
            {
                throw new KeyNotFoundException("Usuário não encontrado.");
            }

            usuario.Nome = usuarioDto.Nome;
            usuario.Telefone = usuarioDto.Telefone;
            usuario.Email = usuarioDto.Email;
            usuario.PerfilId = usuarioDto.PerfilId;
            usuario.EmpresaId = usuarioDto.EmpresaId;

            if (!string.IsNullOrWhiteSpace(usuarioDto.Senha))
            {
                usuario.Senha = PasswordHasher.HashPassword(usuarioDto.Senha);
            }

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
