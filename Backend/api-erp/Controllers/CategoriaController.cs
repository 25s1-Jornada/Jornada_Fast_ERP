using api_erp.DTOs;
using api_erp.Model;
using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaRepository _repository;
        public CategoriaController(ICategoriaRepository repository) => _repository = repository;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repository.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CategoriaDTO categoria)
        {
            await _repository.AddAsync(categoria);
            await _repository.SaveChangesAsync();
            return Created(nameof(Get), categoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoriaDTO categoria)
        {
            if (id != categoria.Id) return BadRequest();
            _repository.Update(categoria);
            await _repository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item is null) return NotFound();
            _repository.Delete(item);
            await _repository.SaveChangesAsync();
            return NoContent();
        }
    }

}
