namespace api_erp.DTOs.Auth
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public UsuarioResumoDTO Usuario { get; set; } = new();
    }

    public class UsuarioResumoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int? PerfilId { get; set; }
        public string? PerfilNome { get; set; }
        public int? EmpresaId { get; set; }
    }
}
