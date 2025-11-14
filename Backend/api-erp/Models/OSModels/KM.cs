using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("km")]
    public class KM
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("qnt_km")]
        public double QntKm { get; set; }

        [Column("valor_por_km")]
        public double ValorPorKm { get; set; }
    }
}
