using api_erp.EntityConfig;
using Microsoft.EntityFrameworkCore;

namespace api_erp.EntityConfig
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }


        //public DbSet<Produto> Produtos { get; set; }
    }

}
