using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Palettes.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Palettes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BaseClr = table.Column<string>(type: "text", nullable: true),
                    SectionClr = table.Column<string>(type: "text", nullable: true),
                    TextClr = table.Column<string>(type: "text", nullable: true),
                    SecondaryTextClr = table.Column<string>(type: "text", nullable: true),
                    AccentClr = table.Column<string>(type: "text", nullable: true),
                    LineClr = table.Column<string>(type: "text", nullable: true),
                    HoverClr = table.Column<string>(type: "text", nullable: true),
                    ShadowClr = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Palettes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Palettes");
        }
    }
}
