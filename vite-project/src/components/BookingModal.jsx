import { useState } from "react";

function BookingModal({ slot, onClose }) {

  // states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // حالة الدفع
  const [paymentType, setPaymentType] = useState("unpaid");

  // الرسائل
  const [toast, setToast] = useState({
    show: false,
    text: "",
    type: ""
  });

  if (!slot) return null;

  const bookingId = "4" + Math.floor(Math.random() * 1000000);

  // Toast
  const showToast = (text, type) => {

    setToast({
      show: true,
      text,
      type
    });

    setTimeout(() => {

      setToast({
        show: false,
        text: "",
        type: ""
      });

      if (type === "success") {
        onClose();
      }

    }, 2000);

  };

  // save booking
  const handleBooking = async () => {

    // تقسيم التاريخ والوقت
    const [datePart, timePart] = slot.split(" - ");

    try {

      // إضافة المريض
      const patientRes = await fetch("https://localhost:7232/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_Name: name,
          phone: phone
        })
      });

      const patient = await patientRes.json();

      // حالة الدفع
      const paymentStatus =
        paymentType === "paid"
          ? "تم الدفع"
          : "سيتم الدفع عند الحضور";

      // إضافة الموعد
      const response = await fetch("https://localhost:7232/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_Id: patient.id,
          date: datePart,
          time: timePart + ":00",
          status: paymentStatus
        })
      });

      const result = await response.json();

      console.log(result);

      // localStorage
      const savedAppointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

      savedAppointments.push({
        date: datePart,
        time: timePart,
        patientName: name,
        phone: phone,
        status: paymentStatus
      });

      localStorage.setItem(
        "appointments",
        JSON.stringify(savedAppointments)
      );

      // نجاح
      showToast("✅ تم الحجز بنجاح", "success");

    } catch (error) {

      console.log(error);

      // خطأ
      showToast("❌ حدث خطأ أثناء الحجز", "error");

    }

  };

  return (

    <>

      {/* Toast */}

      {toast.show && (

        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              toast.type === "success"
                ? "#e8f5e9"
                : "#ffebee",
            color:
              toast.type === "success"
                ? "#1b5e20"
                : "#c62828",
            padding: "18px 35px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "20px",
            zIndex: "999999",
            boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
          }}
        >
          {toast.text}
        </div>

      )}

      <div className="modal-overlay" onClick={onClose}>

        <div className="modal" onClick={(e) => e.stopPropagation()}>

          <div className="modal-header">

            <h3>إضافة حجز جديد</h3>

            <button
              className="modal-close"
              onClick={onClose}
            >
              ✕
            </button>

          </div>

          <div className="modal-row">

            <div className="modal-field">

              <label>الموعد</label>

              <input
                type="text"
                value={slot}
                readOnly
              />

            </div>

            <div className="modal-field">

              <label>رقم الحجز</label>

              <input
                type="text"
                value={bookingId}
                readOnly
              />

            </div>

          </div>

          <div className="modal-field">

            <label>الاسم الكامل *</label>

            <input
              type="text"
              placeholder="اسم المريض"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          <div className="modal-field">

            <label>رقم الهاتف *</label>

            <input
              type="text"
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

          </div>

          <div className="modal-row">

            <div className="modal-field">

              <label>تاريخ الميلاد</label>

              <input type="date" />

            </div>

            <div className="modal-field">

              <label>الجنس</label>

              <div className="modal-radios">

                <label>
                  <input type="radio" name="gender" />
                  ذكر
                </label>

                <label>
                  <input type="radio" name="gender" />
                  أنثى
                </label>

              </div>

            </div>

          </div>

          <div className="modal-field">

            <label>العنوان</label>

            <input
              type="text"
              placeholder="عنوان المريض"
            />

          </div>

          {/* طريقة الدفع */}

          <div className="modal-field">

            <label>
              <strong>طريقة الدفع</strong>
            </label>

            <div className="modal-payment">

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === "unpaid"}
                  onChange={() => setPaymentType("unpaid")}
                />

                الدفع عند الحضور

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === "paid"}
                  onChange={() => setPaymentType("paid")}
                />

                الدفع عبر الإنترنت

              </label>

            </div>

          </div>

          {/* رسالة الدفع عند الحضور */}

          {paymentType === "unpaid" && (

            <div
              style={{
                marginTop: "10px",
                padding: "12px",
                background: "#fff3cd",
                color: "#856404",
                borderRadius: "8px",
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              سيتم الدفع عند الحضور 💰
            </div>

          )}

          {/* فودافون كاش */}

          {paymentType === "paid" && (

            <div className="modal-field">

              <label>وسيلة الدفع:</label>

              <div className="modal-payment">

                <label className="payment-option selected">

                  <input
                    type="radio"
                    checked
                    readOnly
                  />

                  📱 فودافون كاش

                </label>

              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  background: "#e8f5e9",
                  color: "#1b5e20",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                يرجى دفع 200 ج للرقم التالي:
                <br />
                01012345678
              </div>

            </div>

          )}

          <div className="modal-actions">

            <button
              className="modal-save"
              onClick={handleBooking}
            >
              حفظ
            </button>

            <button
              className="modal-cancel"
              onClick={onClose}
            >
              إلغاء
            </button>

          </div>

        </div>

      </div>

    </>

  );
}

export default BookingModal;