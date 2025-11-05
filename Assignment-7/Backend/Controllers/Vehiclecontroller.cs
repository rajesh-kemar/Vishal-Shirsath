using LogisticApp.Data;
using LogisticApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogisticApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly AddLogisticContext _context;
        public VehiclesController(AddLogisticContext context) => _context = context;

        // 🟢 GET: api/vehicles
        [HttpGet]
        public async Task<IActionResult> GetVehicles()
        {
            var vehicles = await _context.Vehicles
                .Select(v => new
                {
                    v.VehicleId,
                    v.VehicleNumber,
                    v.Type,
                    v.Capacity,
                    v.IsAvailable
                })
                .ToListAsync();

            return Ok(vehicles);
        }

        // 🟡 GET: api/vehicles/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableVehicles()
        {
            var availableVehicles = await _context.Vehicles
                .Where(v => v.IsAvailable)
                .Select(v => new
                {
                    v.VehicleId,
                    v.VehicleNumber,
                    v.Type,
                    v.Capacity,
                    v.IsAvailable
                })
                .ToListAsync();

            return Ok(availableVehicles);
        }

        // 🟢 POST: api/vehicles
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
                return BadRequest("Vehicle data is null.");

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return Ok(vehicle);
        }

        // 🟡 PUT: api/vehicles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] Vehicle vehicle)
        {
            var existing = await _context.Vehicles.FindAsync(id);
            if (existing == null)
                return NotFound("Vehicle not found.");

            existing.VehicleNumber = vehicle.VehicleNumber;
            existing.Type = vehicle.Type;
            existing.Capacity = vehicle.Capacity;
            existing.IsAvailable = vehicle.IsAvailable;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // 🔴 DELETE: api/vehicles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var v = await _context.Vehicles.FindAsync(id);
            if (v == null)
                return NotFound("Vehicle not found.");

            _context.Vehicles.Remove(v);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
