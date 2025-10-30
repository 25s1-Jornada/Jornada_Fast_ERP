using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class CategoriaDTO
    {
        public int? Id { get; set; }
        [Required]
        public string Nome { get; set; }
        public string? Descricao { get; set; }
        [Required]
        public string TipoCategoria { get; set; }
    }
}
