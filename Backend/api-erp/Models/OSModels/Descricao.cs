using api_erp.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api_erp.Models.OSModels
{
    public class Descricao
    {
     

        public int? Id { get; set; }
        public string NumeroSerie { get; set; }
        public int DefeitoId { get; set; } //Enum Defeitos -> refrigeração, iluminação, estrutura, outros
        public Categoria CategoriaDefeito { get; set; }
        public string Observacao { get; set; }
        public int OrdemId { get; set; }
        public OrdemServico OrdemServico { get; set; }


    }
}
