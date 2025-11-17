using api_erp.Model;

namespace api_erp.Models.OSModels
{
    public class Custo
    {
        public int? Id { get; set; }
        public DateTime? dataVisita {  get; set; }
        public int? TecnicoId { get; set; }
        public Usuario? Tecnico { get; set; }
        public string AjudanteName { get; set; } = string.Empty;

        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }

        public virtual List<Deslocamento> Deslocamento_List { get; set; } = new(); //A - CUSTO DESLOCAMENTO
        public virtual List<HoraTrabalhada> HoraTrabalhada_List { get; set; } = new();
        public virtual List<KM> KM_List { get; set; } = new();
        public virtual List<Material> Material_List { get; set; } = new();

        public double? ValorTotal { get; set; }
    }
}
