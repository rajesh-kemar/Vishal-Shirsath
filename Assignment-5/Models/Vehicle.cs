namespace TripManagementApi.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string NumberPlate { get; set; } = null!;
        public string Type { get; set; } = null!;      // e.g., "Sedan", "Truck", etc.
        public int Capacity { get; set; }
        public string Status { get; set; } = null!;   // e.g., "Available", "InService", etc.

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
