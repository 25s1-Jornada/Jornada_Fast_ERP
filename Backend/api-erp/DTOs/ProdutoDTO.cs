namespace api_erp.DTOs
{
    public class ProdutoDTO
    {
        public int? Id { get; set; }
        public int? IdIntegracao { get; set; }
        public string? Sku { get; set; }
        public string Nome { get; set; }
        public string? Descricao { get; set; }
        public decimal? Preco { get; set; }
        public int? CategoriaId { get; set; }
        public bool Status { get; set; } 
    }
}
