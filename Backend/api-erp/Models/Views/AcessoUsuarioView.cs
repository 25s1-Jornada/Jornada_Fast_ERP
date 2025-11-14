using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class AcessoUsuarioView
    {
        public int? UsuarioId { get; set; }
        public string? Usuario { get; set; }
        public string? Email { get; set; }
        public string? Perfil { get; set; }
        public string? TipoEmpresa { get; set; }
        public string? NivelAcesso { get; set; }
    }
}
