namespace api_erp.Models.OSModels
{
    public class Material
    {
        public int? Id { get; set; }
        public int? CustoId { get; set; }
        public Custo? Custo { get; set; }

        public string? Nome { get; set; }
        public double Quantidade { get; set; }
        public double ValorUnitario { get; set; }
        public double TotalValor { get; set; }
    }
}
