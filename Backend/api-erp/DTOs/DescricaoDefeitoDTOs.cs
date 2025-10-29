using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class DescricaoDefeitoCreateDto
    {
        public string? NumeroSerie { get; set; }
        public string? Observacao { get; set; }
        public bool? Pendencia { get; set; }
        public int? CategoriaId { get; set; }
        public List<int>? DefeitosList { get; set; }
    }

    public class DescricaoDefeitoUpdateDto
    {
        public string? NumeroSerie { get; set; }
        public string? Observacao { get; set; }
        public bool? Pendencia { get; set; }
        public int? CategoriaId { get; set; }
        public List<int>? DefeitosList { get; set; }
    }

    public class DescricaoDefeitoReadDto
    {
        [Required]
        public int Id { get; set; }
        public string? NumeroSerie { get; set; }
        public string? Observacao { get; set; }
        public bool? Pendencia { get; set; }
        public int? CategoriaId { get; set; }
        public List<int>? DefeitosList { get; set; }
    }
}

