using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("armario")]
    public class Armario
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("nome")]
        public string? Nome { get; set; }

        [Column("empresa_id")]
        public int EmpresaId { get; set; }

        [Column("ultima_verificacao")]
        public DateTime? UltimaVerificacao { get; set; }

        public Empresa? Empresa { get; set; }
        public ICollection<Estoque>? Estoques { get; set; }
    }
}
