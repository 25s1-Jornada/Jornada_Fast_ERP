namespace api_erp.Models.OSModels
{
    public class HoraTrabalhada
    {
        public int? Id { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Termino { get; set; }
        public int TotalHoras { get; set; }
        public double TotalValor { get; set; }
        public int? IdOrdemServico { get; set; }
        public OrdemServico OrdemServico { get; set; }

    }
}
