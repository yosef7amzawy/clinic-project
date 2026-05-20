import { useEffect, useState } from "react";

function PatientPanel({ patient, onClose }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    if (patient) {

      fetch(
        `https://localhost:7232/api/PatientHistory/${patient.name}`
      )
        .then((res) => res.json())
        .then((data) => {

          setHistory(data);

        });

    }

  }, [patient]);

  if (!patient) return null;

  return (

    <div
      className="panel-overlay"
      onClick={onClose}
    >

      <div
        className="panel"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="panel-header">

          <button
            className="panel-close"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="panel-name">

            <span>👤</span>

            <h3>
              {patient.name}
            </h3>

          </div>

        </div>

        <div className="panel-info">

          <span>
            📞 {patient.phone}
          </span>

          <span>
            📅 {history.length} زيارة
          </span>

        </div>

        <div className="panel-section">

          <h4>
            📋 الزيارات السابقة
          </h4>

          {history.length === 0 ? (

            <div className="note-card">

              لا يوجد زيارات سابقة

            </div>

          ) : (

            history.map((visit, i) => (

              <div
                className="visit-card"
                key={i}
              >

                <div className="visit-top">

                  <span className="visit-date">
  📅 {
    visit.visit_date
      ? new Date(visit.visit_date).toLocaleDateString("ar-EG")
      : "لا يوجد تاريخ"
  }
</span>

                </div>

                <div className="visit-diagnosis">

                  🔍 التشخيص:
                  {" "}
                  {visit.diagnosis}

                </div>

                <div className="visit-medicines">

                  💊 الأدوية:
                  {" "}
                  {visit.medicines}

                </div>

                <div className="note-card">

                  📝 ملاحظات:
                  {" "}
                  {visit.notes}

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