using System.Security.Cryptography;
using System.Text;

namespace api_erp.Utils
{
    public static class SecurityHelper
    {
        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password ?? string.Empty));
            return Convert.ToHexString(hashBytes);
        }

        public static bool VerifyPassword(string providedPassword, string storedHash)
        {
            if (string.IsNullOrWhiteSpace(storedHash))
            {
                return false;
            }

            var hashedProvided = HashPassword(providedPassword);
            // Prefer hashed comparison; if data legacy was salvo em texto puro, aceita match direto do valor.
            return string.Equals(storedHash, hashedProvided, StringComparison.OrdinalIgnoreCase)
                   || string.Equals(storedHash, providedPassword, StringComparison.Ordinal);
        }

        public static string GenerateRandomPassword(int length = 12)
        {
            const string allowed = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@$%*?+-";
            const int defaultLength = 12;
            var size = length < 8 ? defaultLength : length;

            var buffer = new char[size];
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[size];
            rng.GetBytes(bytes);

            for (int i = 0; i < size; i++)
            {
                buffer[i] = allowed[bytes[i] % allowed.Length];
            }

            return new string(buffer);
        }
    }
}
