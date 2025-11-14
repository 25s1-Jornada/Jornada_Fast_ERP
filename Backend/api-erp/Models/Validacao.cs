using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using api_erp.Model;

namespace api_erp.Models
{
    [Table("validacao")]
    public class Validacao
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string Status { get; set; } = "PENDENTE";

        [Column("data_validacao")]
        public DateTime? DataValidacao { get; set; }

        [Column("armario_id")]
        public int? ArmarioId { get; set; }
        public Armario? Armario { get; set; }

        [Column("usuario_id")]
        public int? UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("total_confirmadas")]
        public int? TotalConfirmadas { get; set; }

        [Column("total_pendentes")]
        public int? TotalPendentes { get; set; }

        [Column("total_nao_encontradas")]
        public int? TotalNaoEncontradas { get; set; }

        [Column("total_execucoes")]
        public int? TotalExecucoes { get; set; }

        [Column("tempo_execucao_segundos")]
        public double? TempoExecucaoSegundos { get; set; }

        [Column("observacoes")]
        public string? Observacoes { get; set; }

        public ICollection<ValidacaoDetalhe> Detalhes { get; set; } = new List<ValidacaoDetalhe>();
    }
}
