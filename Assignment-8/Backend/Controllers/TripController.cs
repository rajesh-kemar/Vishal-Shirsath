using AdvanceLogistic.Data;
using AdvanceLogistic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AdvanceLogistic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripsController : ControllerBase
    {
        private readonly AdvanceLogisticContext _context;

        public TripsController(AdvanceLogisticContext context)
        {
            _context = context;
        }

        // ✅ GET all trips + dashboard summary (SAME API)
        [HttpGet]
        [Authorize(Roles = "dispatcher,driver")]
        public async Task<IActionResult> GetTrips()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role)?.ToLower();

            IQueryable<Trip> query = _context.Trips
                .Include(t => t.Driver)
                .OrderByDescending(t => t.StartTime);

            if (role == "driver" && int.TryParse(userIdClaim, out int driverId))
            {
                query = query.Where(t => t.DriverId == driverId);
            }

            var trips = await query.AsNoTracking().ToListAsync();

            var tripList = trips.Select(t => new
            {
                t.TripId,
                DriverName = t.Driver?.Name ?? "Unknown",
                t.VehicleType,
                t.Source,
                t.Destination,
                t.StartTime,
                t.EndTime,
                t.Status,
                t.DurationHours,
                t.IsExtended
            }).ToList();

            // ✅ Calculate summary counts (no new endpoint)
            int activeTrips = trips.Count(t => t.Status == "Active");
            int completedTrips = trips.Count(t => t.Status == "Completed");
            int availableVehicles = await _context.Vehicles.CountAsync(v => v.IsAvailable);

            // ✅ Return trips + summary in one response
            return Ok(new
            {
                Summary = new
                {
                    ActiveTrips = activeTrips,
                    CompletedTrips = completedTrips,
                    AvailableVehicles = availableVehicles
                },
                Trips = tripList
            });
        }

        // ✅ GET trips by specific driver
        [HttpGet("driver/{driverId:int}")]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> GetTripsByDriver(int driverId)
        {
            var trips = await _context.Trips
                .Include(t => t.Driver)
                .Where(t => t.DriverId == driverId)
                .OrderByDescending(t => t.StartTime)
                .AsNoTracking()
                .ToListAsync();

            var result = trips.Select(t => new
            {
                t.TripId,
                DriverName = t.Driver?.Name ?? "Unknown",
                t.VehicleType,
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

        // ✅ POST create new trip (Dispatcher only)
        [HttpPost]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> CreateTrip([FromBody] Trip trip)
        {
            if (trip == null)
                return BadRequest("Trip data is missing");

            if (trip.DriverId <= 0)
                return BadRequest("Driver must be selected");

            if (string.IsNullOrWhiteSpace(trip.VehicleType))
                return BadRequest("Vehicle type is required");

            if (string.IsNullOrWhiteSpace(trip.Source) || string.IsNullOrWhiteSpace(trip.Destination))
                return BadRequest("Source and Destination are required");

            var driver = await _context.Drivers.FindAsync(trip.DriverId);
            if (driver == null)
                return BadRequest("Invalid DriverId");

            trip.Status = "Active";
            trip.StartTime = DateTime.Now;

            try
            {
                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating trip: {ex.Message}");
            }

            return Ok(new
            {
                trip.TripId,
                DriverName = driver.Name,
                trip.VehicleType,
                trip.Source,
                trip.Destination,
                trip.StartTime,
                trip.Status
            });
        }

        // ✅ PUT complete trip
        [HttpPut("complete/{id}")]
        [Authorize(Roles = "dispatcher,driver")]
        public async Task<IActionResult> CompleteTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Driver)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return NotFound("Trip not found");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role)?.ToLower();

            if (role == "driver" && int.TryParse(userIdClaim, out int driverId) && trip.DriverId != driverId)
                return Forbid("Drivers can only complete their own trips.");

            trip.EndTime = DateTime.Now;
            trip.Status = "Completed";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error completing trip: {ex.Message}");
            }

            return Ok(new
            {
                trip.TripId,
                trip.DriverId,
                DriverName = trip.Driver?.Name ?? "Unknown",
                trip.VehicleType,
                trip.Source,
                trip.Destination,
                trip.StartTime,
                trip.EndTime,
                trip.Status
            });
        }

        // ✅ DELETE trip (Dispatcher only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return NotFound("Trip not found.");

            try
            {
                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting trip: {ex.Message}");
            }

            return Ok(new
            {
                Message = "Trip deleted successfully.",
                trip.TripId,
                trip.Source,
                trip.Destination
            });
        }
    }
}
