using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripManagementApi.Data;
using TripManagementApi.Models;

namespace TripManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private readonly AppDbContext _context;
        private object GetTrip;

        public TripController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost] public async Task<IActionResult> AddTrip([FromBody] Trip trip) { if (!ModelState.IsValid) return BadRequest(ModelState); var driverExists = await _context.Drivers.AnyAsync(d => d.DriverId == trip.DriverId); var vehicleExists = await _context.Vehicles.AnyAsync(v => v.VehicleId == trip.VehicleId); if (!driverExists || !vehicleExists) return BadRequest("Driver or Vehicle not found"); _context.Trips.Add(trip); await _context.SaveChangesAsync(); return CreatedAtAction(nameof(GetTrip), new { id = trip.TripId }, trip); }


        [HttpGet]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _context.Trips.ToListAsync();

            if (trips == null || trips.Count == 0)
                return NotFound("No trips found.");

            return Ok(trips);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromBody] Trip trip)
        {
            if (id != trip.TripId)
                return BadRequest("Trip ID mismatch");

            var existingTrip = await _context.Trips.FindAsync(id);
            if (existingTrip == null)
                return NotFound("Trip not found");

            // Update only the fields you want (exclude TripId)
            existingTrip.VehicleId = trip.VehicleId;
            existingTrip.DriverId = trip.DriverId;
            existingTrip.Source = trip.Source;
            existingTrip.Destination = trip.Destination;
            existingTrip.StartTime = trip.StartTime;
            existingTrip.EndTime = trip.EndTime;
            existingTrip.Status = trip.Status;

            await _context.SaveChangesAsync();
            return Ok(existingTrip);
        }



    }

}
