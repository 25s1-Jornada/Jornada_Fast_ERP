using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("empresa")]
    public class Empresa
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;

        [Column("Documento")]
        public string? Cnpj { get; set; }

        public int? EnderecoId { get; set; }
        public string TipoEmpresa { get; set; } = "cliente"; //cliente (empresa) ou tecnico
        public string? Email { get; set; }
        public string? Telefone { get; set; }

        [Column("Responsavel")]
        public string? Contato { get; set; }

        public Endereco? Endereco { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
        public ICollection<Armario>? Armarios { get; set; }
    }
}
