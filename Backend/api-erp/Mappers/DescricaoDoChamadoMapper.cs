using api_erp.DTOs;
using api_erp.Models.OSModels;

namespace api_erp.Mappers
{
    public static class DescricaoDoChamadoMapper
    {
        public static DescricaoDoChamadoReadDto ToReadDto(this DescricaoDoChamado e) =>
            new DescricaoDoChamadoReadDto
            {
                Id = e.Id ?? 0,
                NumeroSerie = e.NumeroSerie,
                CategoriaId = e.CategoriaId,
                Observacao = e.Observacao,
                OrdemServicoId = e.OrdemServicoId
            };

        public static DescricaoDoChamado FromCreateDto(this DescricaoDoChamadoCreateDto dto) =>
            new DescricaoDoChamado
            {
                Id = null,
                NumeroSerie = dto.NumeroSerie,
                CategoriaId = dto.CategoriaId,
                Observacao = dto.Observacao,
                OrdemServicoId = dto.OrdemServicoId
            };

        public static DescricaoDoChamado FromUpdateDto(this DescricaoDoChamadoUpdateDto dto, int id) =>
            new DescricaoDoChamado
            {
                Id = id,
                NumeroSerie = dto.NumeroSerie,
                CategoriaId = dto.CategoriaId,
                Observacao = dto.Observacao,
                OrdemServicoId = dto.OrdemServicoId
            };
    }
}
