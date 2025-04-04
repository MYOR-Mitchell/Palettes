using Palettes.Core.Models;

namespace Palettes.Core.Interfaces
{
    public interface IPalettesRepository
    {
        Task<List<Palette>> GetAllAsync();
        Task<Palette?> GetByIdAsync(int id);
        Task AddAsync(Palette palette);
        Task UpdateAsync(Palette palette);
        Task DeleteAsync(int id);
        Task DeleteAllAsync();
        Task<Palette?> GetRandomAsync();
    }
}
