using api_erp.Model;

namespace api_erp.Interfaces
{
    public interface IEmpresaRepository
    {
        Task<IEnumerable<Empresa>> GetAllAsync();
        Task<Empresa?> GetByIdAsync(int id);
        Task AddAsync(Empresa empresa);
        void Update(Empresa empresa);
        void Delete(Empresa empresa);
        Task SaveChangesAsync();
    }
}
