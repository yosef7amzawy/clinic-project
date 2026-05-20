import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookingModal from "../components/BookingModal";
import "../styles/reception.css";
import "../styles/bookingModal.css";

const times = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00"
];

function Reception() {

  // اليوم الحالي
  const [activeDay, setActiveDay] = useState("");

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [data, setData] = useState({});

  // جلب البيانات
  const fetchData = (keepDay = "") => {

    fetch("https://localhost:7232/api/appointments")
      .then((res) => res.json())
      .then((result) => {

        const groupedData = {};

        result.forEach((item) => {

          const day = item.date.split("T")[0];

          if (!groupedData[day]) {
            groupedData[day] = [];
          }

          groupedData[day].push({
            time: item.time.substring(0, 5),
            name: item.patientName || "Patient",
            phone: item.phone || "01000000000",
            id: item.id,
            status: item.status || "pending"
          });

        });

        // الأيام المسموحة
        const allowedDays = [
          "2026-05-17",
          "2026-05-18",
          "2026-05-19",
          "2026-05-20"
        ];

        const filteredData = {};

        allowedDays.forEach(day => {
          filteredData[day] = groupedData[day] || [];
        });

        setData(filteredData);

        // أول مرة فقط
        if (!keepDay && !activeDay) {
          setActiveDay("2026-05-17");
        }

        // بعد الحجز يفضل على نفس اليوم
        if (keepDay) {
          setActiveDay(keepDay);
        }

      });

  };

  // أول تحميل
  useEffect(() => {
    fetchData();
  }, []);

  return (

    <div className="container">

      <Sidebar />

      <div className="main">

        <div className="top-section">

          <div className="right-side">

            <h2 className="reception-page-title">
              📋 جدول المواعيد - الاستقبال
            </h2>

            <div className="tabs">

              <div
                className={`tab ${activeDay === "2026-05-17" ? "active" : ""}`}
                onClick={() => setActiveDay("2026-05-17")}
              >
                2026-05-17
              </div>

              <div
                className={`tab ${activeDay === "2026-05-18" ? "active" : ""}`}
                onClick={() => setActiveDay("2026-05-18")}
              >
                2026-05-18
              </div>

              <div
                className={`tab ${activeDay === "2026-05-19" ? "active" : ""}`}
                onClick={() => setActiveDay("2026-05-19")}
              >
                2026-05-19
              </div>

              <div
                className={`tab ${activeDay === "2026-05-20" ? "active" : ""}`}
                onClick={() => setActiveDay("2026-05-20")}
              >
                2026-05-20
              </div>

            </div>

          </div>

          <div className="filters">

            <div className="filter">

              <label>اختر التاريخ</label>

              <select>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

            </div>

            <div className="filter">

              <label>اختر الشهر</label>

              <select>
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

            <div className="filter">

              <label>اختر اليوم</label>

              <select>
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

        <div className="info">
          {(data[activeDay] || []).length} حجز من {times.length}
        </div>

        <div className="table">

          <div className="table-header">
            <span>الوقت</span>
            <span>اسم المريض</span>
            <span>رقم الهاتف</span>
            <span>رقم الحجز</span>
            <span>الدفع</span>
          </div>

          {times.map((time, index) => {

            const booking = (data[activeDay] || []).find(
              (t) => t.time === time
            );

            return (

              <div className="row" key={index}>

                <span className="time">
                  ⏱ {time}
                </span>

                {booking ? (
                  <>
                    <span>{booking.name}</span>

                    <span>{booking.phone}</span>

                    <span>{booking.id}</span>

                    <span className={`status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </>
                ) : (

                  <div
                    className="book-bar"
                    onClick={() =>
                      setSelectedSlot(`${activeDay} - ${time}`)
                    }
                  >
                    حجز
                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>

      <BookingModal
        slot={selectedSlot}
        onClose={() => {

          const currentDay = activeDay;

          setSelectedSlot(null);

          fetchData(currentDay);

        }}
      />

    </div>

  );
}

export default Reception;