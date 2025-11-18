using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api_erp.Configurations;
using api_erp.Model;
using api_erp.Services.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api_erp.Services.Implementations
{
    public class JwtTokenService : ITokenService
    {
        private readonly JwtSettings _settings;

        public JwtTokenService(IOptions<JwtSettings> options)
        {
            _settings = options.Value ?? throw new ArgumentNullException(nameof(options));

            if (string.IsNullOrWhiteSpace(_settings.Secret))
            {
                throw new InvalidOperationException("JWT Secret não configurado.");
            }
        }

        public string GenerateToken(Usuario usuario)
        {
            ArgumentNullException.ThrowIfNull(usuario);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, usuario.Id?.ToString() ?? string.Empty),
                new(JwtRegisteredClaimNames.Email, usuario.Email),
                new(JwtRegisteredClaimNames.Name, usuario.Nome)
            };

            if (usuario.PerfilId.HasValue)
            {
                var role = !string.IsNullOrWhiteSpace(usuario.Perfil?.Nome)
                    ? usuario.Perfil!.Nome
                    : usuario.PerfilId.Value.ToString();

                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            if (usuario.EmpresaId.HasValue)
            {
                claims.Add(new Claim("empresaId", usuario.EmpresaId.Value.ToString()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_settings.ExpiresInMinutes);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
