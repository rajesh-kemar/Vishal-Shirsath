using AdvanceLogistic.Data;
using AdvanceLogistic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdvanceLogistic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VehiclesController : ControllerBase
    {
        private readonly AdvanceLogisticContext _context;
        public VehiclesController(AdvanceLogisticContext context)
        {
            _context = context;
        }

        // ✅ GET all vehicles + include available vehicle count in the response
        [HttpGet]
        [Authorize(Roles = "dispatcher,driver")]
        public async Task<IActionResult> GetVehicles()
        {
            var vehicles = await _context.Vehicles
                .AsNoTracking()
                .Select(v => new
                {
                    v.VehicleId,
                    v.VehicleNumber,
                    v.Type,
                    v.Capacity,
                    v.IsAvailable
                })
                .ToListAsync();

            // Count available vehicles
            int availableVehiclesCount = vehicles.Count(v => v.IsAvailable);

            return Ok(new
            {
                AvailableVehicles = availableVehiclesCount,
                Vehicles = vehicles
            });
        }

        // ✅ CREATE vehicle
        [HttpPost]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
                return BadRequest("Vehicle data is missing.");

            try
            {
                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating vehicle: {ex.Message}");
            }

            return Ok(new
            {
                Message = "Vehicle added successfully.",
                vehicle.VehicleId,
                vehicle.VehicleNumber,
                vehicle.Type,
                vehicle.Capacity,
                vehicle.IsAvailable
            });
        }

        // ✅ UPDATE vehicle
        [HttpPut("{id}")]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
                return BadRequest("Invalid vehicle data.");

            var existing = await _context.Vehicles.FindAsync(id);
            if (existing == null)
                return NotFound("Vehicle not found.");

            existing.VehicleNumber = vehicle.VehicleNumber;
            existing.Type = vehicle.Type;
            existing.Capacity = vehicle.Capacity;
            existing.IsAvailable = vehicle.IsAvailable;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating vehicle: {ex.Message}");
            }

            return Ok(new
            {
                Message = "Vehicle updated successfully.",
                existing.VehicleId,
                existing.VehicleNumber,
                existing.Type,
                existing.Capacity,
                existing.IsAvailable
            });
        }

        // ✅ DELETE vehicle
        [HttpDelete("{id}")]
        [Authorize(Roles = "dispatcher")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var v = await _context.Vehicles.FindAsync(id);
            if (v == null)
                return NotFound("Vehicle not found.");

            try
            {
                _context.Vehicles.Remove(v);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting vehicle: {ex.Message}");
            }

            return Ok(new
            {
                Message = "Vehicle deleted successfully.",
                VehicleId = id
            });
        }
    }
}
