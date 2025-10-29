using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    // DTO de listagem para o Front: campos "amigáveis" e enriquecidos
    public class OrdemServicoListDto
    {
        [Required]
        public int Id { get; set; }

        public string? NumeroOS { get; set; }

        public int ClientId { get; set; }
        public string? ClienteNome { get; set; }

        public int? TecnicoId { get; set; }
        public string? TecnicoNome { get; set; }

        public DateTime DataAbertura { get; set; }
        public DateTime? DataVisita { get; set; }

        // Enums como string legível
        public string? Status { get; set; }
        public string? Garantia { get; set; }

        public DateTime? DataFaturamento { get; set; }
        public string? Pedido { get; set; }

        // Resumo (primeira categoria dos descritores do chamado)
        public string? CategoriaPrincipal { get; set; }

        // Total consolidado de custos (se disponível)
        public double? ValorTotal { get; set; }
    }
}

