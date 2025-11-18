using api_erp.DTOs.Auth;
using api_erp.Repositories.Interfaces;
using api_erp.Security;
using api_erp.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITokenService _tokenService;

        public AuthController(IUsuarioRepository usuarioRepository, ITokenService tokenService)
        {
            _usuarioRepository = usuarioRepository;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (usuario == null || !PasswordHasher.VerifyPassword(request.Senha, usuario.Senha))
            {
                return Unauthorized(new { message = "E-mail ou senha inválidos." });
            }

            var token = _tokenService.GenerateToken(usuario);

            var response = new LoginResponseDTO
            {
                Token = token,
                Usuario = new UsuarioResumoDTO
                {
                    Id = usuario.Id ?? 0,
                    Nome = usuario.Nome,
                    Email = usuario.Email,
                    PerfilId = usuario.PerfilId,
                    PerfilNome = usuario.Perfil?.Nome,
                    EmpresaId = usuario.EmpresaId
                }
            };

            return Ok(response);
        }
    }
}
