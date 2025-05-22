namespace api_erp.Model
{
    public class Endereco
    {
        public int? Id { get; set; }
        public string Logradouro { get; set; } = string.Empty;
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? UF { get; set; }

        public ICollection<Empresa>? Empresas { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
    }
}
