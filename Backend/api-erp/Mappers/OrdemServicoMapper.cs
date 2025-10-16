using api_erp.DTOs;
using api_erp.Models.OSModels;
using api_erp.Enums;

namespace api_erp.Mappers
{
    public static class OrdemServicoMapper
    {
        public static OrdemServicoReadDto ToReadDto(this OrdemServico e) =>
            new OrdemServicoReadDto
            {
                Id = e.Id,
                ClientId = e.ClientId,
                TecnicoId = e.TecnicoId,
                DataAbertura = e.DataAbertura,
                StatusId = e.StatusId,
                GarantiaId = e.GarantiaId,
                DataFaturamento = e.DataFaturamento,
                Pedido = e.Pedido,
                NumeroOS = e.NumeroOS,
                DescricaoDoChamadoIds = e.DescricaoDoChamadoList?.Select(d => d.Id ?? 0).ToList()
            };

        public static OrdemServico FromCreateDto(this OrdemServicoCreateDto dto) =>
            new OrdemServico
            {
                ClientId = dto.ClientId,
                TecnicoId = dto.TecnicoId,
                DataAbertura = dto.DataAbertura,
                StatusId = dto.StatusId,
                GarantiaId = dto.GarantiaId,
                DataFaturamento = dto.DataFaturamento,
                Pedido = dto.Pedido,
                NumeroOS = dto.NumeroOS,
            };

        public static OrdemServico FromUpdateDto(this OrdemServicoUpdateDto dto, int id) =>
            new OrdemServico
            {
                Id = id,
                ClientId = dto.ClientId,
                TecnicoId = dto.TecnicoId,
                DataAbertura = dto.DataAbertura,
                StatusId = dto.StatusId,
                GarantiaId = dto.GarantiaId,
                DataFaturamento = dto.DataFaturamento,
                Pedido = dto.Pedido,
                NumeroOS = dto.NumeroOS,
            };

        // DTO com IDs e Enums como string
        public static OrdemServicoStringReadDto ToStringReadDto(this OrdemServico e)
        {
            string? StatusToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Status), id.Value))
                    return Enum.GetName(typeof(Status), id.Value);
                return id?.ToString();
            }

            string? GarantiaToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Garantia), id.Value))
                    return Enum.GetName(typeof(Garantia), id.Value);
                return id?.ToString();
            }

            return new OrdemServicoStringReadDto
            {
                Id = e.Id.ToString(),
                ClientId = e.ClientId.ToString(),
                TecnicoId = e.TecnicoId?.ToString(),
                DataAbertura = e.DataAbertura,
                Status = StatusToString(e.StatusId),
                Garantia = GarantiaToString(e.GarantiaId),
                DataFaturamento = e.DataFaturamento,
                Pedido = e.Pedido,
                NumeroOS = e.NumeroOS,
                DescricaoDoChamadoIds = e.DescricaoDoChamadoList?.Select(d => (d.Id ?? 0).ToString()).ToList()
            };
        }
    }
}
