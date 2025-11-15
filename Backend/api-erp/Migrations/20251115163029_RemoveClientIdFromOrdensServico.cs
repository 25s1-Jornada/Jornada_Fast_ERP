using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_erp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveClientIdFromOrdensServico : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "OrdensServico");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "OrdensServico",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
