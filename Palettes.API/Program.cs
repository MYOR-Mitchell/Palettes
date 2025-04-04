using Palettes.Core.Interfaces;
using Palettes.Data;
using Microsoft.EntityFrameworkCore;
using Palettes.Data.Repository;
using Palettes.Data.Seed;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PalettesDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IPalettesRepository, PalettesRepository>();

var app = builder.Build();

using(var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PalettesDbContext>();
    await PaletteSeeder.SeedAsync(context);
}


if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
