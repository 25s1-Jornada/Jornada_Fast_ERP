namespace api_erp.Model
{
    public class Empresa
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Documento { get; set; }
        public int? EnderecoId { get; set; }
        public string TipoEmpresa { get; set; } = "cliente"; //cliente (empresa) ou tecnico
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Responsavel { get; set; }
        public Endereco? Endereco { get; set; }
        public ICollection<Usuario>? Usuarios { get; set; }
        public ICollection<Armario>? Armarios { get; set; }
    }
}
