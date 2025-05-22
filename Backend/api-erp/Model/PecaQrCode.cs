namespace api_erp.Model
{
    public class PecaQrCode
    {
        public int Id { get; set; }
        public string Guid { get; set; } = string.Empty;
        public int ProdutoId { get; set; }
        public int? MovimentacaoId { get; set; }
        public int UsuarioId { get; set; }
        public string Status { get; set; } = "GERADO";
        public DateTime? DataGeracao { get; set; }

        public Produto? Produto { get; set; }
        public MovimentacaoEstoque? Movimentacao { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
