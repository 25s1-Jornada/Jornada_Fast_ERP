using api_erp.DTOs;
using api_erp.Models.OSModels;

namespace api_erp.Mappers
{
    public static class HoraTrabalhadaMapper
    {
        public static HoraTrabalhadaReadDto ToReadDto(this HoraTrabalhada e) =>
            new HoraTrabalhadaReadDto
            {
                Id = e.Id ?? 0,
                Inicio = e.Inicio,
                Termino = e.Termino,
                TotalHoras = e.TotalHoras,
                TotalValor = e.TotalValor,
                IdOrdemServico = e.IdOrdemServico
            };

        public static HoraTrabalhada FromCreateDto(this HoraTrabalhadaCreateDto dto) =>
            new HoraTrabalhada
            {
                Id = null,
                Inicio = dto.Inicio,
                Termino = dto.Termino,
                TotalHoras = dto.TotalHoras,
                TotalValor = dto.TotalValor,
                IdOrdemServico = dto.IdOrdemServico
            };

        public static HoraTrabalhada FromUpdateDto(this HoraTrabalhadaUpdateDto dto, int id) =>
            new HoraTrabalhada
            {
                Id = id,
                Inicio = dto.Inicio,
                Termino = dto.Termino,
                TotalHoras = dto.TotalHoras,
                TotalValor = dto.TotalValor,
                IdOrdemServico = dto.IdOrdemServico
            };
    }
}

