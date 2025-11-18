using api_erp.Model;

namespace api_erp.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Usuario usuario);
    }
}
