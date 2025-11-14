using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class MovimentacaoDetalhadaView
    {
        public int? Id { get; set; }
        public int? MovimentacaoId { get; set; }
        public string? QrCode { get; set; }
        public string? Produto { get; set; }
        public string? Sku { get; set; }
        public string? Armario { get; set; }
        public string? Status { get; set; }
        public DateTime? DataGeracao { get; set; }
        public DateTime? DataMovimentacao { get; set; }
        public string? Tipo { get; set; }
        public int? Quantidade { get; set; }
        public string? Observacao { get; set; }
        public string? Usuario { get; set; }
    }
}
