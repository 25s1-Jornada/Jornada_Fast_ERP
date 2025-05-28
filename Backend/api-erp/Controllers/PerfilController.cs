using api_erp.DTOs;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerfilController : ControllerBase
    {
        private readonly IPerfilRepository _repository;
        public PerfilController(IPerfilRepository repository) => _repository = repository;

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
        public async Task<IActionResult> Post([FromBody] PerfilDTO model)
        {
            await _repository.AddAsync(model);
            await _repository.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] PerfilDTO model)
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
    }
}
