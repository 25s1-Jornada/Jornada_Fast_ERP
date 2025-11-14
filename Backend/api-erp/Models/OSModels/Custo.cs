using System.ComponentModel.DataAnnotations.Schema;
using api_erp.Model;

namespace api_erp.Models.OSModels
{
    [Table("custo")]
    public class Custo
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("data_visita")]
        public DateTime? DataVisita { get; set; }

        [Column("tecnico_id")]
        public int? TecnicoId { get; set; }
        public Usuario? Tecnico { get; set; }

        [Column("ajudante_nome")]
        public string AjudanteNome { get; set; } = string.Empty;

        [Column("ordem_servico_id")]
        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }

        public List<Deslocamento> Deslocamento_List { get; set; } = new();
        public List<HoraTrabalhada> HoraTrabalhada_List { get; set; } = new();
        public List<KM> KM_List { get; set; } = new();
        public List<Material> Material_List { get; set; } = new();

        [Column("valor_total")]
        public double? ValorTotal { get; set; }
    }
}
