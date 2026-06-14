import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PatientPanel from "../components/PatientPanel";
import "../styles/patients.css";
import "../styles/patientPanel.css";
import { API_BASE_URL } from "../config";

function Patients() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedVisitPatient, setSelectedVisitPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // حماية الصفحة
  //useEffect(() => {
   // const role = localStorage.getItem("role");
   // if (role !== "doctor") {
    //  document.body.innerHTML += `<div class="access-denied-message">غير مصرح لك بالدخول لهذه الصفحة</div>`;
     // navigate("/reception");
  //  }
  //}, [navigate]);

  // جلب الحجوزات
  useEffect(() => {
    fetch(`${API_BASE_URL}/appointments`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((appt) => ({
          id: appt.id,
          time: appt.time?.substring(0, 5),
          rawDate: new Date(appt.date),
          dayLabel: new Date(appt.date).toLocaleDateString("ar-EG", { weekday: "long" }),
          dateLabel: new Date(appt.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }),
          dateKey: new Date(appt.date).toISOString().split("T")[0],
          name: appt.patientName || "مريض",
          status: appt.isFinished ? "منتهي" : "دخول",
          isFinished: appt.isFinished,
          phone: appt.phone || "لا يوجد",
          email: appt.email || "لا يوجد",
          visits: 1,
          history: [],
          notes: [],
        }));
        setAppointments(formattedData);
      });
  }, []);

  // تجميع الحجوزات حسب اليوم
  const groupedByDay = appointments.reduce((acc, appt) => {
    if (!acc[appt.dateKey]) acc[appt.dateKey] = { label: appt.dayLabel, date: appt.dateLabel, items: [] };
    acc[appt.dateKey].items.push(appt);
    return acc;
  }, {});
  const sortedDays = Object.entries(groupedByDay).sort(([a], [b]) => a.localeCompare(b));

  const todayKey = new Date().toISOString().split("T")[0];

  // حفظ الكشف
  const saveVisit = async () => {
    const response = await fetch(`${API_BASE_URL}/PatientHistory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_Id: selectedVisitPatient.id,
        patient_Name: selectedVisitPatient.name,
        diagnosis,
        medicines,
        notes,
        visit_Date: new Date(),
      }),
    });

    if (response.ok) {
      await fetch(`${API_BASE_URL}/appointments/${selectedVisitPatient.id}/finish`, { method: "PUT" });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === selectedVisitPatient.id ? { ...appt, status: "منتهي", isFinished: true } : appt
        )
      );

      setSuccessMessage("✅ تم حفظ الكشف بنجاح");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowVisitModal(false);
      setDiagnosis("");
      setMedicines("");
      setNotes("");
    }
  };

  const totalAppointments = appointments.length;
  const finishedAppointments = appointments.filter((a) => a.isFinished).length;
  const pendingAppointments = appointments.filter((a) => !a.isFinished).length;

  return (
    <div className="patients-container" dir="rtl">
      <Sidebar />

      <div className="patients-main">
        {/* Header */}
        <div className="patients-header">
          <p className="patients-subtitle">نظام إدارة العيادة</p>
          <h1 className="patients-title">لوحة تحكم الدكتور</h1>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon stat-icon--total">📋</div>
            <div className="stat-info">
              <span className="stat-number">{totalAppointments}</span>
              <span className="stat-label">حجوزات اليوم</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--finished">✅</div>
            <div className="stat-info">
              <span className="stat-number">{finishedAppointments}</span>
              <span className="stat-label">مكتملة</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--pending">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{pendingAppointments}</span>
              <span className="stat-label">بانتظار الدخول</span>
            </div>
          </div>
        </div>

        {/* Days Sections */}
        {sortedDays.map(([dateKey, group]) => (
          <div className="day-section" key={dateKey}>
            <div className="day-header">
              <div className="day-header-right">
                <span className="day-name">{group.label}</span>
                {dateKey === todayKey && <span className="today-badge">اليوم</span>}
                <span className="day-full-date">{group.date}</span>
              </div>
              <span className="day-count">{group.items.length} موعد</span>
            </div>

            <div className="day-grid">
              {group.items.map((appt, idx) => (
                <div
                  className={`appt-row ${appt.isFinished ? "appt-row--finished" : ""}`}
                  key={idx}
                >
                  <div className="appt-name" onClick={() => setSelectedPatient(appt)}>
                    <span className="appt-avatar">👤</span>
                    <span>{appt.name}</span>
                  </div>
                  <div className="appt-time">
                    <span className="clock-icon">⏱</span>
                    {appt.time}
                  </div>
                  {appt.isFinished ? (
                    <button className="btn-finished" disabled>منتهي</button>
                  ) : (
                    <button
                      className="btn-enter"
                      onClick={() => { setSelectedVisitPatient(appt); setShowVisitModal(true); }}
                    >
                      دخول
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Patient Panel */}
      <PatientPanel patient={selectedPatient} onClose={() => setSelectedPatient(null)} />

      {/* Visit Modal */}
      {showVisitModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">🩺 دخول المريض</h2>
              <button className="modal-close-x" onClick={() => setShowVisitModal(false)}>✕</button>
            </div>
            <p className="modal-patient-name">{selectedVisitPatient?.name}</p>
            <div className="modal-fields">
              <div className="field-group">
                <label>التشخيص</label>
                <textarea placeholder="اكتب التشخيص..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              </div>
              <div className="field-group">
                <label>الأدوية</label>
                <textarea placeholder="اكتب الأدوية..." value={medicines} onChange={(e) => setMedicines(e.target.value)} />
              </div>
              <div className="field-group">
                <label>الملاحظات</label>
                <textarea placeholder="اكتب الملاحظات..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={saveVisit}>حفظ الكشف</button>
              <button className="btn-cancel" onClick={() => setShowVisitModal(false)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {successMessage && <div className="success-toast">{successMessage}</div>}
    </div>
  );
}

export default Patients;