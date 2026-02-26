import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

  return (
    <div className="mx-3 sm:mx-[12%]">
      {/* 1. الشريط العلوي ثابت ويحتوي الآن على روابط التحكم */}
      <Nav />
      
      {/* 2. حاوية المحتوى: تأخذ العرض الكامل الآن بعد حذف الـ Sidebar */}
      <div className="w-full min-h-[80vh]">
        <Routes>
          {/* --- مسارات عامة --- */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors isAdmin={false} />} />
          <Route path="/doctors/:speciality" element={<Doctors isAdmin={false} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* حماية صفحات الدخول: لو مسجل دخول بالفعل يروح للرئيسية */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to='/' />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to='/' />} />

          {/* --- مسارات المريض (تطلب تسجيل دخول) --- */}
          <Route path="/profile" element={token ? <Profile /> : <Navigate to='/login' />} />
          <Route path="/my-appointments" element={token ? <Appointments /> : <Navigate to='/login' />} />
          <Route path="/Appint/:docID" element={<Appoint />} />

          {/* --- مسارات الطبيب (تطلب دور doctor) --- */}
          <Route 
            path="/doctor-dashboard" 
            element={token && user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/doctor-appointments" 
            element={token && user?.role === 'doctor' ? <DoctorAppointments /> : <Navigate to='/login' />} 
          />

          <Route path="/doctor-profile" element={token && user?.role === 'doctor' ? <DoctorProfile /> : <Navigate to='/login' />} />

          {/* --- مسارات الأدمن (تطلب دور admin) --- */}
          <Route 
            path="/admin-dashboard" 
            element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/add-doctor" 
            element={token && user?.role === 'admin' ? <AddDoctor /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/admin-all-doctors" 
            element={token && user?.role === 'admin' ? <Doctors isAdmin={true} /> : <Navigate to='/login' />} 
          />
        </Routes>
      </div>

      {/* الفوتر يظهر في كل الصفحات بشكل طبيعي الآن */}
      <Footer />
    </div>
  );
};

export default App;