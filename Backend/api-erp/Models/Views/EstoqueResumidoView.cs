using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class EstoqueResumidoView
    {
        public int? ProdutoId { get; set; }
        public string? Produto { get; set; }
        public string? Sku { get; set; }
        public string? Descricao { get; set; }
        public int? TotalEstoque { get; set; }
    }
}
