using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicAPI.Models
{
    public class Patient
    {
        public int Id { get; set; }

        public string Full_Name { get; set; }

        public string Phone { get; set; }

        public string? Gender { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string? Address { get; set; }

        //public DateTime Created_At { get; set; }
    }
}