namespace api_erp.Model
{
    public class Empresa
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Cnpj { get; set; }
        public int? EnderecoId { get; set; }
        public string TipoEmpresa { get; set; } = "cliente";
        public string? Email { get; set; }

        public Endereco? Endereco { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
        public ICollection<Armario>? Armarios { get; set; }
    }
}
