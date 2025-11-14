using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("produto")]
    public class Produto
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("id_integracao")]
        public int? IdIntegracao { get; set; }

        [Column("sku")]
        public string? Sku { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("descricao")]
        public string? Descricao { get; set; }

        [Column("preco")]
        public decimal? Preco { get; set; }

        [Column("categoria_id")]
        public int? CategoriaId { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        public Categoria? Categoria { get; set; }
        public ICollection<MovimentacaoEstoque>? Movimentacoes { get; set; }
        public ICollection<PecaQrCode>? PecasQrCode { get; set; }
        public ICollection<Estoque>? Estoques { get; set; }
    }
}
