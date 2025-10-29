using System.Text.Json.Serialization;

namespace api_erp.DTOs
{
    public class EnderecoDto
    {
        [JsonPropertyName("id")] public string? Id { get; set; }
        [JsonPropertyName("logradouro")] public string? Logradouro { get; set; }
        [JsonPropertyName("numero")] public string? Numero { get; set; }
        [JsonPropertyName("bairro")] public string? Bairro { get; set; }
        [JsonPropertyName("cidade")] public string? Cidade { get; set; }
        [JsonPropertyName("uf")] public string? Uf { get; set; }
    }

    // Shape pensado para casar com app/usuarios/types.ts
    public class EmpresaListDto
    {
        [JsonPropertyName("id")] public string? Id { get; set; }
        [JsonPropertyName("nome")] public string Nome { get; set; } = string.Empty;
        [JsonPropertyName("cnpj")] public string? Cnpj { get; set; }
        [JsonPropertyName("endereco_id")] public string? EnderecoId { get; set; }
        [JsonPropertyName("endereco")] public EnderecoDto? Endereco { get; set; }
        [JsonPropertyName("tipo_empresa")] public string TipoEmpresa { get; set; } = "cliente";
        [JsonPropertyName("email")] public string? Email { get; set; }
        [JsonPropertyName("created_at")] public string? CreatedAt { get; set; }
        [JsonPropertyName("updated_at")] public string? UpdatedAt { get; set; }
    }
}
