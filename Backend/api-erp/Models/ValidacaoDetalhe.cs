using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models
{
    [Table("validacao_detalhes")]
    public class ValidacaoDetalhe
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("validacao_id")]
        public int ValidacaoId { get; set; }

        [Column("qr_code")]
        public string QrCode { get; set; } = string.Empty;

        [Column("produto_nome")]
        public string? ProdutoNome { get; set; }

        [Column("status")]
        public string Status { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Validacao? Validacao { get; set; }
    }
}
