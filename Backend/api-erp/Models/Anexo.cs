using System.ComponentModel.DataAnnotations.Schema;
using api_erp.Models.OSModels;

namespace api_erp.Models
{
    [Table("imagem")]
    public class Imagem
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("file_name")]
        public string FileName { get; set; } = default!;

        [Column("content_type")]
        public string ContentType { get; set; } = default!;

        [Column("length_bytes")]
        public long LengthBytes { get; set; }

        [Column("sha256")]
        public byte[] Sha256 { get; set; } = default!;

        [Column("data")]
        public byte[] Data { get; set; } = default!;

        [Column("created_at_utc")]
        public DateTime CreatedAtUtc { get; set; }

        [Column("titulo")]
        public string? Titulo { get; set; }

        [Column("descricao")]
        public string? Descricao { get; set; }

        [Column("ordem_servico_id")]
        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }

        [Column("descricao_do_chamado_id")]
        public int? DescricaoDoChamadoId { get; set; }
        public DescricaoDoChamado? DescricaoDoChamado { get; set; }
    }
}
