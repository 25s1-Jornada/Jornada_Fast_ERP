using api_erp.Model;

namespace api_erp.Models.OSModels
{
    public class Custo
    {
        public DateTime? dataVisita {  get; set; }
        public int? TecnicoId { get; set; }
        public Usuario Tecnico { get; set; }
        public string AjudanteName { get; set; }
        public virtual List<Deslocamento> Deslocamento_List { get; set; } //A - CUSTO DESLOCAMENTO
        public virtual List<HoraTrabalhada> HoraTrabalhada_List { get; set; } 

    }
}
