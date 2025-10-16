using System.Security.Cryptography;
using api_erp.Models;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagensController : ControllerBase
    {
        private readonly IImagemRepository _repo;

        public ImagensController(IImagemRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var items = await _repo.GetAllAsync(ct);
            return Ok(items.Select(i => new { i.Id, i.FileName, i.ContentType, i.LengthBytes, i.CreatedAtUtc, i.Titulo, i.Descricao, i.OrdemServicoId, i.DescricaoDoChamadoId }));
        }

        [HttpGet("por-os/{ordemId:int}")]
        public async Task<IActionResult> GetByOrdem(int ordemId, CancellationToken ct)
        {
            var items = await _repo.GetByOrdemServicoAsync(ordemId, ct);
            return Ok(items.Select(i => new { i.Id, i.FileName, i.ContentType, i.LengthBytes, i.CreatedAtUtc, i.Titulo, i.Descricao }));
        }

        [HttpGet("por-descricao/{descricaoId:int}")]
        public async Task<IActionResult> GetByDescricao(int descricaoId, CancellationToken ct)
        {
            var items = await _repo.GetByDescricaoDoChamadoAsync(descricaoId, ct);
            return Ok(items.Select(i => new { i.Id, i.FileName, i.ContentType, i.LengthBytes, i.CreatedAtUtc, i.Titulo, i.Descricao }));
        }

        [HttpGet("{id:long}/download")]
        public async Task<IActionResult> Download(long id, CancellationToken ct)
        {
            var img = await _repo.GetByIdAsync(id, ct);
            if (img == null) return NotFound();
            return File(img.Data, img.ContentType, img.FileName);
        }

        [HttpPost("upload")]
        [RequestSizeLimit(50_000_000)]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] int? ordemServicoId, [FromForm] int? descricaoDoChamadoId, [FromForm] string? titulo, [FromForm] string? descricao, CancellationToken ct)
        {
            if (file == null || file.Length == 0) return BadRequest("Arquivo ausente");
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, ct);
            var data = ms.ToArray();
            var sha = SHA256.HashData(data);

            var entity = new Imagem
            {
                FileName = file.FileName,
                ContentType = file.ContentType ?? "application/octet-stream",
                LengthBytes = file.Length,
                Data = data,
                Sha256 = sha,
                CreatedAtUtc = DateTime.UtcNow,
                Titulo = titulo,
                Descricao = descricao,
                OrdemServicoId = ordemServicoId,
                DescricaoDoChamadoId = descricaoDoChamadoId
            };

            var created = await _repo.AddAsync(entity, ct);
            return CreatedAtAction(nameof(Download), new { id = created.Id }, new { created.Id, created.FileName, created.ContentType, created.LengthBytes });
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id, CancellationToken ct)
        {
            var ok = await _repo.DeleteAsync(id, ct);
            return ok ? NoContent() : NotFound();
        }
    }
}

