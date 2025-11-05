namespace TripManagementApi.Models
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public int ExperienceYears { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
