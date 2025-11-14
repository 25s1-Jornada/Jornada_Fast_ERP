using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IEmpresaRepository
    {
        Task<IEnumerable<Empresa>> GetAllAsync();
        Task<Empresa?> GetByIdAsync(int id);
        Task AddAsync(EmpresaDTO empresa);
        void Update(EmpresaDTO empresa);
        void Delete(Empresa empresa);
        Task SaveChangesAsync();
    }
}
