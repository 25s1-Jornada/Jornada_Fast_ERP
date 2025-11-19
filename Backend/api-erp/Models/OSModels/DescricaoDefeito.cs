namespace api_erp.Models.OSModels
{
    public class DescricaoDefeito
    {
        public int? Id { get; set; }

        public string NumeroSerie { get; set; }
        public string Observacao { get; set; }
        public bool? Pendencia { get; set; }
        // CategoriaId removida: agora usamos apenas os enums de defeito
        public virtual List<int>? DefeitosList { get; set; } = new(); // IDs do enum Defeito

        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }
    }
}
