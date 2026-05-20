using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }

        /*[Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;*/
    }
}