using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("movimentacao_estoque")]
    public class MovimentacaoEstoque
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("produto_id")]
        public int ProdutoId { get; set; }

        [Column("tipo")]
        public string? Tipo { get; set; }

        [Column("quantidade")]
        public int Quantidade { get; set; }

        [Column("armario_id")]
        public int? ArmarioId { get; set; }

        [Column("data_movimentacao")]
        public DateTime? DataMovimentacao { get; set; }

        [Column("observacao")]
        public string? Observacao { get; set; }

        [Column("usuario_id")]
        public int? UsuarioId { get; set; }

        public Produto? Produto { get; set; }
        public Usuario? Usuario { get; set; }
        public Armario? Armario { get; set; }
    }
}
