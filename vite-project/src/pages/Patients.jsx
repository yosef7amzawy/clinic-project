import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PatientPanel from "../components/PatientPanel";
import "../styles/patients.css";
import "../styles/patientPanel.css";

function Patients() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  // مودال دخول المريض

  const [showVisitModal, setShowVisitModal] = useState(false);

  const [selectedVisitPatient, setSelectedVisitPatient] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");

  const [medicines, setMedicines] = useState("");

  const [notes, setNotes] = useState("");

  // رسالة النجاح

  const [successMessage, setSuccessMessage] = useState("");

  // حماية الصفحة

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "doctor") {

      document.body.innerHTML += `
        <div class="access-denied-message">
            غير مصرح لك بالدخول لهذه الصفحة
        </div>
      `;

      navigate("/reception");
    }

  }, [navigate]);

  // جلب الحجوزات

  useEffect(() => {

    fetch("https://localhost:7232/api/appointments")
      .then((res) => res.json())
      .then((data) => {

        const formattedData = data.map((appt) => ({

          id: appt.id,

          time:
            appt.time?.substring(0, 5),

          day:
            new Date(appt.date)
              .toLocaleDateString("ar-EG", {
                weekday: "long"
              }),

          date:
            new Date(appt.date)
              .toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long"
              }),

          name:
            appt.patientName || "مريض",

          status:
            appt.isFinished
                ? "منتهي"
                : "دخول",

isFinished:
  appt.isFinished,

          phone:
            appt.phone || "لا يوجد",

          email:
            appt.email || "لا يوجد",

          visits:
            1,

          history:
            [],

          notes:
            [],

        }));

        setAppointments(formattedData);

      });

  }, []);

  // حفظ الكشف

  const saveVisit = async () => {

    const response = await fetch(
      "https://localhost:7232/api/PatientHistory",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

  patient_Id:
    selectedVisitPatient.id,

  patient_Name:
    selectedVisitPatient.name,

  diagnosis,

  medicines,

  notes,

  visit_Date: new Date(),

}),

      }
    );

    if (response.ok) {
      await fetch(
  `https://localhost:7232/api/appointments/${selectedVisitPatient.id}/finish`,
  {
    method: "PUT",
  }
);

      // تحويل الحالة لمنتهي

     const updatedAppointments = appointments.map((appt) => {

   if (appt.id === selectedVisitPatient.id)
   {
      return {
         ...appt,
         status: "منتهي"
      };
   }

   return appt;
});

setAppointments(updatedAppointments);

      // رسالة النجاح

      setSuccessMessage(
        "✅ تم حفظ الكشف بنجاح"
      );

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

      setShowVisitModal(false);

      setDiagnosis("");

      setMedicines("");

      setNotes("");
    }

  };

  return (

    <div className="patients-container">

      <Sidebar />

      <div className="patients-main">

        <div className="patients-top-section">

          <h2 className="patients-page-title">
            👨‍⚕️ لوحة تحكم الدكتور
          </h2>

        </div>

        <div className="cards-grid">

          {appointments.map((appt, index) => (

            <div className="card" key={index}>

              <div className="card-top">

                {appt.status === "منتهي" ? (

                  <button
                    style={{
                      background: "#888",
                      cursor: "not-allowed",
                    }}
                  >
                    منتهي
                  </button>

                ) : (

                  <button
                    className="enter-btn"
                    onClick={() => {

                      setSelectedVisitPatient(appt);

                      setShowVisitModal(true);

                    }}
                  >
                    دخول
                  </button>

                )}

                <span className="card-time">
                  ⏱ {appt.time}
                </span>

              </div>

              <div className="card-day">

                {appt.day} - {appt.date}

              </div>

              <div
                className="card-name"
                onClick={() => setSelectedPatient(appt)}
                style={{ cursor: "pointer" }}
              >
                👤 {appt.name}
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* بانل التاريخ المرضي */}

      <PatientPanel
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* مودال الكشف */}

      {showVisitModal && (

        <div className="visit-modal-overlay">

          <div className="visit-modal">

            <h2>🩺 دخول المريض</h2>

            <h3>
              {selectedVisitPatient?.name}
            </h3>

            <textarea
              placeholder="اكتب التشخيص..."
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
            />

            <textarea
              placeholder="اكتب الأدوية..."
              value={medicines}
              onChange={(e) =>
                setMedicines(e.target.value)
              }
            />

            <textarea
              placeholder="اكتب الملاحظات..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

            <div className="visit-buttons">

              <button onClick={saveVisit}>
                حفظ الكشف
              </button>

              <button
                className="close-btn"
                onClick={() =>
                  setShowVisitModal(false)
                }
              >
                إغلاق
              </button>

            </div>

          </div>

        </div>

      )}

      {/* رسالة النجاح */}

      {successMessage && (

        <div className="success-message">

          {successMessage}

        </div>

      )}

    </div>

  );
}

export default Patients;