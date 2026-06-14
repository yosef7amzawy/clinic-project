import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookingModal from "../components/BookingModal";
import "../index.css";
import "../styles/appointments.css";
import "../styles/bookingModal.css";
import { API_BASE_URL } from "../config";

const data = [
  { day: "الأحد 17 مايو", date: "2026-05-17", times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"] },
  { day: "الاثنين 18 مايو", date: "2026-05-18", times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"] },
  { day: "الثلاثاء 19 مايو", date: "2026-05-19", times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"] },
  { day: "الأربعاء 20 مايو", date: "2026-05-20", times: ["10:00","10:30","11:00","11:30","12:00","14:00","15:00"] },
];

const totalSlots = data.reduce((acc, d) => acc + d.times.length, 0);

function Appointments() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/appointments`)
      .then((res) => res.json())
      .then((data) => setBookedSlots(data));
  }, []);

  const isBooked = (date, time) =>
    bookedSlots.some(
      (item) =>
        item.date?.split("T")[0] === date &&
        item.time?.toString().substring(0, 5) === time
    );

  const bookedCount = data.reduce(
    (acc, d) => acc + d.times.filter((t) => isBooked(d.date, t)).length,
    0
  );
  const availableCount = totalSlots - bookedCount;

  return (
    <div className="container" dir="rtl">
      <Sidebar />

      <div className="main">

        {/* ───── Header ───── */}
        <div className="appt-header">
          <div className="appt-header-right">
            <div className="appt-subtitle">🌐 الحجز الإلكتروني</div>
            <h1 className="appt-title">المواعيد المتاحة</h1>
            <p className="appt-desc">اختر اليوم والوقت المناسب لحجز موعدك في العيادة.</p>
          </div>
        </div>

        {/* ───── Stat Cards ───── */}
        <div className="appt-stats">
          {/* محجوزة */}
          <div className="appt-stat-card">
            <div className="appt-stat-icon yellow">⚠️</div>
            <div className="appt-stat-info">
              <h3>{bookedCount}</h3>
              <span>محجوزة</span>
            </div>
          </div>

          {/* متاحة */}
          <div className="appt-stat-card">
            <div className="appt-stat-icon green">✅</div>
            <div className="appt-stat-info">
              <h3>{availableCount}</h3>
              <span>متاحة</span>
            </div>
          </div>

          {/* إجمالي */}
          <div className="appt-stat-card">
            <div className="appt-stat-icon blue">📅</div>
            <div className="appt-stat-info">
              <h3>{totalSlots}</h3>
              <span>إجمالي المواعيد</span>
            </div>
          </div>
        </div>

        {/* ───── Filters Bar ───── */}
        <div className="appt-filters-bar">
          <button className="appt-filter-btn-blue">+ إضافة يوم</button>
          <div className="appt-filters-center">
            <div className="appt-filter-group">
              <label>اختر اليوم</label>
              <select>
                {["الأحد","الاثنين","الثلاثاء","الأربعاء"].map((d, i) => (
                  <option key={i}>{d}</option>
                ))}
              </select>
            </div>
            <div className="appt-filter-group">
              <label>اختر الشهر</label>
              <select>
                {["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"].map((m, i) => (
                  <option key={i}>{m}</option>
                ))}
              </select>
            </div>
            <div className="appt-filter-group">
              <label>اختر التاريخ</label>
              <select>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ───── Days Grid ───── */}
        <div className="appt-days">
          {data.map((day, i) => (
            <div className="appt-day-card" key={i}>

              <div className="appt-day-header">
                <div className="appt-day-header-right">
                  <span className="appt-day-name">{day.day}</span>
                  <span className="appt-day-date">{day.date}</span>
                </div>
                <div className="appt-day-header-left">
                  <span className="appt-day-count">
                    {day.times.filter((t) => isBooked(day.date, t)).length}/{day.times.length}
                  </span>
                  <span className="appt-day-icon">📅</span>
                </div>
              </div>

              {day.times.map((time, j) => (
                <div className="appt-slot" key={j}>
                  <span className="appt-slot-time">⏱ {time}</span>
                  {isBooked(day.date, time) ? (
                    <button className="appt-slot-btn booked" disabled>محجوز</button>
                  ) : (
                    <button
                      className="appt-slot-btn available"
                      onClick={() => setSelectedSlot(`${day.date} - ${time}`)}
                    >
                      احجز
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