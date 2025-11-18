namespace api_erp.DTOs
{
    public class UsuarioDTO
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int? EnderecoId { get; set; }
        public string? Telefone { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Senha { get; set; }
        public string? Cpf { get; set; }
        public int? PerfilId { get; set; }
        public int? EmpresaId { get; set; }
    }
}
