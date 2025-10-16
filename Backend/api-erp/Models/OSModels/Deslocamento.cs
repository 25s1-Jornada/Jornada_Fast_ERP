namespace api_erp.Models.OSModels
{
    //A - Custo Deslocamento
    public class Deslocamento
    {


        public int? Id { get; set; }
        public DateTime? HrSaidaEmpresa { get; set; }
        public DateTime? HrChegadaCliente { get; set; }
        public DateTime? HrSaidaCliente { get; set; }
        public DateTime? HrChegadaEmpresa{ get; set; }
        public DateTime? TotalHoras {  get; set; }
        public double? TotalReais { get; set; }
        public int? IdOrdemServico { get; set; }
        public OrdemServico OrdemServico { get; set; }


    }
}
