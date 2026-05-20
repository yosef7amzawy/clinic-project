using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicAPI.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Column("patient_id")]
        public int? Patient_Id { get; set; }

        [ForeignKey("Patient_Id")]
        public Patient? Patient { get; set; }

        [Column("date")]
        public DateTime? Date { get; set; }

        [Column("time")]
        public TimeSpan? Time { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("payment_status")]
        public string? Payment_Status { get; set; } = "unpaid";

        [Column("notes")]
        public string? Notes { get; set; }


        [Column("is_finished")]
        public bool IsFinished { get; set; } = false;
    }
}