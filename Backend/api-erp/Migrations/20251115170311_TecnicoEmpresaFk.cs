using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_erp.Migrations
{
    /// <inheritdoc />
    public partial class TecnicoEmpresaFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrdensServico_usuario_TecnicoId",
                table: "OrdensServico");

            migrationBuilder.AddForeignKey(
                name: "FK_OrdensServico_empresa_TecnicoId",
                table: "OrdensServico",
                column: "TecnicoId",
                principalTable: "empresa",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrdensServico_empresa_TecnicoId",
                table: "OrdensServico");

            migrationBuilder.AddForeignKey(
                name: "FK_OrdensServico_usuario_TecnicoId",
                table: "OrdensServico",
                column: "TecnicoId",
                principalTable: "usuario",
                principalColumn: "Id");
        }
    }
}
