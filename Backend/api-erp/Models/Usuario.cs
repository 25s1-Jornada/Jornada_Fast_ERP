namespace api_erp.Model
{
    public class Usuario
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int? EnderecoId { get; set; }
        public string? Telefone { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string? Cpf { get; set; }
        public int? PerfilId { get; set; }
        public int? EmpresaId { get; set; }

        public Endereco? Endereco { get; set; }
        public Perfil? Perfil { get; set; }
        public Empresa? Empresa { get; set; }
        public ICollection<MovimentacaoEstoque>? Movimentacoes { get; set; }
        public ICollection<PecaQrCode>? PecasQrCode { get; set; }
    }
}
