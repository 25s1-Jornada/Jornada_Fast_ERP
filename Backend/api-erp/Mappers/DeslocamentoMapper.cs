using api_erp.DTOs;
using api_erp.Models.OSModels;

namespace api_erp.Mappers
{
    public static class DeslocamentoMapper
    {
        public static DeslocamentoReadDto ToReadDto(this Deslocamento e) =>
            new DeslocamentoReadDto
            {
                Id = e.Id ?? 0,
                HrSaidaEmpresa = e.HrSaidaEmpresa,
                HrChegadaCliente = e.HrChegadaCliente,
                HrSaidaCliente = e.HrSaidaCliente,
                HrChegadaEmpresa = e.HrChegadaEmpresa,
                TotalHoras = e.TotalHoras,
                TotalReais = e.TotalReais,
                IdOrdemServico = e.IdOrdemServico
            };

        public static Deslocamento FromCreateDto(this DeslocamentoCreateDto dto) =>
            new Deslocamento
            {
                Id = null,
                HrSaidaEmpresa = dto.HrSaidaEmpresa,
                HrChegadaCliente = dto.HrChegadaCliente,
                HrSaidaCliente = dto.HrSaidaCliente,
                HrChegadaEmpresa = dto.HrChegadaEmpresa,
                TotalHoras = dto.TotalHoras,
                TotalReais = dto.TotalReais,
                IdOrdemServico = dto.IdOrdemServico
            };

        public static Deslocamento FromUpdateDto(this DeslocamentoUpdateDto dto, int id) =>
            new Deslocamento
            {
                Id = id,
                HrSaidaEmpresa = dto.HrSaidaEmpresa,
                HrChegadaCliente = dto.HrChegadaCliente,
                HrSaidaCliente = dto.HrSaidaCliente,
                HrChegadaEmpresa = dto.HrChegadaEmpresa,
                TotalHoras = dto.TotalHoras,
                TotalReais = dto.TotalReais,
                IdOrdemServico = dto.IdOrdemServico
            };
    }
}

