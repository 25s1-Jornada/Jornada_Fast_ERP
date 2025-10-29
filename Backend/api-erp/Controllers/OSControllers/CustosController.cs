using api_erp.Models.OSModels;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers.OSControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustosController : ControllerBase
    {
        private readonly ICustoRepository _repo;

        public CustosController(ICustoRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var items = await _repo.GetAllAsync(includeRelacionamentos, ct);
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(id, includeRelacionamentos, ct);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Custo entity, CancellationToken ct = default)
        {
            var created = await _repo.AddAsync(entity, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id, includeRelacionamentos = true }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Custo entity, CancellationToken ct = default)
        {
            if (entity.Id is null || id != entity.Id) return BadRequest();
            var ok = await _repo.UpdateAsync(entity, ct);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
        {
            var ok = await _repo.DeleteAsync(id, ct);
            return ok ? NoContent() : NotFound();
        }
    }
}

