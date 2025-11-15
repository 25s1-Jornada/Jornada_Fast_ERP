namespace api_erp.DTOs
{
    public class OsEmpresaDto
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? TipoEmpresa { get; set; }
        public string? Contato { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public string? Cnpj { get; set; }
        public string? Endereco { get; set; }
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? Uf { get; set; }
    }
}
