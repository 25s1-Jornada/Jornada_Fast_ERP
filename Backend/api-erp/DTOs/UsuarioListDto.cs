namespace api_erp.DTOs
{
    public class UsuarioListDto
    {
        public string? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? EmpresaId { get; set; }
        public string? Perfil { get; set; }
    }
}

