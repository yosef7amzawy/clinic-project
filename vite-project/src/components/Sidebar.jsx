import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();


const handlePatientsPage = () => {
  navigate("/patients");
};


  //const handlePatientsPage = (e) => {
   // const role = localStorage.getItem("role");
    //if (role === "receptionist") {
   //   e.preventDefault();
    //  const msg = document.createElement("div");
     // msg.className = "access-denied-message";
     // msg.innerText = "غير مصرح لك بالدخول لهذه الصفحة";
     // document.body.appendChild(msg);
      //setTimeout(() => msg.remove(), 2500);
     // return;
    //}
   // navigate("/patients");
  //};

  return (
    <div className="sidebar">

      <div>
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <h3>عيادة الباطنة</h3>
            <span>نظام إدارة العيادة</span>
          </div>
          <div className="sidebar-brand-icon">
  <img src={logo} alt="Clinic Logo" className="sidebar-logo" />
          </div>
        </div>

        <p className="sidebar-section-label">القائمة الرئيسية</p>

        <ul>
          <li className={location.pathname === "/appointments" ? "active" : ""}>
            <Link to="/appointments">📅 المواعيد</Link>
          </li>
          <li className={location.pathname === "/reception" ? "active" : ""}>
            <Link to="/reception">📋 الاستقبال</Link>
          </li>
          <li className={location.pathname === "/login" ? "active" : ""}>
            <Link to="/login">🔐 تسجيل الدخول</Link>
          </li>
          <li className={location.pathname === "/patients" ? "active" : ""}>
            <Link to="/patients" onClick={handlePatientsPage}>👥 المرضى</Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-text">
            <h4>د. أحمد محمد الشرقاوي</h4>
            <span>استشاري باطنة</span>
            <span>الأحد - الأربعاء | 10:00 ص - 4:00 م</span>
          </div>
          <div className="sidebar-footer-avatar">👨‍⚕️</div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;