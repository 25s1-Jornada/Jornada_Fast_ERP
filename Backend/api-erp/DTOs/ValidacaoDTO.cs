namespace api_erp.DTOs
{
    public class ValidacaoDetalheDTO
    {
        public int? Id { get; set; }
        public string QrCode { get; set; } = string.Empty;
        public string? ProdutoNome { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ValidacaoDTO
    {
        public int? Id { get; set; }
        public string Status { get; set; } = "PENDENTE";
        public DateTime? DataValidacao { get; set; }
        public int? ArmarioId { get; set; }
        public int? UsuarioId { get; set; }
        public string? Observacoes { get; set; }
        public int? TotalConfirmadas { get; set; }
        public int? TotalPendentes { get; set; }
        public int? TotalNaoEncontradas { get; set; }
        public int? TotalExecucoes { get; set; }
        public double? TempoExecucaoSegundos { get; set; }
        public List<ValidacaoDetalheDTO> Detalhes { get; set; } = new();
    }
}
