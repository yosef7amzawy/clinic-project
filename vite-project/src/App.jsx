import { Routes, Route } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Reception from "./pages/Reception";
import Patients from "./pages/Patients";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/reception" element={<Reception />} />
      <Route path="/patients" element={<Patients />} />
    </Routes>
  );
}

export default App;