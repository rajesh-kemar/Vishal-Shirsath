using AdvanceLogistic.Models;
using Microsoft.EntityFrameworkCore;

namespace AdvanceLogistic.Data
{
    public class AdvanceLogisticContext : DbContext
    {
        public AdvanceLogisticContext(DbContextOptions<AdvanceLogisticContext> options)
            : base(options) { }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Trip → Driver relation
            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany()
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            // ❌ Removed Vehicle relationship — Trip no longer has VehicleId/Vehicle
            // ✅ Configure VehicleType as a simple string column instead
            modelBuilder.Entity<Trip>()
                .Property(t => t.VehicleType)
                .HasMaxLength(100); // optional length constraint

            // Optionally enforce default value for Status
            modelBuilder.Entity<Trip>()
                .Property(t => t.Status)
                .HasDefaultValue("Active");
        }
    }
}
