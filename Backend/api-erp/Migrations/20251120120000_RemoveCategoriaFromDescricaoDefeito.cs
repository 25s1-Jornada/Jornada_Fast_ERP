using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_erp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCategoriaFromDescricaoDefeito : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "DescricoesDefeito");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "DescricoesDefeito",
                type: "INTEGER",
                nullable: true);
        }
    }
}
