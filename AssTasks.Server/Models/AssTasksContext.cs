using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace AssTasks.Server.Models
{
    public class AssTasksContext : DbContext
    {
        public AssTasksContext(DbContextOptions<AssTasksContext> options) : base(options)
        {
            //
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(e => e.AssTasks)
                .WithOne(e => e.Owner)
                .HasForeignKey(e => e.OwnerId);
        }

        public DbSet<TaskParent> TaskParents { get; set; } = null!;
        public DbSet<AssTask> AssTasks { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
    }
}
