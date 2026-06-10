import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [error, setError] = useState("");
{/*
  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("https://localhost:7232/api/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      if (data.role !== role) {
        setError("لقد اخترت نوع مستخدم خاطئ");
        return;
      }

      localStorage.setItem("role", "doctor");

      if (data.role === "doctor") {
        navigate("/patients");
      } else if (data.role === "receptionist") {
        navigate("/reception");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    }
  };*/}
  const handleLogin = () => {
  localStorage.setItem("role", "doctor");
  navigate("/patients");
};

  return (
    <div className="login-container">

      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-text">
            <h3>عيادة الباطنة</h3>
            <span>Internal Medicine Clinic</span>
          </div>
          <div className="login-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
          </div>
        </div>

        <div className="login-hero">
          <h1>نظام إدارة عيادة متكامل</h1>
          <p>احجز المواعيد، تابع المرضى، وأدر استقبال العيادة من مكان واحد بتجربة احترافية وآمنة.</p>
        </div>

        <div className="login-stats">
          <div className="login-stat">
            <span className="stat-value">24/7</span>
            <span className="stat-label">دعم</span>
          </div>
          <div className="login-stat">
            <span className="stat-value">98%</span>
            <span className="stat-label">رضا</span>
          </div>
          <div className="login-stat">
            <span className="stat-value">1.2k+</span>
            <span className="stat-label">مريض</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-header">
          <h2>👋 مرحباً بعودتك</h2>
          <p>سجّل دخولك للوصول إلى لوحة التحكم الخاصة بك.</p>
        </div>

        <div className="form-group">
          <label className="form-label">نوع المستخدم</label>
          <div className="role-selector">
            <button
              className={`role-btn ${role === "doctor" ? "active" : ""}`}
              onClick={() => setRole("doctor")}
            >
              <span className="role-icon">👨‍⚕️</span>
              طبيب
            </button>
            <button
              className={`role-btn ${role === "receptionist" ? "active" : ""}`}
              onClick={() => setRole("receptionist")}
            >
              <span className="role-icon">🧑‍💼</span>
              موظف استقبال
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            className="form-input"
            placeholder="name@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">كلمة المرور</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" onClick={handleLogin}>
          تسجيل الدخول
        </button>

        <p className="login-terms">
          بتسجيل الدخول فأنت توافق على شروط الاستخدام وسياسة الخصوصية.
        </p>
      </div>

    </div>
  );
}

export default Login;