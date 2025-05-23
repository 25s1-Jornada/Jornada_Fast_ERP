using api_erp.EntityConfig;
using api_erp.Interfaces;
using api_erp.Model;
using Microsoft.EntityFrameworkCore;

namespace api_erp.Repositories
{
    public class PecaQrCodeRepository : IPecaQrCodeRepository
    {
        private readonly AppDbContext _context;
        public PecaQrCodeRepository(AppDbContext context) => _context = context;
        public async Task<IEnumerable<PecaQrCode>> GetAllAsync() => await _context.PecasQrCode.ToListAsync();
        public async Task<PecaQrCode?> GetByIdAsync(int id) => await _context.PecasQrCode.FindAsync(id);
        public async Task AddAsync(PecaQrCode peca) => await _context.PecasQrCode.AddAsync(peca);
        public void Update(PecaQrCode peca) => _context.PecasQrCode.Update(peca);
        public void Delete(PecaQrCode peca) => _context.PecasQrCode.Remove(peca);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
