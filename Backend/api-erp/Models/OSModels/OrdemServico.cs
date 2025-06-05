using api_erp.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;

namespace api_erp.Models.OSModels
{
    public class OrdemServico
    {
        //*obs: devolver como string todos os enuns
        //        - codigo(numero)
        //- cliente_id(usuário - cliente) 1:N
        //- tecnico_id(usuário - tecnico) 1:N
        //- dataAbertura(datetime)
        //- status_id(numero)  -> (aberto, em andamento, concluído, fechado)
        //-descrição(Descricao) N:1
        //- garantia(datetime)
        //-dataFaturamento(datetime)
    }
}
