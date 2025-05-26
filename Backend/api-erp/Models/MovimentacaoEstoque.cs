namespace api_erp.Model
{
    public class MovimentacaoEstoque
    {
        public int? Id { get; set; }
        public int ProdutoId { get; set; }
        public string? Tipo { get; set; }
        public int Quantidade { get; set; }
        public int? ArmarioId { get; set; }
        public DateTime? DataMovimentacao { get; set; }
        public string? Observacao { get; set; }
        public int? UsuarioId { get; set; }

        public Produto? Produto { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
