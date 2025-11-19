using api_erp.DTOs;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using api_erp.Utils;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _repository;
        private readonly IPerfilRepository _perfilRepository;

        public UsuarioController(IUsuarioRepository repository, IPerfilRepository perfilRepository)
        {
            _repository = repository;
            _perfilRepository = perfilRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UsuarioDTO model)
        {
            // Gera senha aleatória, armazena hash e retorna a senha gerada na resposta
            var generatedPassword = SecurityHelper.GenerateRandomPassword();
            model.Senha = SecurityHelper.HashPassword(generatedPassword);

            await _repository.AddAsync(model);
            await _repository.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = model.Id }, new { model.Id, SenhaGerada = generatedPassword });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UsuarioDTO model)
        {
            if (id != model.Id) return BadRequest();
            await _repository.UpdateAsync(model);
            await _repository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();
            _repository.Delete(item);
            await _repository.SaveChangesAsync();
            return NoContent();
        }

        // Lista simplificada com filtro opcional por perfil (admin/tecnico/cliente)
        [HttpGet("lista")]
        public async Task<IActionResult> GetLista([FromQuery] string? perfil)
        {
            var usuarios = await _repository.GetAllAsync();
            var perfis = await _perfilRepository.GetAllAsync();

            var idToPerfil = perfis.ToDictionary(p => p.Id ?? 0, p => (p.Nome ?? string.Empty).Trim().ToLowerInvariant());
            var filtro = (perfil ?? string.Empty).Trim().ToLowerInvariant();

            var query = usuarios
                .Select(u => new UsuarioListDto
                {
                    Id = (u.Id ?? 0).ToString(),
                    Nome = u.Nome,
                    Email = u.Email,
                    EmpresaId = (u.EmpresaId ?? 0).ToString(),
                    Perfil = u.PerfilId.HasValue && idToPerfil.ContainsKey(u.PerfilId.Value) ? idToPerfil[u.PerfilId.Value] : null
                });

            if (!string.IsNullOrWhiteSpace(filtro))
            {
                query = query.Where(u => (u.Perfil ?? string.Empty) == filtro);
            }

            return Ok(query);
        }
    }

}
