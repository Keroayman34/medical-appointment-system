import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// استيراد المكتبة الخاصة بالإشعارات
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// استيراد الصفحات الأساسية
import Home from "./pages/home.jsx";
import Doctors from "./pages/doctors.jsx"; 
import Login from "./pages/login.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Profile from "./pages/profile.jsx";
import Appointments from "./pages/appointments.jsx";
import Appoint from "./pages/appoint.jsx";
import Register from "./pages/register.jsx";

// استيراد صفحات الطبيب والأدمن
import DoctorDashboard from "./pages/doctorDashboard.jsx";
import DoctorAppointments from "./pages/doctorAppointments.jsx";
import DoctorProfile from "./pages/doctorProfile.jsx";
import AddDoctor from "./pages/addDoctor.jsx";
import AdminDashboard from "./pages/adminDasboard.jsx"; 

// استيراد المكونات
import Nav from "./components/Nav.jsx";
import Footer from "./components/footer.jsx";

const App = () => {
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);
  const SUPER_ADMIN_ID = "699fea2ba56f11a0a1310905";
  const isSuperAdmin =
    isAuthenticated &&
    user?.role === "admin" &&
    String(user?.id) === SUPER_ADMIN_ID;

  return (
    <div className="mx-3 sm:mx-[12%]">
      {/* حاوية الإشعارات تظهر في كل صفحات التطبيق */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Nav />
      
      <div className="w-full min-h-[80vh]">
        <Routes>
          {/* --- مسارات عامة --- */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors isAdmin={false} />} />
          <Route path="/doctors/:speciality" element={<Doctors isAdmin={false} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment/:docID" element={<Appoint />} />
          <Route path="/Appint/:docID" element={<Appoint />} />
          
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to='/' />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to='/' />} />

          {/* --- مسارات المريض --- */}
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to='/login' />} />
          <Route path="/my-appointments" element={isAuthenticated ? <Appointments /> : <Navigate to='/login' />} />

          {/* --- مسارات الطبيب --- */}
          <Route 
            path="/doctor-dashboard" 
            element={isAuthenticated && user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/doctor-appointments" 
            element={isAuthenticated && user?.role === 'doctor' ? <DoctorAppointments /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/doctor-profile" 
            element={isAuthenticated && user?.role === 'doctor' ? <DoctorProfile /> : <Navigate to='/login' />} 
          />

          {/* --- مسارات الأدمن --- */}
          <Route 
            path="/admin-dashboard" 
            element={isSuperAdmin ? <AdminDashboard /> : <Navigate to='/' />} 
          />
          <Route 
            path="/add-doctor" 
            element={isSuperAdmin ? <AddDoctor /> : <Navigate to='/' />} 
          />
          <Route 
            path="/admin-all-doctors" 
            element={isSuperAdmin ? <Doctors isAdmin={true} /> : <Navigate to='/' />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;