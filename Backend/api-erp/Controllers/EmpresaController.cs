using api_erp.DTOs;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaRepository _repository;
        public EmpresaController(IEmpresaRepository repository) => _repository = repository;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? tipo)
        {
            var result = await _repository.GetAllAsync();
            if (!string.IsNullOrWhiteSpace(tipo))
            {
                var tipoLower = tipo.Trim().ToLowerInvariant();
                result = result.Where(e => (e.TipoEmpresa ?? string.Empty).ToLowerInvariant() == tipoLower);
            }
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
        public async Task<IActionResult> Post([FromBody] EmpresaDTO model)
        {
            await _repository.AddAsync(model);
            await _repository.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] EmpresaDTO model)
        {
            if (id != model.Id) return BadRequest();
            _repository.Update(model);
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

        // Lista com shape alinhado ao Front (snake_case e campos esperados)
        [HttpGet("lista")]
        public async Task<IActionResult> GetLista([FromQuery] string? tipo)
        {
            var all = await _repository.GetAllAsync();
            if (!string.IsNullOrWhiteSpace(tipo))
            {
                var tipoLower = tipo.Trim().ToLowerInvariant();
                all = all.Where(e => (e.TipoEmpresa ?? string.Empty).ToLowerInvariant() == tipoLower);
            }

            var dtos = all.Select(e => new EmpresaListDto
            {
                Id = e.Id?.ToString(),
                Nome = e.Nome,
                Cnpj = e.Cnpj,
                EnderecoId = e.EnderecoId?.ToString(),
                Endereco = e.Endereco == null ? null : new EnderecoDto
                {
                    Id = e.Endereco.Id?.ToString(),
                    Logradouro = e.Endereco.Logradouro,
                    Numero = e.Endereco.Numero,
                    Bairro = e.Endereco.Bairro,
                    Cidade = e.Endereco.Cidade,
                    Uf = e.Endereco.UF
                },
                TipoEmpresa = e.TipoEmpresa,
                Email = e.Email,
                CreatedAt = null,
                UpdatedAt = null
            });

            return Ok(dtos);
        }
    }

}
