using AdvanceLogistic.Data;
using AdvanceLogistic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AdvanceLogistic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AdvanceLogisticContext _context;
        private readonly IConfiguration _config;

        public AuthController(AdvanceLogisticContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ✅ REGISTER (Drivers + Dispatchers)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] object data)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(data.ToString());
                if (dict == null)
                    return BadRequest("Invalid data.");

                dict.TryGetValue("role", out string role);
                dict.TryGetValue("username", out string username);
                dict.TryGetValue("password", out string password);
                dict.TryGetValue("name", out string name);
                dict.TryGetValue("licenseNumber", out string licenseNumber); 
                dict.TryGetValue("phoneNumber", out string phoneNumber);


                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                    return BadRequest("Username and password are required.");

                role = string.IsNullOrWhiteSpace(role) ? "driver" : role.ToLower();

                // ✅ Check if username already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
                if (existingUser != null)
                    return BadRequest("Username already exists.");

                // ✅ Create user record
                var user = new User
                {
                    username = username,
                    password = password,
                    role = role
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // ✅ If role is driver, also insert in Drivers table with same ID
                if (role == "driver")
                {
                    await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT Drivers ON");

                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT INTO Drivers (DriverId, Name, LicenseNumber, PhoneNumber)
                        VALUES ({0}, {1}, {2}, {3})",
                        user.Id,
                        name ?? username,
                        licenseNumber ?? $"LIC-{user.Id}",
                        phoneNumber ?? "N/A"
                    );

                    await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT Drivers OFF");
                }

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = $"{role} registered successfully!",
                    username = user.username,
                    role = user.role
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal Server Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.username == login.username && u.password == login.password);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                username = user.username,
                role = user.role.ToLower()
            });
        }

        // 🔐 JWT Token Generator
        private string GenerateJwtToken(User user)
        {
            var jwtKey = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expireMinutes = Convert.ToInt32(_config["Jwt:ExpireMinutes"]);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.username),
                new Claim(ClaimTypes.Role, user.role.ToLower())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}





































































//using AdvanceLogistic.Data;
//using AdvanceLogistic.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace AdvanceLogistic.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly AdvanceLogisticContext _context;
//        private readonly IConfiguration _config;

//        public AuthController(AdvanceLogisticContext context, IConfiguration config)
//        {
//            _context = context;
//            _config = config;
//        }

//        // ✅ REGISTER (Only Drivers)
//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] object data)
//        {
//            try
//            {
//                var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(data.ToString());
//                if (dict == null)
//                    return BadRequest("Invalid data.");

//                dict.TryGetValue("role", out string role);
//                dict.TryGetValue("username", out string username);
//                dict.TryGetValue("password", out string password);
//                dict.TryGetValue("name", out string name);
//                dict.TryGetValue("licenseNumber", out string licenseNumber);
//                dict.TryGetValue("phoneNumber", out string phoneNumber);

//                // ✅ Only drivers can register
//                if (string.IsNullOrWhiteSpace(role) || role.ToLower() != "driver")
//                    return BadRequest("Only drivers can register here.");

//                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
//                    return BadRequest("Username and password are required.");

//                // ✅ Check if username already exists
//                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
//                if (existingUser != null)
//                    return BadRequest("Username already exists.");

//                // ✅ Create User entry
//                var user = new User
//                {
//                    username = username,
//                    password = password,
//                    role = "driver"
//                };
//                _context.Users.Add(user);
//                await _context.SaveChangesAsync();

//                // ✅ Create Driver entry
//                var driver = new Driver
//                {
//                    Name = name ?? "",
//                    LicenseNumber = licenseNumber ?? "",
//                    PhoneNumber = phoneNumber ?? ""
//                };
//                _context.Drivers.Add(driver);
//                await _context.SaveChangesAsync();

//                return Ok(new
//                {
//                    message = "Driver registered successfully",
//                    username = user.username,
//                    role = user.role
//                });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal Server Error: {ex.Message}");
//            }
//        }

//        // ✅ LOGIN
//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] User login)
//        {
//            var user = await _context.Users
//                .FirstOrDefaultAsync(u => u.username == login.username && u.password == login.password);

//            if (user == null)
//                return Unauthorized("Invalid username or password");

//            var token = GenerateJwtToken(user);

//            return Ok(new
//            {
//                token,
//                username = user.username,
//                role = user.role // ✅ lowercase always
//            });
//        }

//        // 🔐 Generate JWT Token (lowercase roles)
//        private string GenerateJwtToken(User user)
//        {
//            var jwtKey = _config["Jwt:Key"];
//            var issuer = _config["Jwt:Issuer"];
//            var audience = _config["Jwt:Audience"];
//            var expireMinutes = Convert.ToInt32(_config["Jwt:ExpireMinutes"]);

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var claims = new[]
//            {
//                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//                new Claim(ClaimTypes.Name, user.username),
//                new Claim(ClaimTypes.Role, user.role.ToLower()) // ✅ lowercase claim
//            };

//            var token = new JwtSecurityToken(
//                issuer: issuer,
//                audience: audience,
//                claims: claims,
//                expires: DateTime.Now.AddMinutes(expireMinutes),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}
