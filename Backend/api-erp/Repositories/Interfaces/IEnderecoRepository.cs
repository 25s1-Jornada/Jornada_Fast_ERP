using api_erp.DTOs;
using api_erp.Model;

namespace api_erp.Repositories.Interfaces
{
    public interface IEnderecoRepository
    {
        Task<IEnumerable<Endereco>> GetAllAsync();
        Task<Endereco?> GetByIdAsync(int id);
        Task AddAsync(EnderecoDTO endereco);
        void Update(EnderecoDTO endereco);
        void Delete(Endereco endereco);
        Task SaveChangesAsync();
    }
}
