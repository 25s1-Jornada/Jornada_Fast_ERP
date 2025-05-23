using api_erp.Model;

namespace api_erp.Interfaces
{
    public interface IEnderecoRepository
    {
        Task<IEnumerable<Endereco>> GetAllAsync();
        Task<Endereco?> GetByIdAsync(int id);
        Task AddAsync(Endereco endereco);
        void Update(Endereco endereco);
        void Delete(Endereco endereco);
        Task SaveChangesAsync();
    }
}
