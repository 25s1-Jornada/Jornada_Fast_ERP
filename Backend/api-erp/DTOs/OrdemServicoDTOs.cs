using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class OrdemServicoCreateDto
    {
        public int ClientId { get; set; }
        public int? TecnicoId { get; set; }
        public DateTime DataAbertura { get; set; }
        public int? StatusId { get; set; }
        public int? GarantiaId { get; set; }
        public DateTime? DataFaturamento { get; set; }
        public string? Pedido { get; set; }
        public string? NumeroOS { get; set; }
    }

    public class OrdemServicoUpdateDto
    {
        public int ClientId { get; set; }
        public int? TecnicoId { get; set; }
        public DateTime DataAbertura { get; set; }
        public int? StatusId { get; set; }
        public int? GarantiaId { get; set; }
        public DateTime? DataFaturamento { get; set; }
        public string? Pedido { get; set; }
        public string? NumeroOS { get; set; }
    }

    public class OrdemServicoReadDto
    {
        [Required]
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int? TecnicoId { get; set; }
        public DateTime DataAbertura { get; set; }
        public int? StatusId { get; set; }
        public int? GarantiaId { get; set; }
        public DateTime? DataFaturamento { get; set; }
        public string? Pedido { get; set; }
        public string? NumeroOS { get; set; }
        public List<int>? DescricaoDoChamadoIds { get; set; }
    }
}

