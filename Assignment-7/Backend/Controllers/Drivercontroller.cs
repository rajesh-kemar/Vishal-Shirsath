using LogisticApp.Models;
using Microsoft.AspNetCore.Mvc;
using LogisticApp.Data;
using Microsoft.EntityFrameworkCore;


namespace LogisticApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly  AddLogisticContext _Context;
        public DriverController(AddLogisticContext context) => _Context = context;

        [HttpGet]
        public async Task<IActionResult> GetDrivers() => Ok(await _Context.Drivers.ToListAsync());

        [HttpGet("search")]
        public async Task<IActionResult> SearchDrivers([FromQuery] string name, [FromQuery] string license)
        {
            var query = _Context.Drivers.AsQueryable();
            if (!string.IsNullOrEmpty(name))
                query = query.Where(d => d.Name.Contains(name));
            if (!string.IsNullOrEmpty(license))
                query = query.Where(d => d.LicenseNumber == license);

            var drivers = await query.ToListAsync();
            if (!drivers.Any()) return NotFound("No drivers found");
            return Ok(drivers);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDriver(Driver driver)
        {
            _Context.Drivers.Add(driver);
            await _Context.SaveChangesAsync();
            return Ok(driver);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, Driver driver)
        {
            var existing = await _Context.Drivers.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Name = driver.Name;
            existing.LicenseNumber = driver.LicenseNumber;
            existing.PhoneNumber = driver.PhoneNumber;

            await _Context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var d = await _Context.Drivers.FindAsync(id);
            if (d == null) return NotFound();
            _Context.Drivers.Remove(d);
            await _Context.SaveChangesAsync();
            return Ok();
        }
    }

}
