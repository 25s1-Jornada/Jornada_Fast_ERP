using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class MovimentacaoMensalView
    {
        public int? ProdutoId { get; set; }
        public string? Produto { get; set; }
        public string? Mes { get; set; }
        public int? TotalEntrada { get; set; }
        public int? TotalSaida { get; set; }
    }
}
