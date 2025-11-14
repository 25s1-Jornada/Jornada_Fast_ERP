namespace api_erp.DTOs
{
    public class EnderecoDTO
    {
        public int? Id { get; set; }
        public string Logradouro { get; set; } 
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? UF { get; set; }
    }
}
