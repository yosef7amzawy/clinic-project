using ClinicAPI.Data;
using ClinicAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace ClinicAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientHistoryController : ControllerBase
    {
        private readonly ClinicDbContext _context;

        public PatientHistoryController(ClinicDbContext context)
        {
            _context = context;
        }

        [HttpGet("{name}")]
        public IActionResult GetHistory(string name)
        {
            var history = _context.PatientHistories
                .Where(x => x.Patient_Name == name)
                .OrderByDescending(x => x.Visit_Date)
                .ToList();

            return Ok(history);
        }

        [HttpPost]
        public IActionResult AddHistory(PatientHistory history)
        {
            _context.PatientHistories.Add(history);

            _context.SaveChanges();
            var appointment = _context.Appointments
.FirstOrDefault(a =>
    a.Patient_Id == history.Patient_Id);

            if (appointment != null)
            {
                appointment.IsFinished = true;
                _context.SaveChanges();
            }

            return Ok(history);
        }
    }
}