using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("peca_qrcode")]
    public class PecaQrCode
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("guid")]
        public string Guid { get; set; } = string.Empty;

        [Column("produto_id")]
        public int ProdutoId { get; set; }

        [Column("movimentacao_id")]
        public int? MovimentacaoId { get; set; }

        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Column("status")]
        public string Status { get; set; } = "GERADO";

        [Column("data_geracao")]
        public DateTime? DataGeracao { get; set; }

        public Produto? Produto { get; set; }
        public MovimentacaoEstoque? Movimentacao { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
