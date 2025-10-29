using api_erp.Models.OSModels;
using api_erp.Mappers;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers.OSControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdensServicoController : ControllerBase
    {
        private readonly IOrdemServicoRepository _repo;
        private readonly ICustoRepository _custoRepo;

        public OrdensServicoController(IOrdemServicoRepository repo, ICustoRepository custoRepo)
        {
            _repo = repo;
            _custoRepo = custoRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var items = await _repo.GetAllAsync(includeRelacionamentos, ct);
            return Ok(items);
        }

        // Lista enriquecida para o Front (DTO)
        [HttpGet("lista")]
        public async Task<IActionResult> GetList([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var ordens = await _repo.GetAllAsync(includeRelacionamentos, ct);
            var custos = await _custoRepo.GetAllAsync(includeRelacionamentos: true, ct: ct);
            var custosLookup = custos.Where(c => c.OrdemServicoId.HasValue).ToLookup(c => c.OrdemServicoId!.Value);
            var dtos = ordens.Select(os => os.ToListDto(custosLookup[os.Id].FirstOrDefault()));
            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(id, includeRelacionamentos, ct);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrdemServico entity, CancellationToken ct = default)
        {
            var created = await _repo.AddAsync(entity, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id, includeRelacionamentos = true }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrdemServico entity, CancellationToken ct = default)
        {
            if (id != entity.Id) return BadRequest();
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
