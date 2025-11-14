using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{


    public class DescricaoDoChamadoCreateDto
    {
        public string? NumeroSerie { get; set; }
        public int? CategoriaId { get; set; }
        public string? Observacao { get; set; }
        public int? OrdemId { get; set; }
    }

    public class DescricaoDoChamadoUpdateDto
    {
        public string? NumeroSerie { get; set; }
        public int? CategoriaId { get; set; }
        public string? Observacao { get; set; }
        public int? OrdemId { get; set; }
    }

    public class DescricaoDoChamadoReadDto
    {
        [Required]
        public int Id { get; set; }
        public string? NumeroSerie { get; set; }
        public int? CategoriaId { get; set; }
        public string? Observacao { get; set; }
        public int? OrdemId { get; set; }
    }
}
