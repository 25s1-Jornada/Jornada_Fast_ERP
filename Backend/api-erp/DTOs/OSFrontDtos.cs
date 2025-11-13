using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class OsFrontPessoaDto
    {
        public string Id { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
    }

    public class OsFrontDescricaoDto
    {
        public string Id { get; set; } = string.Empty;
        public string NumeroSerie { get; set; } = string.Empty;
        public string Defeito { get; set; } = string.Empty;
        public string? Observacao { get; set; }
    }

    public class OsFrontChamadoDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        public OsFrontPessoaDto Cliente { get; set; } = new();
        public OsFrontPessoaDto Tecnico { get; set; } = new();

        public string DataAbertura { get; set; } = string.Empty;
        public string? DataVisita { get; set; }

        public string Status { get; set; } = string.Empty;
        public string? Pedido { get; set; }
        public string? DataFaturamento { get; set; }
        public string? Garantia { get; set; }

        public List<OsFrontDescricaoDto> Descricoes { get; set; } = new();

        public string ValorTotal { get; set; } = "R$ 0,00";
    }
}

