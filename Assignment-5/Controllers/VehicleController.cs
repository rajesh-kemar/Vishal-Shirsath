using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripManagementApi.Data;
using TripManagementApi.Models;

namespace TripManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddVehicle([FromBody] Vehicle vehicle)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.VehicleId }, vehicle);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _context.Vehicles.ToListAsync();

            if (vehicles == null || vehicles.Count == 0)
                return NotFound("No vehicles found.");

            return Ok(vehicles);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles.Include(v => v.Trips).FirstOrDefaultAsync(v => v.VehicleId == id);
            if (vehicle == null) return NotFound();

            return Ok(vehicle);
        }

        // GET: /vehicle/available - list all vehicles NOT on active trips
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableVehicles()
        {
            var vehiclesInActiveTrips = await _context.Trips
                .Where(t => t.Status == "Active")
                .Select(t => t.VehicleId)
                .ToListAsync();

            var availableVehicles = await _context.Vehicles
                .Where(v => !vehiclesInActiveTrips.Contains(v.VehicleId))
                .ToListAsync();

            return Ok(availableVehicles);
        }
    }

}
