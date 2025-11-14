using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class UsuariosPorEmpresaView
    {
        public int? UsuarioId { get; set; }
        public string? Usuario { get; set; }
        public string? Email { get; set; }
        public string? Perfil { get; set; }
        public string? Empresa { get; set; }
        public string? TipoEmpresa { get; set; }
    }
}
