import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BookingModal from "../components/BookingModal";
import "../styles/reception.css";

const times = ["10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00"];
const allowedDays = ["2026-05-17","2026-05-18","2026-05-19","2026-05-20"];

function Reception() {
  const [activeDay, setActiveDay] = useState("2026-05-17");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [data, setData] = useState({});

  const fetchData = (keepDay = "") => {
    fetch("https://localhost:7232/api/appointments")
      .then((res) => res.json())
      .then((result) => {
        const groupedData = {};
        result.forEach((item) => {
          const day = item.date.split("T")[0];
          if (!groupedData[day]) groupedData[day] = [];
          groupedData[day].push({
            time: item.time.substring(0, 5),
            name: item.patientName || "Patient",
            phone: item.phone || "01000000000",
            id: item.id,
            status: item.status || "pending",
          });
        });
        const filteredData = {};
        allowedDays.forEach((day) => {
          filteredData[day] = groupedData[day] || [];
        });
        setData(filteredData);
        if (keepDay) setActiveDay(keepDay);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const todayBookings = (data[activeDay] || []).length;
  const pendingCount  = (data[activeDay] || []).filter(b => b.status === "pending").length;
  const paidCount     = (data[activeDay] || []).filter(b => b.status === "paid").length;

  return (
    <div className="container" dir="rtl">
      <Sidebar />

      <div className="main">

        {/* ───── Header ───── */}
        <div className="rec-header">
          <div className="rec-header-right">
            <div className="rec-subtitle">
              <span>📋</span> قسم الاستقبال
            </div>
            <h1 className="rec-title">جدول المواعيد</h1>
            <p className="rec-desc">
              متابعة الحجوزات اليومية، إضافة حجوزات جديدة، وتتبع حالة الدفع.
            </p>
          </div>
         { /*<button className="rec-new-btn">+ حجز جديد</button>*/}
        </div>

        {/* ───── Stat Cards ───── */}
        <div className="rec-stats">
          <div className="rec-stat-card">
            <div className="rec-stat-icon yellow">⚠️</div>
            <div className="rec-stat-info">
              <h3>{pendingCount}</h3>
              <span>بانتظار الدفع</span>
            </div>
          </div>

          <div className="rec-stat-card">
            <div className="rec-stat-icon green">✅</div>
            <div className="rec-stat-info">
              <h3>{paidCount}</h3>
              <span>مدفوعة</span>
            </div>
          </div>

          <div className="rec-stat-card">
            <div className="rec-stat-icon blue">📅</div>
            <div className="rec-stat-info">
              <h3>{todayBookings}</h3>
              <span>حجوزات اليوم</span>
            </div>
            <span className="rec-stat-badge">من {times.length}</span>
          </div>
        </div>

        {/* ───── Filters Bar ───── */}
        <div className="rec-filters-bar">
          <button className="rec-filter-btn-blue">+ إضافة يوم</button>
          <div className="rec-filters-center">
            <div className="rec-filter-group">
              <label>اختر اليوم</label>
              <select>
                {["الأحد","الاثنين","الثلاثاء","الأربعاء"].map((d,i) => <option key={i}>{d}</option>)}
              </select>
            </div>
            <div className="rec-filter-group">
              <label>اختر الشهر</label>
              <select>
                {["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"].map((m,i) => <option key={i}>{m}</option>)}
              </select>
            </div>
            <div className="rec-filter-group">
              <label>اختر التاريخ</label>
              <select>
                {Array.from({length:31},(_,i) => <option key={i+1}>{i+1}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ───── Day Tabs — أول يوم على اليمين ───── */}
        <div className="rec-tabs">
          {[...allowedDays].reverse().map((day) => (
            <div
              key={day}
              className={`rec-tab ${activeDay === day ? "active" : ""}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="rec-tab-dot"></span>
              {day}
            </div>
          ))}
        </div>

        {/* ───── Table ───── */}
        <div className="rec-table">
          <div className="rec-table-header">
            <span>الوقت</span>
            <span>اسم المريض</span>
            <span>رقم الهاتف</span>
            <span>رقم الحجز</span>
            <span>الحالة</span>
          </div>

          {times.map((time, index) => {
            const booking = (data[activeDay] || []).find(b => b.time === time);
            return (
              <div className="rec-row" key={index}>
                <span className="rec-time">⏱ {time}</span>
                {booking ? (
                  <>
                    <span>{booking.name}</span>
                    <span>{booking.phone}</span>
                    <span>{booking.id}</span>
                    <span className={`rec-status ${booking.status}`}>
                      {booking.status === "pending" ? "بانتظار الدفع"
                       : booking.status === "paid"  ? "مدفوعة"
                       : booking.status}
                    </span>
                  </>
                ) : (
                  <div
                    className="rec-book-bar"
                    onClick={() => setSelectedSlot(`${activeDay} - ${time}`)}
                  >
                    + إضافة حجز
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