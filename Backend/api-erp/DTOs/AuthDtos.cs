namespace api_erp.DTOs
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    public class NewPasswordDto
    {
        public string NovaSenha { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public bool RequiresPasswordReset { get; set; }
        public int? PerfilId { get; set; }
        public string? PerfilNome { get; set; }
    }
}
