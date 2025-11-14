using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class PecasQrCodeDetalhadasView
    {
        public int? Id { get; set; }
        public string? Guid { get; set; }
        public string? Produto { get; set; }
        public string? Sku { get; set; }
        public string? Status { get; set; }
        public string? Armario { get; set; }
        public DateTime? DataGeracao { get; set; }
        public string? Tipo { get; set; }
    }
}
