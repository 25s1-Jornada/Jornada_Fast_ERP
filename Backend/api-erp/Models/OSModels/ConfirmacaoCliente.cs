using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("confirmacao_cliente")]
    public class ConfirmacaoCliente
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("data")]
        public DateTime Data { get; set; }

        [Column("telefone")]
        public string? Telefone { get; set; }

        [Column("nome")]
        public string? Nome { get; set; }

        [Column("carimbo")]
        public bool Carimbo { get; set; }

        [Column("ordem_servico_id")]
        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }
    }
}
