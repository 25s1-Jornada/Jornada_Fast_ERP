using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Models.OSModels
{
    [Table("descricao_defeito")]
    public class DescricaoDefeito
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("numero_serie")]
        public string NumeroSerie { get; set; } = string.Empty;

        [Column("observacao")]
        public string Observacao { get; set; } = string.Empty;

        [Column("pendencia")]
        public bool? Pendencia { get; set; }

        [Column("categoria_id")]
        public int? CategoriaId { get; set; }

        [Column("defeitos_list")]
        public List<int> DefeitosList { get; set; } = new();
    }
}
