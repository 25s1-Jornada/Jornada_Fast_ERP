using api_erp.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api_erp.Models.OSModels
{
    public class DescricaoDoChamado //Descrição do Chamado
    {
     

        public int? Id { get; set; }
        public string? NumeroSerie { get; set; }
        public int? CategoriaId { get; set; } //enum Categoria
        public string? Observacao { get; set; }
        public int? OrdemId { get; set; }
        public OrdemServico OrdemServico { get; set; }


    }
}
