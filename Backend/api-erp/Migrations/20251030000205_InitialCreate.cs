using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_erp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categoria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    TipoCategoria = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categoria", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DescricoesDefeito",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NumeroSerie = table.Column<string>(type: "TEXT", nullable: false),
                    Observacao = table.Column<string>(type: "TEXT", nullable: false),
                    Pendencia = table.Column<bool>(type: "INTEGER", nullable: true),
                    CategoriaId = table.Column<int>(type: "INTEGER", nullable: true),
                    DefeitosList = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DescricoesDefeito", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "endereco",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Logradouro = table.Column<string>(type: "TEXT", nullable: false),
                    Numero = table.Column<string>(type: "TEXT", nullable: true),
                    Bairro = table.Column<string>(type: "TEXT", nullable: true),
                    Cidade = table.Column<string>(type: "TEXT", nullable: true),
                    UF = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_endereco", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "perfil",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_perfil", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "produto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IdIntegracao = table.Column<int>(type: "INTEGER", nullable: true),
                    Sku = table.Column<string>(type: "TEXT", nullable: true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", nullable: true),
                    Preco = table.Column<decimal>(type: "TEXT", nullable: true),
                    CategoriaId = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_produto_categoria_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "categoria",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "empresa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Documento = table.Column<string>(type: "TEXT", nullable: true),
                    EnderecoId = table.Column<int>(type: "INTEGER", nullable: true),
                    TipoEmpresa = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Telefone = table.Column<string>(type: "TEXT", nullable: true),
                    Responsavel = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_empresa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_empresa_endereco_EnderecoId",
                        column: x => x.EnderecoId,
                        principalTable: "endereco",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "armario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    EmpresaId = table.Column<int>(type: "INTEGER", nullable: false),
                    UltimaVerificacao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_armario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_armario_empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresa",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Telefone = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Senha = table.Column<string>(type: "TEXT", nullable: false),
                    PerfilId = table.Column<int>(type: "INTEGER", nullable: true),
                    EmpresaId = table.Column<int>(type: "INTEGER", nullable: true),
                    EnderecoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_usuario_empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresa",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_usuario_endereco_EnderecoId",
                        column: x => x.EnderecoId,
                        principalTable: "endereco",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_usuario_perfil_PerfilId",
                        column: x => x.PerfilId,
                        principalTable: "perfil",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "estoque",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ArmarioId = table.Column<int>(type: "INTEGER", nullable: true),
                    ProdutoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantidade = table.Column<int>(type: "INTEGER", nullable: false),
                    UltimaMovimentacao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estoque", x => x.Id);
                    table.ForeignKey(
                        name: "FK_estoque_armario_ArmarioId",
                        column: x => x.ArmarioId,
                        principalTable: "armario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_estoque_produto_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "produto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "movimentacao_estoque",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProdutoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: true),
                    Quantidade = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmarioId = table.Column<int>(type: "INTEGER", nullable: true),
                    DataMovimentacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Observacao = table.Column<string>(type: "TEXT", nullable: true),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movimentacao_estoque", x => x.Id);
                    table.ForeignKey(
                        name: "FK_movimentacao_estoque_produto_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "produto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_movimentacao_estoque_usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuario",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OrdensServico",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClientId = table.Column<int>(type: "INTEGER", nullable: false),
                    EmpresaId = table.Column<int>(type: "INTEGER", nullable: false),
                    TecnicoId = table.Column<int>(type: "INTEGER", nullable: true),
                    DataAbertura = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: true),
                    GarantiaId = table.Column<int>(type: "INTEGER", nullable: true),
                    DataFaturamento = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Pedido = table.Column<string>(type: "TEXT", nullable: true),
                    NumeroOS = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdensServico", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdensServico_empresa_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresa",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdensServico_usuario_TecnicoId",
                        column: x => x.TecnicoId,
                        principalTable: "usuario",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "peca_qrcode",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Guid = table.Column<string>(type: "TEXT", nullable: false),
                    ProdutoId = table.Column<int>(type: "INTEGER", nullable: false),
                    MovimentacaoId = table.Column<int>(type: "INTEGER", nullable: true),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    DataGeracao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_peca_qrcode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_peca_qrcode_movimentacao_estoque_MovimentacaoId",
                        column: x => x.MovimentacaoId,
                        principalTable: "movimentacao_estoque",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_peca_qrcode_produto_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "produto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_peca_qrcode_usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConfirmacoesCliente",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Telefone = table.Column<string>(type: "TEXT", nullable: true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    Carimbo = table.Column<bool>(type: "INTEGER", nullable: false),
                    OrdemServicoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfirmacoesCliente", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfirmacoesCliente_OrdensServico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalTable: "OrdensServico",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Custos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    dataVisita = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TecnicoId = table.Column<int>(type: "INTEGER", nullable: true),
                    AjudanteName = table.Column<string>(type: "TEXT", nullable: false),
                    OrdemServicoId = table.Column<int>(type: "INTEGER", nullable: true),
                    ValorTotal = table.Column<double>(type: "REAL", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Custos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Custos_OrdensServico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalTable: "OrdensServico",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Custos_usuario_TecnicoId",
                        column: x => x.TecnicoId,
                        principalTable: "usuario",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DescricoesDoChamado",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NumeroSerie = table.Column<string>(type: "TEXT", nullable: true),
                    CategoriaId = table.Column<int>(type: "INTEGER", nullable: true),
                    Observacao = table.Column<string>(type: "TEXT", nullable: true),
                    OrdemId = table.Column<int>(type: "INTEGER", nullable: true),
                    OrdemServicoId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DescricoesDoChamado", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DescricoesDoChamado_OrdensServico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalTable: "OrdensServico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DescricoesDoChamado_categoria_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "categoria",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Deslocamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HrSaidaEmpresa = table.Column<DateTime>(type: "TEXT", nullable: true),
                    HrChegadaCliente = table.Column<DateTime>(type: "TEXT", nullable: true),
                    HrSaidaCliente = table.Column<DateTime>(type: "TEXT", nullable: true),
                    HrChegadaEmpresa = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalHoras = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalReais = table.Column<double>(type: "REAL", nullable: true),
                    IdOrdemServico = table.Column<int>(type: "INTEGER", nullable: true),
                    OrdemServicoId = table.Column<int>(type: "INTEGER", nullable: false),
                    CustoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deslocamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Deslocamentos_Custos_CustoId",
                        column: x => x.CustoId,
                        principalTable: "Custos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Deslocamentos_OrdensServico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalTable: "OrdensServico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HorasTrabalhadas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Inicio = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Termino = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TotalHoras = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalValor = table.Column<double>(type: "REAL", nullable: false),
                    IdOrdemServico = table.Column<int>(type: "INTEGER", nullable: true),
                    OrdemServicoId = table.Column<int>(type: "INTEGER", nullable: false),
                    CustoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorasTrabalhadas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HorasTrabalhadas_Custos_CustoId",
                        column: x => x.CustoId,
                        principalTable: "Custos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HorasTrabalhadas_OrdensServico_OrdemServicoId",
                        column: x => x.OrdemServicoId,
                        principalTable: "OrdensServico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Kms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    QntKm = table.Column<double>(type: "REAL", nullable: false),
                    ValorPorKm = table.Column<double>(type: "REAL", nullable: false),
                    CustoId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kms_Custos_CustoId",
                        column: x => x.CustoId,
                        principalTable: "Custos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Materiais",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CustoId = table.Column<int>(type: "INTEGER", nullable: true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    Quantidade = table.Column<double>(type: "REAL", nullable: false),
                    ValorUnitario = table.Column<double>(type: "REAL", nullable: false),
                    TotalValor = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materiais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Materiais_Custos_CustoId",
                        column: x => x.CustoId,
                        principalTable: "Custos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_armario_EmpresaId",
                table: "armario",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_ConfirmacoesCliente_OrdemServicoId",
                table: "ConfirmacoesCliente",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Custos_OrdemServicoId",
                table: "Custos",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Custos_TecnicoId",
                table: "Custos",
                column: "TecnicoId");

            migrationBuilder.CreateIndex(
                name: "IX_DescricoesDoChamado_CategoriaId",
                table: "DescricoesDoChamado",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_DescricoesDoChamado_OrdemServicoId",
                table: "DescricoesDoChamado",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Deslocamentos_CustoId",
                table: "Deslocamentos",
                column: "CustoId");

            migrationBuilder.CreateIndex(
                name: "IX_Deslocamentos_OrdemServicoId",
                table: "Deslocamentos",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_empresa_EnderecoId",
                table: "empresa",
                column: "EnderecoId");

            migrationBuilder.CreateIndex(
                name: "IX_estoque_ArmarioId",
                table: "estoque",
                column: "ArmarioId");

            migrationBuilder.CreateIndex(
                name: "IX_estoque_ProdutoId",
                table: "estoque",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_HorasTrabalhadas_CustoId",
                table: "HorasTrabalhadas",
                column: "CustoId");

            migrationBuilder.CreateIndex(
                name: "IX_HorasTrabalhadas_OrdemServicoId",
                table: "HorasTrabalhadas",
                column: "OrdemServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Kms_CustoId",
                table: "Kms",
                column: "CustoId");

            migrationBuilder.CreateIndex(
                name: "IX_Materiais_CustoId",
                table: "Materiais",
                column: "CustoId");

            migrationBuilder.CreateIndex(
                name: "IX_movimentacao_estoque_ProdutoId",
                table: "movimentacao_estoque",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_movimentacao_estoque_UsuarioId",
                table: "movimentacao_estoque",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensServico_EmpresaId",
                table: "OrdensServico",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensServico_TecnicoId",
                table: "OrdensServico",
                column: "TecnicoId");

            migrationBuilder.CreateIndex(
                name: "IX_peca_qrcode_Guid",
                table: "peca_qrcode",
                column: "Guid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_peca_qrcode_MovimentacaoId",
                table: "peca_qrcode",
                column: "MovimentacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_peca_qrcode_ProdutoId",
                table: "peca_qrcode",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_peca_qrcode_UsuarioId",
                table: "peca_qrcode",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_produto_CategoriaId",
                table: "produto",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_produto_IdIntegracao",
                table: "produto",
                column: "IdIntegracao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_produto_Sku",
                table: "produto",
                column: "Sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuario_Email",
                table: "usuario",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuario_EmpresaId",
                table: "usuario",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_EnderecoId",
                table: "usuario",
                column: "EnderecoId");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_PerfilId",
                table: "usuario",
                column: "PerfilId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfirmacoesCliente");

            migrationBuilder.DropTable(
                name: "DescricoesDefeito");

            migrationBuilder.DropTable(
                name: "DescricoesDoChamado");

            migrationBuilder.DropTable(
                name: "Deslocamentos");

            migrationBuilder.DropTable(
                name: "estoque");

            migrationBuilder.DropTable(
                name: "HorasTrabalhadas");

            migrationBuilder.DropTable(
                name: "Kms");

            migrationBuilder.DropTable(
                name: "Materiais");

            migrationBuilder.DropTable(
                name: "peca_qrcode");

            migrationBuilder.DropTable(
                name: "armario");

            migrationBuilder.DropTable(
                name: "Custos");

            migrationBuilder.DropTable(
                name: "movimentacao_estoque");

            migrationBuilder.DropTable(
                name: "OrdensServico");

            migrationBuilder.DropTable(
                name: "produto");

            migrationBuilder.DropTable(
                name: "usuario");

            migrationBuilder.DropTable(
                name: "categoria");

            migrationBuilder.DropTable(
                name: "empresa");

            migrationBuilder.DropTable(
                name: "perfil");

            migrationBuilder.DropTable(
                name: "endereco");
        }
    }
}
