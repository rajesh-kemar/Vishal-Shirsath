using TripManagementApi.Models;

public class Trip
{
    public int TripId { get; set; }
    public int VehicleId { get; set; }

    public int DriverId { get; set; }

    public string Source { get; set; } = null!;
    public string Destination { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = null!;  // e.g., "Active", "Completed", etc.

    public Vehicle? Vehicle { get; set; } = null!;
    public Driver? Driver { get; set; } = null!;
}
