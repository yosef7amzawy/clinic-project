using ClinicAPI.Data;
using ClinicAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace ClinicAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ClinicDbContext _context;

        public UsersController(ClinicDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u =>
                u.Email == request.Email &&
                u.Password == request.Password
            );

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }

            return Ok(new
            {
                id = user.Id,
                fullName = user.Name,
                email = user.Email,
                role = user.Role
            });
        }
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            _context.Users.Add(user);

            _context.SaveChanges();

            return Ok(user);
        }
    }
}