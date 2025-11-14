using System.ComponentModel.DataAnnotations.Schema;
using api_erp.Model;

namespace api_erp.Models.OSModels
{
    [Table("descricao_chamado")]
    public class DescricaoDoChamado
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("numero_serie")]
        public string? NumeroSerie { get; set; }

        [Column("categoria_id")]
        public int? CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        [Column("observacao")]
        public string? Observacao { get; set; }

        [Column("ordem_servico_id")]
        public int? OrdemId { get; set; }
        public OrdemServico OrdemServico { get; set; } = default!;
    }
}
