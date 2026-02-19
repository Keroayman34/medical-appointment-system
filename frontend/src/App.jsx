import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Doctors from "./pages/doctors.jsx";
import Login from "./pages/login.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Profile from "./pages/profile.jsx";
import Appointments from "./pages/appointments.jsx";
import Appoint from "./pages/appoint.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/footer.jsx";
import Register from "./pages/register.jsx";


const App = () => {
  return(
    <>
    <div className="mx-3 sm:mx-[12%]">
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/doctors/:speciality" element={<Doctors/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/appointments" element={<Appointments/>}/>
        <Route path="/Appint/:docID" element={<Appoint/>}/>
      </Routes>
      <Footer/>
    </div>
    </>
  )
}

export default App;