using api_erp.DTOs;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using api_erp.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPerfilRepository _perfilRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IUsuarioRepository usuarioRepository, IPerfilRepository perfilRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _perfilRepository = perfilRepository;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Senha))
                {
                    return BadRequest("Email e senha são obrigatórios.");
                }

                var usuario = await _usuarioRepository.GetByEmailWithPerfilAsync(request.Email);
                if (usuario == null)
                {
                    return Unauthorized("Credenciais inválidas.");
                }

                var requiresReset = string.IsNullOrWhiteSpace(usuario.Senha) || usuario.Senha.Length != 64;

                if (!requiresReset && !SecurityHelper.VerifyPassword(request.Senha, usuario.Senha))
                {
                    return Unauthorized("Credenciais inválidas.");
                }

                var perfilNome = usuario.Perfil?.Nome;
                var token = GenerateJwtToken(usuario, perfilNome);

                var response = new LoginResponseDto
                {
                    Token = token,
                    Email = usuario.Email,
                    Nome = usuario.Nome,
                    UserId = usuario.Id?.ToString(),
                    RequiresPasswordReset = requiresReset,
                    PerfilId = usuario.PerfilId,
                    PerfilNome = perfilNome
                };

                return Ok(response);
            }
            catch(Exception ex)
            {
                throw ex;
            }
           
        }

        [Authorize]
        [HttpPost("first-password")]
        public async Task<IActionResult> SetFirstPassword([FromBody] NewPasswordDto payload)
        {
            if (payload == null || string.IsNullOrWhiteSpace(payload.NovaSenha))
            {
                return BadRequest("Senha é obrigatória.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Usuário inválido.");
            }

            var usuario = await _usuarioRepository.GetByIdAsync(userId);
            if (usuario == null)
            {
                return Unauthorized("Usuário inválido.");
            }

            var requiresReset = string.IsNullOrWhiteSpace(usuario.Senha) || usuario.Senha.Length != 64;
            if (!requiresReset)
            {
                return BadRequest("Senha já foi definida.");
            }

            var hashed = SecurityHelper.HashPassword(payload.NovaSenha);
            await _usuarioRepository.UpdatePasswordAsync(userId, hashed);
            await _usuarioRepository.SaveChangesAsync();

            return NoContent();
        }

        private string GenerateJwtToken(Usuario usuario, string? perfilNome)
        {

            try
            {
                var jwtSection = _configuration.GetSection("Jwt");
                var key = jwtSection["Key"] ?? string.Empty;

                if (string.IsNullOrWhiteSpace(key))
                {
                    throw new InvalidOperationException("Chave JWT não configurada.");
                }

                var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, usuario.Email),
                    new Claim("uid", usuario.Id?.ToString() ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                if (!string.IsNullOrWhiteSpace(perfilNome))
                {
                    claims.Add(new Claim(ClaimTypes.Role, perfilNome));
                }

                var expiresInMinutes = double.TryParse(jwtSection["ExpiresInMinutes"], out var minutes) ? minutes : 60d;

                var tokenDescriptor = new JwtSecurityToken(
                    issuer: jwtSection["Issuer"],
                    audience: jwtSection["Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
                    signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                );

                return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
            }
            catch(Exception ex)
            {
                throw ex;
            }
           
        }
    }
}
