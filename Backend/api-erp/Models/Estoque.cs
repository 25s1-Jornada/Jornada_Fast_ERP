using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("estoque")]
    public class Estoque
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("armario_id")]
        public int? ArmarioId { get; set; }

        [Column("produto_id")]
        public int ProdutoId { get; set; }

        [Column("quantidade")]
        public int Quantidade { get; set; } = 0;

        [Column("ultima_movimentacao")]
        public DateTime? UltimaMovimentacao { get; set; }

        public Produto? Produto { get; set; }
        public Armario? Armario { get; set; }
    }
}
