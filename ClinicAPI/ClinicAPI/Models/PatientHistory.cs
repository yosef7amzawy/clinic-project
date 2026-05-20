using System;

namespace ClinicAPI.Models
{
    public class PatientHistory
    {
        public int Id { get; set; }

        public int Patient_Id { get; set; }

        public string Patient_Name { get; set; }

        public string Diagnosis { get; set; }

        public string Medicines { get; set; }

        public string Notes { get; set; }

        public DateTime Visit_Date { get; set; }
    }
}