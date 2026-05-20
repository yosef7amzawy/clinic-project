import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const handlePatientsPage = (e) => {

    const role = localStorage.getItem("role");

    if (role === "receptionist") {

      e.preventDefault();

      const msg = document.createElement("div");

      msg.className = "access-denied-message";

      msg.innerText = "غير مصرح لك بالدخول لهذه الصفحة";

      document.body.appendChild(msg);

      setTimeout(() => {
        msg.remove();
      }, 2500);

      return;
    }

    navigate("/patients");
  };

  return (
    <div className="sidebar">
      <h2>🏥 عيادة الباطنة</h2>

      <ul>

        <li className={location.pathname === "/appointments" ? "active" : ""}>
          <Link to="/appointments">المواعيد</Link>
        </li>

        <li className={location.pathname === "/reception" ? "active" : ""}>
          <Link to="/reception">الاستقبال</Link>
        </li>

        <li className={location.pathname === "/login" ? "active" : ""}>
          <Link to="/login">تسجيل الدخول</Link>
        </li>

        <li className={location.pathname === "/patients" ? "active" : ""}>
          <Link to="/patients" onClick={handlePatientsPage}>
            المرضى
          </Link>
        </li>

      </ul>

      <div className="sidebar-footer">
        <h4>عيادة الباطنة 🗂</h4>
        <p>د. أحمد محمد الشرقاوي</p>
        <span>الأحد - الأربعاء</span>
        <span>10:00 ص - 4:00 م</span>
      </div>
    </div>
  );
}

export default Sidebar;