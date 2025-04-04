using Microsoft.EntityFrameworkCore;
using Palettes.Core.Models;

namespace Palettes.Data
{
    public class PalettesDbContext : DbContext
    {
        public PalettesDbContext(DbContextOptions<PalettesDbContext> options)
            : base(options)
        {
        }

        public DbSet<Palette> Palettes { get; set; }
    }
}

