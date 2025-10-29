using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class HoraTrabalhadaCreateDto
    {
        public DateTime Inicio { get; set; }
        public DateTime Termino { get; set; }
        public int TotalHoras { get; set; }
        public double TotalValor { get; set; }
        public int? IdOrdemServico { get; set; }
    }

    public class HoraTrabalhadaUpdateDto
    {
        public DateTime Inicio { get; set; }
        public DateTime Termino { get; set; }
        public int TotalHoras { get; set; }
        public double TotalValor { get; set; }
        public int? IdOrdemServico { get; set; }
    }

    public class HoraTrabalhadaReadDto
    {
        [Required]
        public int Id { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Termino { get; set; }
        public int TotalHoras { get; set; }
        public double TotalValor { get; set; }
        public int? IdOrdemServico { get; set; }
    }
}

