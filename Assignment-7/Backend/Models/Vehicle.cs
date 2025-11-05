namespace LogisticApp.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string VehicleNumber { get; set; }
        public string Type { get; set; }
        public int Capacity { get; set; } // Changed from int to string
        public bool IsAvailable { get; set; } = true;
    }
}
