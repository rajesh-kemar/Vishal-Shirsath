namespace LogisticApp.Models
{
    public class Trip
    {
        public int TripId { get; set; }

        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public string Source { get; set; } = string.Empty;       // 🆕 Added
        public string Destination { get; set; } = string.Empty;  // 🆕 Added

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; } = "Active";

        public double? DurationHours =>
            EndTime.HasValue ? (EndTime.Value - StartTime).TotalHours : null;

        public bool IsExtended => DurationHours.HasValue && DurationHours.Value > 8;
    }
}
