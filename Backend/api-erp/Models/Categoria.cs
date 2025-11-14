using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("categoria")]
    public class Categoria
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("descricao")]
        public string? Descricao { get; set; }

        public ICollection<Produto>? Produtos { get; set; }
    }
}
