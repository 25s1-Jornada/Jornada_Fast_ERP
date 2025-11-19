using api_erp.DTOs;
using api_erp.Models.OSModels;

namespace api_erp.Mappers
{
    public static class DescricaoDefeitoMapper
    {
        public static DescricaoDefeitoReadDto ToReadDto(this DescricaoDefeito e) =>
            new DescricaoDefeitoReadDto
            {
                Id = e.Id ?? 0,
                NumeroSerie = e.NumeroSerie,
                Observacao = e.Observacao,
                Pendencia = e.Pendencia,
                DefeitosList = e.DefeitosList
            };

        public static DescricaoDefeito FromCreateDto(this DescricaoDefeitoCreateDto dto) =>
            new DescricaoDefeito
            {
                Id = null,
                NumeroSerie = dto.NumeroSerie ?? string.Empty,
                Observacao = dto.Observacao ?? string.Empty,
                Pendencia = dto.Pendencia,
                DefeitosList = dto.DefeitosList ?? new List<int>()
            };

        public static DescricaoDefeito FromUpdateDto(this DescricaoDefeitoUpdateDto dto, int id) =>
            new DescricaoDefeito
            {
                Id = id,
                NumeroSerie = dto.NumeroSerie ?? string.Empty,
                Observacao = dto.Observacao ?? string.Empty,
                Pendencia = dto.Pendencia,
                DefeitosList = dto.DefeitosList ?? new List<int>()
            };
    }
}

