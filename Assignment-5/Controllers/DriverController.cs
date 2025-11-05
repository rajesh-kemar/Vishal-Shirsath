using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripManagementApi.Data;
using TripManagementApi.Models;

namespace TripManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriverController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddDriver([FromBody] Driver drivers)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            _context.Drivers.Add(entity: drivers);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDriver), new { id = drivers.DriverId }, drivers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(int id)
        {
            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.DriverId == id);

            if (driver == null)
                return NotFound();

            return Ok(driver);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllDrivers()
        {
            var drivers = await _context.Drivers.ToListAsync();

            if (drivers == null || drivers.Count == 0)
                return NotFound("No drivers found.");

            return Ok(drivers);
        }

    }


}
