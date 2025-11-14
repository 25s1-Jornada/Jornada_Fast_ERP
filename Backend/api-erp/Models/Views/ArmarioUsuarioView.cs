using Microsoft.EntityFrameworkCore;

namespace api_erp.Models.Views
{
    [Keyless]
    public class ArmarioUsuarioView
    {
        public int? UsuarioId { get; set; }
        public string? Usuario { get; set; }
        public string? Email { get; set; }
        public string? Armario { get; set; }
        public string? TipoEmpresa { get; set; }
        public string? Empresa { get; set; }
    }
}
