using api_erp.DTOs;
using api_erp.EntityConfig;
using api_erp.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Controllers.OSControllers
{
    [ApiController]
    [Route("api/os/empresas")]
    public class EmpresasOsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmpresasOsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OsEmpresaDto>>> GetAsync([FromQuery] string? tipo = null)
        {
            var normalizedTipo = NormalizeTipo(tipo);

            var query = _context.Empresas
                .Include(e => e.Endereco)
                .AsQueryable();

            if (!string.IsNullOrEmpty(normalizedTipo))
            {
                query = query.Where(e => (e.TipoEmpresa ?? string.Empty).ToLower() == normalizedTipo);
            }

            var entities = await query.OrderBy(e => e.Nome).ToListAsync();
            return entities.Select(MapToDto).ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OsEmpresaDto>> GetByIdAsync(int id)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Endereco)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return NotFound();
            return MapToDto(empresa);
        }

        [HttpPost]
        public async Task<ActionResult<OsEmpresaDto>> PostAsync([FromBody] OsEmpresaDto dto, [FromQuery] string? tipo = null)
        {
            var tipoFinal = NormalizeTipo(dto.TipoEmpresa ?? tipo) ?? "cliente";

            var empresa = new Empresa
            {
                Nome = dto.Nome,
                Cnpj = dto.Cnpj,
                Contato = dto.Contato,
                Telefone = dto.Telefone,
                Email = dto.Email,
                TipoEmpresa = tipoFinal,
                Endereco = BuildEndereco(dto)
            };

            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            return Created($"/api/os/empresas/{empresa.Id}", MapToDto(empresa));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] OsEmpresaDto dto, [FromQuery] string? tipo = null)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Endereco)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return NotFound();

            var tipoFinal = NormalizeTipo(dto.TipoEmpresa ?? tipo) ?? empresa.TipoEmpresa ?? "cliente";
            empresa.TipoEmpresa = tipoFinal;
            empresa.Nome = dto.Nome;
            empresa.Cnpj = dto.Cnpj;
            empresa.Contato = dto.Contato;
            empresa.Telefone = dto.Telefone;
            empresa.Email = dto.Email;

            if (empresa.Endereco == null)
            {
                empresa.Endereco = BuildEndereco(dto);
            }
            else
            {
                ApplyEnderecoValues(empresa.Endereco, dto);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Endereco)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return NotFound();

            var endereco = empresa.Endereco;
            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();

            if (endereco?.Id != null)
            {
                var stillInUse = await _context.Empresas.AnyAsync(e => e.EnderecoId == endereco.Id);
                if (!stillInUse)
                {
                    _context.Enderecos.Remove(endereco);
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }

        private static string? NormalizeTipo(string? tipo)
        {
            if (string.IsNullOrWhiteSpace(tipo)) return null;
            var normalized = tipo.Trim().ToLowerInvariant();
            return normalized switch
            {
                "cliente" => "cliente",
                "tecnico" => "tecnico",
                _ => null
            };
        }

        private static OsEmpresaDto MapToDto(Empresa empresa)
        {
            return new OsEmpresaDto
            {
                Id = empresa.Id,
                Nome = empresa.Nome,
                Cnpj = empresa.Cnpj,
                Contato = empresa.Contato,
                Telefone = empresa.Telefone,
                Email = empresa.Email,
                TipoEmpresa = empresa.TipoEmpresa,
                Endereco = empresa.Endereco?.Logradouro,
                Numero = empresa.Endereco?.Numero,
                Bairro = empresa.Endereco?.Bairro,
                Cidade = empresa.Endereco?.Cidade,
                Uf = empresa.Endereco?.UF
            };
        }

        private static Endereco BuildEndereco(OsEmpresaDto dto)
        {
            var endereco = new Endereco();
            ApplyEnderecoValues(endereco, dto);
            return endereco;
        }

        private static void ApplyEnderecoValues(Endereco endereco, OsEmpresaDto dto)
        {
            endereco.Logradouro = dto.Endereco ?? string.Empty;
            endereco.Numero = dto.Numero;
            endereco.Bairro = dto.Bairro;
            endereco.Cidade = dto.Cidade;
            endereco.UF = dto.Uf;
        }
    }
}
