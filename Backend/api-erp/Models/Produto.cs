using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("produto")]
    public class Produto
    {
        public int? Id { get; set; }
        public int? IdIntegracao { get; set; }
        public string? Sku { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public decimal? Preco { get; set; }
        public int? CategoriaId { get; set; }
        public bool Status { get; set; } = true;

        public Categoria? Categoria { get; set; }
        public ICollection<MovimentacaoEstoque>? Movimentacoes { get; set; }
        public ICollection<PecaQrCode>? PecasQrCode { get; set; }
        public ICollection<Estoque>? Estoques { get; set; }
    }
}
