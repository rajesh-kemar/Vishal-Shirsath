using System.ComponentModel.DataAnnotations.Schema;

namespace AdvanceLogistic.Models
{
    public class Trip
    {
        public int TripId { get; set; }

        // Driver relationship
        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        public string VehicleType { get; set; } = string.Empty;

        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = "Active";

        public double? DurationHours =>
            EndTime.HasValue ? (EndTime.Value - StartTime).TotalHours : null;

        public bool IsExtended => DurationHours.HasValue && DurationHours.Value > 8;

      
        [NotMapped]
        public string? DriverName { get; set; }
    }
}
