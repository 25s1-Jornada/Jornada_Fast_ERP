namespace api_erp.Security
{
    public static class PasswordHasher
    {
        public static string HashPassword(string senha)
        {
            if (string.IsNullOrWhiteSpace(senha))
            {
                throw new ArgumentException("Senha não pode ser vazia.");
            }

            return BCrypt.Net.BCrypt.HashPassword(senha);
        }

        public static bool VerifyPassword(string senha, string hash)
        {
            if (string.IsNullOrWhiteSpace(hash))
            {
                return false;
            }

            return BCrypt.Net.BCrypt.Verify(senha, hash);
        }
    }
}
