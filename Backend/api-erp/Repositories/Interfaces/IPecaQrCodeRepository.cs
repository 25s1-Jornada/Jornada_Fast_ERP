using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IPecaQrCodeRepository
    {
        Task<IEnumerable<PecaQrCode>> GetAllAsync();
        Task<PecaQrCode?> GetByIdAsync(int id);
        Task AddAsync(PecaQrCode peca);
        void Update(PecaQrCode peca);
        void Delete(PecaQrCode peca);
        Task SaveChangesAsync();
    }
}
