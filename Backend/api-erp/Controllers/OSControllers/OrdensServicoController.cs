using api_erp.Models.OSModels;
using api_erp.Mappers;
using api_erp.Repositories.Interfaces.OSInterfaces;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using api_erp.DTOs;
using api_erp.Model;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api_erp.Controllers.OSControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdensServicoController : ControllerBase
    {
        private readonly IOrdemServicoRepository _repo;
        private readonly ICustoRepository _custoRepo;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPerfilRepository _perfilRepository;

        public OrdensServicoController(IOrdemServicoRepository repo, ICustoRepository custoRepo, IUsuarioRepository usuarioRepository, IPerfilRepository perfilRepository)
        {
            _repo = repo;
            _custoRepo = custoRepo;
            _usuarioRepository = usuarioRepository;
            _perfilRepository = perfilRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var items = await _repo.GetAllAsync(includeRelacionamentos, ct);
            var filtered = await FiltrarPorPerfilAsync(items);
            return Ok(filtered);
        }

        // Lista enriquecida para o Front (DTO)
        [HttpGet("lista")]
        public async Task<IActionResult> GetList([FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var ordens = await _repo.GetAllAsync(includeRelacionamentos, ct);
            ordens = await FiltrarPorPerfilAsync(ordens);
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
            ordens = await FiltrarPorPerfilAsync(ordens);
            var custos = await _custoRepo.GetAllAsync(includeRelacionamentos: true, ct: ct);
            var custosLookup = custos.Where(c => c.OrdemServicoId.HasValue).ToLookup(c => c.OrdemServicoId!.Value);
            var dtos = ordens.Select(os => os.ToFrontListDto(custosLookup[os.Id].FirstOrDefault()));
            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] bool includeRelacionamentos = true, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(id, includeRelacionamentos, ct);
            var filtrado = await FiltrarPorPerfilAsync(item is null ? new List<OrdemServico>() : new List<OrdemServico> { item });
            var unico = filtrado.FirstOrDefault();
            return unico is null ? NotFound() : Ok(unico);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrdemServicoCreateDto dto, CancellationToken ct = default)
        {
            var (_, _, proibidoCriar) = await ObterUsuarioAsync();
            if (proibidoCriar)
            {
                return Forbid("Apenas administradores podem criar OS.");
            }

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
            var (usuario, role, _) = await ObterUsuarioAsync();
            var osDb = await _repo.GetByIdAsync(id, includeRelacionamentos: false, ct: ct);
            if (osDb == null) return NotFound();

            if (string.Equals(role, "cliente", StringComparison.OrdinalIgnoreCase) && usuario?.EmpresaId is int empId)
            {
                if (osDb.EmpresaId != empId)
                {
                    return Forbid("Cliente só pode editar OS da sua empresa.");
                }
            }

            if (string.Equals(role, "tecnico", StringComparison.OrdinalIgnoreCase) && usuario?.EmpresaId is int tecId)
            {
                if (osDb.TecnicoId != tecId)
                {
                    return Forbid("Técnico só pode editar OS atribuída a ele.");
                }
            }

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

        private async Task<List<OrdemServico>> FiltrarPorPerfilAsync(IEnumerable<OrdemServico> ordens)
        {
            var (usuario, perfilNome, _) = await ObterUsuarioAsync();

            var isAdmin = string.Equals(perfilNome, "Administrador", StringComparison.OrdinalIgnoreCase);
            var isTecnico = string.Equals(perfilNome, "Tecnico", StringComparison.OrdinalIgnoreCase);
            var isCliente = string.Equals(perfilNome, "Cliente", StringComparison.OrdinalIgnoreCase);

            if (isAdmin)
            {
                return ordens.ToList();
            }

            if (isCliente && usuario.EmpresaId.HasValue)
            {
                var empresaId = usuario.EmpresaId.Value;
                return ordens.Where(o => o.EmpresaId == empresaId).ToList();
            }

            if (isTecnico && usuario.EmpresaId.HasValue)
            {
                var tecnicoEmpresaId = usuario.EmpresaId.Value;
                return ordens.Where(o => o.TecnicoId == tecnicoEmpresaId).ToList();
            }

            // padrão: se perfil desconhecido, negar acesso
            return new List<OrdemServico>();
        }

        private async Task<(Usuario? usuario, string? perfilNome, bool proibidoCriar)> ObterUsuarioAsync()
        {
            var identity = HttpContext.User;
            var email = identity.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrWhiteSpace(email))
            {
                return (null, null, true);
            }

            var usuario = await _usuarioRepository.GetByEmailWithPerfilAsync(email);
            string? perfilNome = usuario?.Perfil?.Nome?.Trim();
            var isAdmin = string.Equals(perfilNome, "Administrador", StringComparison.OrdinalIgnoreCase);
            var proibidoCriar = !isAdmin;
            return (usuario, perfilNome, proibidoCriar);
        }
    }
}
