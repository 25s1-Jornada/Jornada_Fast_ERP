namespace api_erp.DTOs
{
    public class EmpresaDTO
    {
        public int? Id { get; set; }
        public string Nome { get; set; } 
        public string? Cnpj { get; set; }
        public int? EnderecoId { get; set; }
        public string TipoEmpresa { get; set; }
        public string? Email { get; set; }
    }
}
