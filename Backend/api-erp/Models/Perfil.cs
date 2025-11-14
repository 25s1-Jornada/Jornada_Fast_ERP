using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("perfil")]
    public class Perfil
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        public ICollection<Usuario>? Usuarios { get; set; }
    }
}
