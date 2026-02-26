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
  // جلب بيانات المستخدم والتوكن من الـ Redux
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);

  return (
    <div className="mx-3 sm:mx-[12%]">
      {/* الشريط العلوي */}
      <Nav />
      
      {/* حاوية المحتوى الرئيسية */}
      <div className="w-full min-h-[80vh]">
        <Routes>
          {/* --- مسارات عامة (متاحة للجميع) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors isAdmin={false} />} />
          <Route path="/doctors/:speciality" element={<Doctors isAdmin={false} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment/:docID" element={<Appoint />} />
          <Route path="/Appint/:docID" element={<Appoint />} />
          
          {/* حماية صفحات الدخول: لو مسجل دخول بالفعل يتم توجيهه للرئيسية */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to='/' />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to='/' />} />

          {/* --- مسارات المريض (تتطلب تسجيل دخول) --- */}
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to='/login' />} />
          <Route path="/my-appointments" element={isAuthenticated ? <Appointments /> : <Navigate to='/login' />} />

          {/* --- مسارات الطبيب (تتطلب دور doctor) --- */}
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

          {/* --- مسارات الأدمن (تتطلب دور admin) --- */}
          <Route 
            path="/admin-dashboard" 
            element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/add-doctor" 
            element={isAuthenticated && user?.role === 'admin' ? <AddDoctor /> : <Navigate to='/login' />} 
          />
          <Route 
            path="/admin-all-doctors" 
            element={isAuthenticated && user?.role === 'admin' ? <Doctors isAdmin={true} /> : <Navigate to='/login' />} 
          />

          {/* مسار احتياطي في حال طلب رابط غير موجود */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;