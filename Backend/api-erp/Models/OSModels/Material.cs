using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("material")]
    public class Material
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("custo_id")]
        public int? CustoId { get; set; }
        public Custo? Custo { get; set; }

        [Column("nome")]
        public string? Nome { get; set; }

        [Column("quantidade")]
        public double Quantidade { get; set; }

        [Column("valor_unitario")]
        public double ValorUnitario { get; set; }

        [Column("total_valor")]
        public double TotalValor { get; set; }
    }
}
