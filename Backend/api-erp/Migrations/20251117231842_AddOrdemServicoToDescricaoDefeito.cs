using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_erp.Migrations
{
    /// <inheritdoc />
    public partial class AddOrdemServicoToDescricaoDefeito : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DescricoesDoChamado_OrdensServico_OrdemServicoId",
                table: "DescricoesDoChamado");

            migrationBuilder.DropColumn(
                name: "OrdemId",
                table: "DescricoesDoChamado");

            migrationBuilder.AlterColumn<int>(
                name: "OrdemServicoId",
                table: "DescricoesDoChamado",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "OrdemServicoId",
                table: "DescricoesDefeito",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DescricoesDefeito_OrdemServicoId",
                table: "DescricoesDefeito",
                column: "OrdemServicoId");

            migrationBuilder.AddForeignKey(
                name: "FK_DescricoesDefeito_OrdensServico_OrdemServicoId",
                table: "DescricoesDefeito",
                column: "OrdemServicoId",
                principalTable: "OrdensServico",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DescricoesDoChamado_OrdensServico_OrdemServicoId",
                table: "DescricoesDoChamado",
                column: "OrdemServicoId",
                principalTable: "OrdensServico",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DescricoesDefeito_OrdensServico_OrdemServicoId",
                table: "DescricoesDefeito");

            migrationBuilder.DropForeignKey(
                name: "FK_DescricoesDoChamado_OrdensServico_OrdemServicoId",
                table: "DescricoesDoChamado");

            migrationBuilder.DropIndex(
                name: "IX_DescricoesDefeito_OrdemServicoId",
                table: "DescricoesDefeito");

            migrationBuilder.DropColumn(
                name: "OrdemServicoId",
                table: "DescricoesDefeito");

            migrationBuilder.AlterColumn<int>(
                name: "OrdemServicoId",
                table: "DescricoesDoChamado",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrdemId",
                table: "DescricoesDoChamado",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DescricoesDoChamado_OrdensServico_OrdemServicoId",
                table: "DescricoesDoChamado",
                column: "OrdemServicoId",
                principalTable: "OrdensServico",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
