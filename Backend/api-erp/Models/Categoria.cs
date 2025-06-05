namespace api_erp.Model
{
    public class Categoria
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }

        public string TipoCategoria { get; set; }
        public ICollection<Produto>? Produtos { get; set; }
    }
}
