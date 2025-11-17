using api_erp.Models.OSModels;
using api_erp.Mappers;
using api_erp.Repositories.Interfaces.OSInterfaces;
using Microsoft.AspNetCore.Mvc;
using api_erp.DTOs;
using api_erp.Model;
using System;

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

        // Lista no formato "front" esperado pelo Next.js (ChamadosTable)
        [HttpGet("front-list")]
        public async Task<IActionResult> GetFrontList([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var ordens = await _repo.GetAllAsync(includeRelacionamentos, ct);
            var custos = await _custoRepo.GetAllAsync(includeRelacionamentos: true, ct: ct);
            var custosLookup = custos.Where(c => c.OrdemServicoId.HasValue).ToLookup(c => c.OrdemServicoId!.Value);
            var dtos = ordens.Select(os => os.ToFrontListDto(custosLookup[os.Id].FirstOrDefault()));
            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(id, includeRelacionamentos, ct);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrdemServicoCreateDto dto, CancellationToken ct = default)
        {
            var entity = dto.FromCreateDto();   
            // Vincular empresa apenas por ID (sem objeto aninhado)
            entity.Empresa = new Empresa { Id = dto.ClientId };
            if (entity.DataAbertura == default)
                entity.DataAbertura = DateTime.UtcNow;

            var created = await _repo.AddAsync(entity, ct);
            var read = created.ToReadDto();
            return CreatedAtAction(nameof(GetById), new { id = read.Id, includeRelacionamentos = true }, read);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrdemServicoUpdateDto dto, CancellationToken ct = default)
        {
            var entity = dto.FromUpdateDto(id);
            // Vincular empresa apenas por ID (sem objeto aninhado)
            entity.Empresa = new Empresa { Id = dto.ClientId };

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
