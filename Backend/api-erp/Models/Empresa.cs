using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("empresa")]
    public class Empresa
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("cnpj")]
        public string? Cnpj { get; set; }

        [Column("endereco_id")]
        public int? EnderecoId { get; set; }

        [Column("tipo_empresa")]
        public string TipoEmpresa { get; set; } = "cliente";

        [Column("email")]
        public string? Email { get; set; }

        public Endereco? Endereco { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
        public ICollection<Armario>? Armarios { get; set; }
    }
}
