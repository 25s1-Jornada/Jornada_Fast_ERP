using api_erp.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;

namespace api_erp.Models.OSModels
{
    public class OrdemServico
    {
        public int Id { get; set; } 

        public int ClientId { get; set; }
        public Empresa Empresa { get; set; }

        public int? TecnicoId { get; set; } 
        public Usuario Tecnico { get; set; }

        public DateTime DataAbertura { get; set; }

        public int? StatusId { get; set; } //enum Status
        
        public int? GarantiaId { get; set; } //enum Garantia

        public DateTime? DataFaturamento { get; set; }

        public string? Pedido { get; set; }
        public string? NumeroOS { get; set; }
  
        public virtual List<DescricaoDoChamado> DescricaoDoChamadoList { get; set; } //Descrição do Chamado


        //*obs: devolver como string todos os enuns
    }
}
