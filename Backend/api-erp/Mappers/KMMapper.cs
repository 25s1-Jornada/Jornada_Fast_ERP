using api_erp.DTOs;
using api_erp.Models.OSModels;

namespace api_erp.Mappers
{
    public static class KMMapper
    {
        public static KMReadDto ToReadDto(this KM e) =>
            new KMReadDto
            {
                Id = e.Id ?? 0,
                QntKm = e.QntKm,
                ValorPorKm = e.ValorPorKm
            };

        public static KM FromCreateDto(this KMCreateDto dto) =>
            new KM
            {
                Id = null,
                QntKm = dto.QntKm,
                ValorPorKm = dto.ValorPorKm
            };

        public static KM FromUpdateDto(this KMUpdateDto dto, int id) =>
            new KM
            {
                Id = id,
                QntKm = dto.QntKm,
                ValorPorKm = dto.ValorPorKm
            };
    }
}

