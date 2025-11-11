using AdvanceLogistic.Data;
using AdvanceLogistic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace AdvanceLogistic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly AdvanceLogisticContext _context;


        public DriverController(AdvanceLogisticContext context)
        {
            _context = context;
        }

        // 🟢 GET all drivers (LEFT JOIN with Users for optional username)
        [HttpGet]
        public async Task<IActionResult> GetDrivers()
        {
            // LEFT JOIN ensures all drivers appear, even without matching username
            var drivers = await (
                from d in _context.Drivers
                join u in _context.Users
                    on d.Name.ToLower() equals u.username.ToLower() into driverUser
                from user in driverUser.DefaultIfEmpty() // ✅ LEFT JOIN
                select new
                {
                    d.DriverId,
                    d.Name,
                    d.LicenseNumber,
                    d.PhoneNumber,
                    Username = user != null ? user.username : null
                }
            ).ToListAsync();

            // ✅ Log to console for debugging (optional)
            Console.WriteLine($"✅ Total Drivers Fetched: {drivers.Count}");

            if (drivers == null || !drivers.Any())
                return Ok(new object[0]); // return empty array instead of null

            return Ok(drivers);
        }

        // 🔍 GET: Search drivers by name or license
        [HttpGet("search")]
        public async Task<IActionResult> SearchDrivers([FromQuery] string? name, [FromQuery] string? license)
        {
            var query = _context.Drivers.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(d => d.Name.Contains(name));

            if (!string.IsNullOrEmpty(license))
                query = query.Where(d => d.LicenseNumber == license);

            var drivers = await query.ToListAsync();

            if (!drivers.Any())
                return NotFound("No drivers found.");

            return Ok(drivers);
        }

        // 🟢 POST: Add new driver
        [HttpPost]
        public async Task<IActionResult> CreateDriver([FromBody] Driver driver)
        {
            if (driver == null)
                return BadRequest("Driver data is null.");

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ Driver Created: {driver.Name}");
            return Ok(driver);
        }

        // 🟡 PUT: Update existing driver
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, [FromBody] Driver driver)
        {
            var existing = await _context.Drivers.FindAsync(id);
            if (existing == null)
                return NotFound("Driver not found.");

            existing.Name = driver.Name;
            existing.LicenseNumber = driver.LicenseNumber;
            existing.PhoneNumber = driver.PhoneNumber;

            await _context.SaveChangesAsync();

            Console.WriteLine($"🟡 Driver Updated: {existing.Name}");
            return Ok(existing);
        }

        // 🔴 DELETE: Remove driver
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var d = await _context.Drivers.FindAsync(id);
            if (d == null)
                return NotFound("Driver not found.");

            _context.Drivers.Remove(d);
            await _context.SaveChangesAsync();

            Console.WriteLine($"❌ Driver Deleted: ID = {id}");
            return Ok();
        }
    }
}



























































































//using AdvanceLogistic.Data;
//using AdvanceLogistic.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace AdvanceLogistic.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DriverController : ControllerBase
//    {
//        private readonly AdvanceLogisticContext _context;
//        public DriverController(AdvanceLogisticContext context) => _context = context;

//        // 🟢 GET all drivers
//        [HttpGet]
//        public async Task<IActionResult> GetDrivers()
//        {
//            var drivers = await _context.Drivers.ToListAsync();
//            return Ok(drivers);
//        }

//        // 🔍 GET search by name or license
//        [HttpGet("search")]
//        public async Task<IActionResult> SearchDrivers([FromQuery] string? name, [FromQuery] string? license)
//        {
//            var query = _context.Drivers.AsQueryable();

//            if (!string.IsNullOrEmpty(name))
//                query = query.Where(d => d.Name.Contains(name));

//            if (!string.IsNullOrEmpty(license))
//                query = query.Where(d => d.LicenseNumber == license);

//            var drivers = await query.ToListAsync();
//            if (!drivers.Any())
//                return NotFound("No drivers found.");

//            return Ok(drivers);
//        }

//        // 🟢 POST: Add new driver
//        [HttpPost]
//        public async Task<IActionResult> CreateDriver([FromBody] Driver driver)
//        {
//            if (driver == null)
//                return BadRequest("Driver data is null.");

//            _context.Drivers.Add(driver);
//            await _context.SaveChangesAsync();
//            return Ok(driver);
//        }

//        // 🟡 PUT: Update driver
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateDriver(int id, [FromBody] Driver driver)
//        {
//            var existing = await _context.Drivers.FindAsync(id);
//            if (existing == null)
//                return NotFound("Driver not found.");

//            existing.Name = driver.Name;
//            existing.LicenseNumber = driver.LicenseNumber;
//            existing.PhoneNumber = driver.PhoneNumber;

//            await _context.SaveChangesAsync();
//            return Ok(existing);
//        }

//        // 🔴 DELETE: Remove driver
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteDriver(int id)
//        {
//            var d = await _context.Drivers.FindAsync(id);
//            if (d == null)
//                return NotFound("Driver not found.");

//            _context.Drivers.Remove(d);
//            await _context.SaveChangesAsync();
//            return Ok();
//        }
//    }
//}
