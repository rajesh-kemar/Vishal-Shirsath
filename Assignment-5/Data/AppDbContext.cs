using Microsoft.EntityFrameworkCore;
using TripManagementApi.Models;

namespace TripManagementApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicitly map each entity to table names to avoid mismatches
            modelBuilder.Entity<Driver>().ToTable("Drivers");
            modelBuilder.Entity<Vehicle>().ToTable("Vehicles");
            modelBuilder.Entity<Trip>().ToTable("Trips");

            // Relationship: Driver 1‑to‑many Trips
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.Trips)
                .WithOne(t => t.Driver)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship: Vehicle 1‑to‑many Trips
            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.Trips)
                .WithOne(t => t.Vehicle)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}
