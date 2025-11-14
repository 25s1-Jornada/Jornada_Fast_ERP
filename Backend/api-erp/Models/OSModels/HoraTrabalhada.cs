using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("hora_trabalhada")]
    public class HoraTrabalhada
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("inicio")]
        public DateTime Inicio { get; set; }

        [Column("termino")]
        public DateTime Termino { get; set; }

        [Column("total_horas")]
        public int TotalHoras { get; set; }

        [Column("total_valor")]
        public double TotalValor { get; set; }

        [Column("ordem_servico_id")]
        public int? IdOrdemServico { get; set; }
        public OrdemServico OrdemServico { get; set; } = default!;
    }
}
