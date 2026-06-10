import { useEffect, useState } from "react";

function PatientPanel({ patient, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (patient) {
      fetch(`https://localhost:7232/api/PatientHistory/${patient.name}`)
        .then((res) => res.json())
        .then((data) => setHistory(data));
    }
  }, [patient]);

  if (!patient) return null;

  const dayName = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-EG", { weekday: "long" });
  };

  const fullDate = (dateStr) => {
    if (!dateStr) return "لا يوجد تاريخ";
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="panel-header">
          <button className="panel-close" onClick={onClose}>✕</button>
          <div className="panel-avatar">👤</div>
          <h3 className="panel-name">{patient.name}</h3>
          <p className="panel-phone">
            <span className="phone-icon">📞</span>
            {patient.phone}
          </p>
          <div className="panel-badges">
            <span className="badge badge--active">نشط</span>
            <span className="badge badge--visits">
              <span>📋</span> {history.length} زيارة
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="panel-body">
          <div className="panel-section-title">
            <span>📋</span> الزيارات السابقة
            <span className="records-count">{history.length} سجل</span>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">لا يوجد زيارات سابقة</div>
          ) : (
            history.map((visit, i) => (
              <div className="visit-card" key={i}>
                <div className="visit-card-header">
                  <span className="visit-day">{dayName(visit.visit_date)}</span>
                  <span className="visit-date">{fullDate(visit.visit_date)}</span>
                </div>

                <div className="visit-field">
                  <span className="field-label">التشخيص</span>
                  <div className="field-icon field-icon--diagnosis">🩺</div>
                  <span className="field-value field-value--diagnosis">{visit.diagnosis}</span>
                </div>

                <div className="visit-field">
                  <span className="field-label">الأدوية</span>
                  <div className="field-icon field-icon--medicine">💊</div>
                  <span className="field-value field-value--medicine">{visit.medicines}</span>
                </div>

                <div className="visit-field">
                  <span className="field-label">ملاحظات</span>
                  <div className="field-icon field-icon--notes">📝</div>
                  <span className="field-value">{visit.notes}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientPanel;