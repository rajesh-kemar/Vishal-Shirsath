using LogisticApp.Data;
using LogisticApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogisticApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly AddLogisticContext _context;
        public TripsController(AddLogisticContext context) => _context = context;

        // ✅ GET all trips (Active, Completed, etc.)
        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var trips = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .OrderByDescending(t => t.StartTime)
                .ToListAsync();

            var result = trips.Select(t => new
            {
                t.TripId,
                DriverName = t.Driver?.Name ?? "Unknown",
                VehicleNumber = t.Vehicle?.VehicleNumber ?? "Unknown",
                t.Source,          // ✅ Added
                t.Destination,     // ✅ Added
                t.StartTime,
                t.EndTime,
                t.Status,
                t.DurationHours,
                t.IsExtended
            });

            return Ok(result);
        }

        // ✅ POST create new trip
        [HttpPost]
        public async Task<IActionResult> CreateTrip([FromBody] Trip trip)
        {
            if (trip == null)
                return BadRequest("Trip data is missing");

            if (trip.DriverId <= 0 || trip.VehicleId <= 0)
                return BadRequest("Driver and Vehicle must be selected");

            if (string.IsNullOrWhiteSpace(trip.Source) || string.IsNullOrWhiteSpace(trip.Destination))
                return BadRequest("Source and Destination are required");

            var driver = await _context.Drivers.FindAsync(trip.DriverId);
            if (driver == null)
                return BadRequest("Invalid DriverId");

            var vehicle = await _context.Vehicles.FindAsync(trip.VehicleId);
            if (vehicle == null)
                return BadRequest("Invalid VehicleId");

            if (!vehicle.IsAvailable)
                return BadRequest("Vehicle is already in use");

            // Mark the vehicle as unavailable once the trip starts
            vehicle.IsAvailable = false;

            // Set trip details
            trip.Status = "Active";
            trip.StartTime = trip.StartTime == default ? DateTime.Now : trip.StartTime;

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                trip.TripId,
                DriverName = driver.Name,
                VehicleNumber = vehicle.VehicleNumber,
                trip.Source,
                trip.Destination,
                trip.StartTime,
                trip.EndTime,
                trip.Status
            });
        }

        // ✅ PUT complete trip
        [HttpPut("complete/{id}")]
        public async Task<IActionResult> CompleteTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return NotFound("Trip not found");

            trip.EndTime = DateTime.Now;
            trip.Status = "Completed";
            trip.Vehicle.IsAvailable = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                trip.TripId,
                trip.Source,
                trip.Destination,
                trip.StartTime,
                trip.EndTime,
                trip.Status
            });
        }

        // ✅ Long trips (extended)
        [HttpGet("longtrips")]
        public async Task<IActionResult> LongTrips()
        {
            var trips = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .Where(t => t.DurationHours > 8)
                .ToListAsync();

            var result = trips.Select(t => new
            {
                t.TripId,
                DriverName = t.Driver?.Name ?? "Unknown",
                VehicleNumber = t.Vehicle?.VehicleNumber ?? "Unknown",
                t.Source,
                t.Destination,
                t.StartTime,
                t.EndTime,
                t.Status,
                t.DurationHours,
                t.IsExtended
            });

            return Ok(result);
        }
    }
}
