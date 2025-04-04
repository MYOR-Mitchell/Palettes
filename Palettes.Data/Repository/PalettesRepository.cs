using Microsoft.EntityFrameworkCore;
using Palettes.Core.Interfaces;
using Palettes.Core.Models;
using Palettes.Data;

namespace Palettes.Data.Repository
{
    public class PalettesRepository : IPalettesRepository
    {
        private readonly PalettesDbContext _context;

        public PalettesRepository(PalettesDbContext context)
        {
            _context = context;
        }

        public async Task<List<Palette>> GetAllAsync()
        {
            return await _context.Palettes.ToListAsync();
        }

        public async Task<Palette?> GetByIdAsync(int id)
        {
            return await _context.Palettes.FindAsync(id);
        }

        public async Task AddAsync(Palette palette)
        {
            _context.Palettes.Add(palette);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Palette palette)
        {
            _context.Palettes.Update(palette);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var palette = await _context.Palettes.FindAsync(id);
            if(palette != null)
            {
                _context.Palettes.Remove(palette);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAllAsync()
        {
            var all = await _context.Palettes.ToListAsync();
            _context.Palettes.RemoveRange(all);
            await _context.SaveChangesAsync();
        }


        public async Task<Palette?> GetRandomAsync()
        {
            int count = await _context.Palettes.CountAsync();
            if(count == 0)
                return null;

            int skip = new Random().Next(count);
            return await _context.Palettes.Skip(skip).FirstOrDefaultAsync();
        }

    }
}