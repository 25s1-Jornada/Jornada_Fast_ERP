namespace api_erp.Enums
{
    public enum Categoria
    {
        Refrigeração = 1, // enum subCategoria
        Iluminacao = 2, // n tem
        Estrutura = 3, // n tem
        Outros = 4 // n tem
    }

    public enum Defeito
    {
        Queimado = 1,//Refrigeração
        Em_Massa = 2,//Refrigeração
        Em_Curto = 3,//Refrigeração //Iluminação
        Corrente_Alta = 4,//Refrigeração
        Nao_Parte = 5,//Refrigeração
        Sem_Compressao = 6,//Refrigeração
        Travado = 7,//Refrigeração
        Com_Barulho = 8,//Refrigeração
        Nao_Succiona = 9,//Refrigeração
        Desarmando = 10, //Refrigeração
        Pontos = 11, //Refrigeração
        Nao_Localizado = 12, //Refrigeração
        Filtro_Entupido = 13,//Refrigeração
        Capilar_Obstruido = 14,//Refrigeração
        Micromotor_Queimado = 15,//Refrigeração
        Micromotor_Travado = 16,//Refrigeração
        Controlador_Queimado = 17,//Refrigeração
        Regularem_Parametros = 18,//Refrigeração
        Lampada_Queimada = 19,//Iluminação
        Sem_Alimentacao = 20,//Iluminação
        Perfil_Curto_Vidro = 21, //Estrutura
        Perfil_Suporte_Ilum = 22,//Estrutura
        Lente_Calha_Ilum = 23,//Estrutura
        Perfil_Vedacao = 24,//Estrutura
        Perfil_Porta_Etiqueta = 25,//Estrutura
        Puxador = 26,//Estrutura
        Ponta_parachoque = 27,//Estrutura
        Canto_90 = 28,//Estrutura
        Acrilico_Carel = 29,//Estrutura
        Perfil_Frontal = 30,//Estrutura
        Parachoque_Frontal = 31,//Estrutura
        Parachoque_Lateral = 32//Estrutura

    }
}
