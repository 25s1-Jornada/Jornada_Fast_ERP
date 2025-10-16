using System.ComponentModel.DataAnnotations;

namespace api_erp.DTOs
{
    public class DeslocamentoCreateDto
    {
        public DateTime? HrSaidaEmpresa { get; set; }
        public DateTime? HrChegadaCliente { get; set; }
        public DateTime? HrSaidaCliente { get; set; }
        public DateTime? HrChegadaEmpresa { get; set; }
        public DateTime? TotalHoras { get; set; }
        public double? TotalReais { get; set; }
        public int? IdOrdemServico { get; set; }
    }

    public class DeslocamentoUpdateDto
    {
        public DateTime? HrSaidaEmpresa { get; set; }
        public DateTime? HrChegadaCliente { get; set; }
        public DateTime? HrSaidaCliente { get; set; }
        public DateTime? HrChegadaEmpresa { get; set; }
        public DateTime? TotalHoras { get; set; }
        public double? TotalReais { get; set; }
        public int? IdOrdemServico { get; set; }
    }

    public class DeslocamentoReadDto
    {
        [Required]
        public int Id { get; set; }
        public DateTime? HrSaidaEmpresa { get; set; }
        public DateTime? HrChegadaCliente { get; set; }
        public DateTime? HrSaidaCliente { get; set; }
        public DateTime? HrChegadaEmpresa { get; set; }
        public DateTime? TotalHoras { get; set; }
        public double? TotalReais { get; set; }
        public int? IdOrdemServico { get; set; }
    }
}

