using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    // Read-only DTO: IDs e Enums como string
    public class OrdemServicoStringReadDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string? TecnicoId { get; set; }

        public DateTime DataAbertura { get; set; }
        public string? Status { get; set; }
        public string? Garantia { get; set; }
        public DateTime? DataFaturamento { get; set; }

        public string? Pedido { get; set; }
        public string? NumeroOS { get; set; }

        public List<string>? DescricaoDoChamadoIds { get; set; }
    }
}

