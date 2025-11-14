using api_erp.DTOs;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValidacaoController : ControllerBase
    {
        private readonly IValidacaoRepository _repository;

        public ValidacaoController(IValidacaoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? status, [FromQuery] int? armarioId)
        {
            var result = await _repository.GetAllAsync(status, armarioId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        [HttpGet("{id:int}/detalhes")]
        public async Task<IActionResult> GetDetalhes(int id)
        {
            var detalhes = await _repository.GetDetalhesAsync(id);
            return Ok(detalhes);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ValidacaoDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var entity = await _repository.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] ValidacaoDTO dto)
        {
            if (dto.Id != id) return BadRequest("Id inconsistente.");
            try
            {
                await _repository.UpdateAsync(dto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _repository.DeleteAsync(id);
            if (!removed) return NotFound();
            return NoContent();
        }

        [HttpPost("{id:int}/detalhes")]
        public async Task<IActionResult> AppendDetalhes(int id, [FromBody] IEnumerable<ValidacaoDetalheDTO> detalhes)
        {
            var detalhesList = detalhes?.ToList();
            if (detalhesList == null || !detalhesList.Any())
            {
                return BadRequest("Informe ao menos um detalhe.");
            }

            await _repository.AddDetalhesAsync(id, detalhesList);
            return NoContent();
        }
    }
}
