import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [error, setError] = useState("");

  const handleLogin = async () => {

    setError("");

    try {

      const response = await fetch("https://localhost:7232/api/Users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      // منع اختيار role غلط
      if (data.role !== role) {
        setError("لقد اخترت نوع مستخدم خاطئ");
        return;
      }

      // تخزين الـ role
      localStorage.setItem("role", data.role);

      // التنقل بين الصفحات
      if (data.role === "doctor") {

        navigate("/patients");

      } else if (data.role === "receptionist") {

        navigate("/reception");

      }

    } catch (error) {

      setError("حدث خطأ أثناء تسجيل الدخول");

    }
  };

  return (

    <div className="login-container">

      <div className="login-left">
        <h1>نظام حجز مواعيد عيادة الدكتور فلان الفلاني</h1>
      </div>

      <div className="login-right">

        <h2>تسجيل الدخول</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-roles">

          <label>
            <input
              type="radio"
              name="role"
              checked={role === "doctor"}
              onChange={() => setRole("doctor")}
            />
            Doctor
          </label>

          <label>
            <input
              type="radio"
              name="role"
              checked={role === "receptionist"}
              onChange={() => setRole("receptionist")}
            />
            Receptionist
          </label>

        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          تسجيل الدخول
        </button>

      </div>

    </div>

  );
}

export default Login;