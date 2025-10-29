using api_erp.DTOs;
using api_erp.Models.OSModels;
using api_erp.Enums;

namespace api_erp.Mappers
{
    public static class OrdemServicoMapper
    {
        private static string? ToSnake(string? name)
        {
            if (string.IsNullOrWhiteSpace(name)) return name;
            var chars = new List<char>(name.Length * 2);
            for (int i = 0; i < name.Length; i++)
            {
                var c = name[i];
                if (char.IsUpper(c) && i > 0)
                {
                    chars.Add('_');
                }
                chars.Add(char.ToLowerInvariant(c));
            }
            return new string(chars.ToArray());
        }
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
                    return ToSnake(Enum.GetName(typeof(Status), id.Value));
                return id?.ToString();
            }

            string? GarantiaToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Garantia), id.Value))
                    return ToSnake(Enum.GetName(typeof(Garantia), id.Value));
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

        // DTO de listagem enriquecido para o Front
        public static OrdemServicoListDto ToListDto(this OrdemServico e, Custo? custo = null)
        {
            string? StatusToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Status), id.Value))
                    return ToSnake(Enum.GetName(typeof(Status), id.Value));
                return id?.ToString();
            }

            string? GarantiaToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Garantia), id.Value))
                    return ToSnake(Enum.GetName(typeof(Garantia), id.Value));
                return id?.ToString();
            }

            string? CategoriaToString(int? id)
            {
                if (id.HasValue && Enum.IsDefined(typeof(Categoria), id.Value))
                    return ToSnake(Enum.GetName(typeof(Categoria), id.Value));
                return id?.ToString();
            }

            var categoriaPrincipalId = e.DescricaoDoChamadoList?.FirstOrDefault()?.CategoriaId;

            return new OrdemServicoListDto
            {
                Id = e.Id,
                NumeroOS = e.NumeroOS,
                ClientId = e.ClientId,
                ClienteNome = e.Empresa?.Nome,
                TecnicoId = e.TecnicoId,
                TecnicoNome = e.Tecnico?.Nome,
                DataAbertura = e.DataAbertura,
                DataVisita = custo?.dataVisita,
                Status = StatusToString(e.StatusId),
                Garantia = GarantiaToString(e.GarantiaId),
                DataFaturamento = e.DataFaturamento,
                Pedido = e.Pedido,
                CategoriaPrincipal = CategoriaToString(categoriaPrincipalId),
                ValorTotal = custo?.ValorTotal
            };
        }
    }
}
