using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class KMCreateDto
    {
        public double QntKm { get; set; }
        public double ValorPorKm { get; set; }
    }

    public class KMUpdateDto
    {
        public double QntKm { get; set; }
        public double ValorPorKm { get; set; }
    }

    public class KMReadDto
    {
        [Required]
        public int Id { get; set; }
        public double QntKm { get; set; }
        public double ValorPorKm { get; set; }
    }
}

