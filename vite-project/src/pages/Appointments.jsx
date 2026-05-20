import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookingModal from "../components/BookingModal";
import "../index.css";
import "../styles/bookingModal.css";

const data = [
  {
    day: "الأحد 17 مايو",
    date: "2026-05-17",
    times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"],
  },

  {
    day: "الاثنين 18 مايو",
    date: "2026-05-18",
    times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"],
  },

  {
    day: "الثلاثاء 19 مايو",
    date: "2026-05-19",
    times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"],
  },

  {
    day: "الأربعاء 20 مايو",
    date: "2026-05-20",
    times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"],
  },
];

function Appointments() {

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {

    fetch("https://localhost:7232/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setBookedSlots(data);
      });

  }, []);

  const isBooked = (date, time) => {

    return bookedSlots.some((item) => {

      const itemDate =
        item.date?.split("T")[0];

      const itemTime =
        item.time
          ?.toString()
          .substring(0, 5);

      return (
        itemDate === date &&
        itemTime === time
      );

    });

  };

  return (

    <div className="container">

      <Sidebar />

      <div className="main">

        <div
          className="top-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px"
          }}
        >

          <div className="title">
            📅 المواعيد المتاحة
          </div>

          <div
            className="filters"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center"
            }}
          >

            {/* التاريخ */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <label style={{ marginBottom: "8px" }}>
                اختر التاريخ
              </label>

              <select style={{ width: "110px" }}>

                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>
                    {i + 1}
                  </option>
                ))}

              </select>
            </div>

            {/* الشهر */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <label style={{ marginBottom: "8px" }}>
                اختر الشهر
              </label>

              <select style={{ width: "120px" }}>

                {[
                  "يناير",
                  "فبراير",
                  "مارس",
                  "أبريل",
                  "مايو",
                  "يونيو",
                  "يوليو",
                  "أغسطس",
                  "سبتمبر",
                  "أكتوبر",
                  "نوفمبر",
                  "ديسمبر"
                ].map((month, index) => (

                  <option key={index}>
                    {month}
                  </option>

                ))}

              </select>
            </div>

            {/* اليوم */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <label style={{ marginBottom: "8px" }}>
                اختر اليوم
              </label>

              <select style={{ width: "120px" }}>

                {[
                  "الأحد",
                  "الاثنين",
                  "الثلاثاء",
                  "الأربعاء"
                ].map((day, index) => (

                  <option key={index}>
                    {day}
                  </option>

                ))}

              </select>
            </div>

          </div>

        </div>

        <div
          className="days"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap",
            width: "100%"
          }}
        >

          {data.map((day, i) => (

            <div
              className="day"
              key={i}
              style={{
                width: "260px"
              }}
            >

              <div
                className="day-header"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "15px",
                  marginBottom: "15px"
                }}
              >
                {day.day}
              </div>

              {day.times.map((time, j) => (

                <div
                  className="slot"
                  key={j}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    background: "#fff"
                  }}
                >

                  <span>
                    ⏱ {time}
                  </span>

                  {isBooked(day.date, time) ? (

                    <button
                      style={{
                        background: "#888",
                        cursor: "not-allowed",
                        border: "none",
                        color: "#fff",
                        padding: "10px 18px"
                      }}
                    >
                      محجوز
                    </button>

                  ) : (

                    <button
                      style={{
                        background: "#166534",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        cursor: "pointer"
                      }}
                      onClick={() =>
                        setSelectedSlot(`${day.date} - ${time}`)
                      }
                    >
                      حجز
                    </button>

                  )}

                </div>

              ))}

            </div>

          ))}

        </div>

      </div>

      <BookingModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />

    </div>

  );
}

export default Appointments;