using Microsoft.AspNetCore.Mvc;
using Palettes.Core.Interfaces;
using Palettes.Core.Models;

namespace PalettesAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PalettesController : ControllerBase
    {
        private readonly IPalettesRepository _repository;

        public PalettesController(IPalettesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Palette>>> GetAll()
        {
            var palettes = await _repository.GetAllAsync();
            return Ok(palettes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Palette>> Get(int id)
        {
            var palette = await _repository.GetByIdAsync(id);
            if(palette == null)
                return NotFound();
            return Ok(palette);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Palette palette)
        {
            await _repository.AddAsync(palette);
            return CreatedAtAction(nameof(Get), new { id = palette.Id }, palette);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] Palette palette)
        {
            if(id != palette.Id)
                return BadRequest();
            await _repository.UpdateAsync(palette);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAll()
        {
            await _repository.DeleteAllAsync();
            return NoContent();
        }

        [HttpGet("random")]
        public async Task<ActionResult<Palette>> GetRandom()
        {
            var palette = await _repository.GetRandomAsync();
            if(palette == null)
                return NotFound();
            return palette;
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("pong");
        }

        [HttpGet("{id}/css")]
        public async Task<ActionResult> GetPaletteCss(int id)
        {
            var palette = await _repository.GetByIdAsync(id);
            if(palette == null)
                return NotFound();

            var css = $@"
--base-clr: {palette.BaseClr};
--section-clr: {palette.SectionClr};
--text-clr: {palette.TextClr};
--secondary-text-clr: {palette.SecondaryTextClr};
--accent-clr: {palette.AccentClr};
--line-clr: {palette.LineClr};
--hover-clr: {palette.HoverClr};
--shadow-clr: {palette.ShadowClr};";

            return Content(css.Trim(), "text/plain");
        }
    }
}
