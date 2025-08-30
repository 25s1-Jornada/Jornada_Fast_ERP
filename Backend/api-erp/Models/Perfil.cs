namespace api_erp.Model
{
    public class Perfil
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;  //admin, representante (dono do armario), tecnico, cliente
        public ICollection<Usuario>? Usuarios { get; set; }
    }
}
