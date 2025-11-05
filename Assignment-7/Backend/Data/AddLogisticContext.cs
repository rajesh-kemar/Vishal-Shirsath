using LogisticApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LogisticApp.Data
{

    public class AddLogisticContext : DbContext
    {
        public AddLogisticContext(DbContextOptions<AddLogisticContext> options) : base(options) { }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }
    }
    
}
