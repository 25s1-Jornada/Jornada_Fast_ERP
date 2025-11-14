using System.ComponentModel.DataAnnotations.Schema;

namespace api_erp.Model
{
    [Table("usuario")]
    public class Usuario
    {
        [Column("id")]
        public int? Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("telefone")]
        public string? Telefone { get; set; }

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("senha")]
        public string Senha { get; set; } = string.Empty;

        [Column("endereco_id")]
        public int? EnderecoId { get; set; }

        [Column("perfil_id")]
        public int? PerfilId { get; set; }

        [Column("empresa_id")]
        public int? EmpresaId { get; set; }

        public Empresa? Empresa { get; set; }
        public Endereco? Endereco { get; set; }
        public Perfil? Perfil { get; set; }
        public ICollection<MovimentacaoEstoque>? Movimentacoes { get; set; }
        public ICollection<PecaQrCode>? PecasQrCode { get; set; }
    }
}
