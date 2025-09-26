namespace api_erp.Models.OSModels
{
    public class DescricaoDefeito
    {

        public int? Id { get; set; }

        public string NumeroSerie { get; set; }
        public string Observacao { get; set; }
        public bool? Pendencia { get; set; }
        public int? CategoriaId { get; set; } //enum Categoria
        public virtual List<int> DefeitosList { get; set; } //enum Defeitos


    }
}
