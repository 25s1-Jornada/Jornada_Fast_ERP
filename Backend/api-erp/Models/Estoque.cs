using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("estoque")]
    public class Estoque
    {
        public int? Id { get; set; }
        public int? ArmarioId { get; set; }
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; } = 0;
        public DateTime? UltimaMovimentacao { get; set; }

        public Produto? Produto { get; set; }
        public Armario? Armario { get; set; }
    }
}
