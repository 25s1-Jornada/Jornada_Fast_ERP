using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("armario")]
    public class Armario
    {
        public int? Id { get; set; }
        public string? Nome { get; set; }
        public int EmpresaId { get; set; }
        public DateTime? UltimaVerificacao { get; set; }

        public Empresa? Empresa { get; set; }
        public ICollection<Estoque>? Estoques { get; set; }
    }
}
