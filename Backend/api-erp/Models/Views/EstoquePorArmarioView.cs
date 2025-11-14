using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class EstoquePorArmarioView
    {
        public int? ArmarioId { get; set; }
        public string? NomeArmario { get; set; }
        public string? TipoEmpresa { get; set; }
        public string? NomeEmpresa { get; set; }
        public string? DescricaoProduto { get; set; }
        public int? Quantidade { get; set; }
        public DateTime? UltimaMovimentacao { get; set; }
    }
}
