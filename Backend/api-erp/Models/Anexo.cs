using api_erp.Models.OSModels;

namespace api_erp.Models
{
    public class Imagem
    {
        public long Id { get; set; }
        public string FileName { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public long LengthBytes { get; set; }
        public byte[] Sha256 { get; set; } = default!;
        public byte[] Data { get; set; } = default!; // BLOB no banco
        public DateTime CreatedAtUtc { get; set; }
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }

        public int? OrdemServicoId { get; set; }
        public OrdemServico? OrdemServico { get; set; }

        public int? DescricaoDoChamadoId { get; set; }
        public DescricaoDoChamado? DescricaoDoChamado { get; set; }
    }
}
