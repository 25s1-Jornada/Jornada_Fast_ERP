namespace api_erp.Models.OSModels
{
    public class ConfirmacaoCliente
    {
        public int? Id { get; set; }
        public DateTime Data { get; set; }
        public string? Telefone { get; set; }
        public string? Nome { get; set; }
        public bool Carimbo { get; set; }

        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }
    }
}
