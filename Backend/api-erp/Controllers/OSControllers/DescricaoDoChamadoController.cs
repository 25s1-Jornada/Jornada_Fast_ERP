using api_erp.DTOs;
using api_erp.Mappers;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers.OSControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DescricoesDoChamadoController : ControllerBase
    {
        private readonly IDescricaoDoChamadoRepository _repo;

        public DescricoesDoChamadoController(IDescricaoDoChamadoRepository repo)
        {
            _repo = repo;
        }

        // GET: api/DescricoesDoChamado?includeRelacionamentos=true
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DescricaoDoChamadoReadDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool includeRelacionamentos = true,
            CancellationToken ct = default)
        {
            var entities = await _repo.GetAllAsync(includeRelacionamentos, ct);
            var dtos = entities.Select(e => e.ToReadDto()).ToList();
            return Ok(dtos);
        }

        // GET: api/DescricoesDoChamado/5?includeRelacionamentos=true
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(DescricaoDoChamadoReadDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(
            int id,
            [FromQuery] bool includeRelacionamentos = true,
            CancellationToken ct = default)
        {
            var entity = await _repo.GetByIdAsync(id, includeRelacionamentos, ct);
            if (entity == null) return NotFound();

            return Ok(entity.ToReadDto());
        }

        // POST: api/DescricoesDoChamado
        [HttpPost]
        [ProducesResponseType(typeof(DescricaoDoChamadoReadDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create(
            [FromBody] DescricaoDoChamadoCreateDto dto,
            CancellationToken ct = default)
        {
            var entity = dto.FromCreateDto();
            var created = await _repo.AddAsync(entity, ct);
            var read = created.ToReadDto();

            return CreatedAtAction(
                nameof(GetById),
                new { id = read.Id, includeRelacionamentos = true },
                read
            );
        }

        // PUT: api/DescricoesDoChamado/5
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] DescricaoDoChamadoUpdateDto dto,
            CancellationToken ct = default)
        {
            var entity = dto.FromUpdateDto(id);

            var ok = await _repo.UpdateAsync(entity, ct);
            if (!ok) return NotFound();

            return NoContent();
        }

        // DELETE: api/DescricoesDoChamado/5
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(
            int id,
            CancellationToken ct = default)
        {
            var ok = await _repo.DeleteAsync(id, ct);
            if (!ok) return NotFound();

            return NoContent();
        }
    }
}
