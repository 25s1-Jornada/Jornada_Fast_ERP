using System.ComponentModel.DataAnnotations.Schema;
using api_erp.Model;

namespace api_erp.Models.OSModels
{
    [Table("ordem_servico")]
    public class OrdemServico
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("client_id")]
        public int ClientId { get; set; }
        public Empresa Empresa { get; set; } = default!;

        [Column("tecnico_id")]
        public int? TecnicoId { get; set; }
        public Usuario Tecnico { get; set; } = default!;

        [Column("data_abertura")]
        public DateTime DataAbertura { get; set; }

        [Column("status_id")]
        public int? StatusId { get; set; }

        [Column("garantia_id")]
        public int? GarantiaId { get; set; }

        [Column("data_faturamento")]
        public DateTime? DataFaturamento { get; set; }

        [Column("pedido")]
        public string? Pedido { get; set; }

        [Column("numero_os")]
        public string? NumeroOS { get; set; }

        public List<DescricaoDoChamado> DescricaoDoChamadoList { get; set; } = new();
    }
}
