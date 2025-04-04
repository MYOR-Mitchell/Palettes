# Palettes 🎨

A backend service that lets you store, retrieve, and manage UI color palettes.  

## ✨ Features

- Add new palettes 
- Get all palettes 
- Get palette by ID 
- Get a random palette 
- Update palette 
- Delete palette 
- Delete **all** palettes  
  *(Intended for local resets/testing, but fire away if you'd like lol.)*
- Get formatted CSS from a palette ID   
  *(Returns all palette properties in `--var: value;` format to copy and paste into your stylesheets.)*

---

<br>

## 🌱 Optional Seeder 
  
Inside `Palettes.Data`, there's a `Seeder` folder containing `PaletteSeeder.cs`.

It includes 40 premade palettes that can be loaded into your database.  
By default, the seeder only runs **if the palette table is empty**. Intended to prevent populating a bunch of duplicates.

<br>

### 🔧 To enable the seeder:

Add this to `Program.cs` after `builder.Build()`:

```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PalettesDbContext>();
    await PaletteSeeder.SeedAsync(context);
}
```

<br>

### ⚙️ Want to remove the failsafe? 


By default, the seeder checks if the table already contains data before running:

```csharp
if (!context.Palettes.Any())
```

To force seeding even if data already exists, remove that condition and update your method like this:  
```csharp
public static async Task SeedAsync(PalettesDbContext context)
{
    var palettes = GetPaletteList();
    context.Palettes.AddRange(palettes);
    await context.SaveChangesAsync();
}
```
Now it will insert all 40 palettes regardless of what's already stored.

---
