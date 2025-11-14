using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("endereco")]
    public class Endereco
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("logradouro")]
        public string Logradouro { get; set; } = string.Empty;

        [Column("numero")]
        public string? Numero { get; set; }

        [Column("bairro")]
        public string? Bairro { get; set; }

        [Column("cidade")]
        public string? Cidade { get; set; }

        [Column("uf")]
        public string? UF { get; set; }

        public ICollection<Empresa>? Empresas { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
    }
}
