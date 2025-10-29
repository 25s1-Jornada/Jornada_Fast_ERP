using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    // DTO de listagem para o Front: campos "amigáveis" e enriquecidos
    public class OrdemServicoListDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        public string? NumeroOS { get; set; }

        public string ClientId { get; set; } = string.Empty;
        public string? ClienteNome { get; set; }

        public string? TecnicoId { get; set; }
        public string? TecnicoNome { get; set; }

        public string DataAbertura { get; set; } = string.Empty;
        public string? DataVisita { get; set; }

        // Enums como string legível
        public string? Status { get; set; }
        public string? Garantia { get; set; }

        public string? DataFaturamento { get; set; }
        public string? Pedido { get; set; }

        // Resumo (primeira categoria dos descritores do chamado)
        public string? CategoriaPrincipal { get; set; }
        public string? Defeito { get; set; }

        // Total consolidado de custos (se disponível)
        public string? ValorTotal { get; set; }
    }
}

