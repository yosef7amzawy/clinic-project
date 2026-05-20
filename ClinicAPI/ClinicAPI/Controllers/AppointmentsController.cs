using ClinicAPI.Data;
using ClinicAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly ClinicDbContext _context;

        public AppointmentsController(ClinicDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAppointments()
        {
            var appointments = _context.Appointments
                .Include(a => a.Patient)
                .ToList();

            return Ok(appointments.Select(a => new
            {
                id = a.Id,

                patientId = a.Patient_Id,

                patientName = a.Patient != null
                    ? a.Patient.Full_Name
                    : "Patient",

                phone = a.Patient != null
                    ? a.Patient.Phone
                    : "01000000000",

                date = a.Date,

                time = a.Time.ToString(),

                status = a.Status ?? "",

                isFinished = a.IsFinished
            }));
        }

        [HttpPost]
        public IActionResult AddAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);

            _context.SaveChanges();

            return Ok(appointment);
        }

        [HttpPut("{id}/finish")]
        public IActionResult FinishAppointment(int id)
        {
            var appointment = _context.Appointments.Find(id);

            if (appointment == null)
            {
                return NotFound();
            }

            appointment.IsFinished = true;

            _context.SaveChanges();

            return Ok(appointment);
        }
    }
}