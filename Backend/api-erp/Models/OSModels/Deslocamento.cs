using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("deslocamento")]
    public class Deslocamento
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("hr_saida_empresa")]
        public DateTime? HrSaidaEmpresa { get; set; }

        [Column("hr_chegada_cliente")]
        public DateTime? HrChegadaCliente { get; set; }

        [Column("hr_saida_cliente")]
        public DateTime? HrSaidaCliente { get; set; }

        [Column("hr_chegada_empresa")]
        public DateTime? HrChegadaEmpresa { get; set; }

        [Column("total_horas")]
        public DateTime? TotalHoras { get; set; }

        [Column("total_reais")]
        public double? TotalReais { get; set; }

        [Column("ordem_servico_id")]
        public int? IdOrdemServico { get; set; }
        public OrdemServico OrdemServico { get; set; } = default!;
    }
}
