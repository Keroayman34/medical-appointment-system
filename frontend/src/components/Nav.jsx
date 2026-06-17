import React from "react";
import { asts } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice.js';

const Nav = () => {
    const { user, token } = useSelector(state => state.auth);
    const isAuthenticated = Boolean(token && user);
    const SUPER_ADMIN_ID = "699fea2ba56f11a0a1310905";
    const isSuperAdmin =
        isAuthenticated &&
        user?.role === 'admin' &&
        String(user?.id) === SUPER_ADMIN_ID;
    const profileBadgeClasses =
        user?.role === 'doctor'
            ? 'bg-[#9CD5FF]/35 border-[#7AAACE]/70 text-[#1f4f73]'
            : user?.role === 'admin'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-white border-[#7AAACE]/40 text-[#355872]';
    const dispatch = useDispatch();
    const navg = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navg('/login');
    }

    // دالة مساعدة لتنسيق الروابط النشطة
    const linkStyle = ({ isActive }) => (
        isActive
            ? "px-3 py-2 rounded-full bg-main/10 text-main font-bold"
            : "px-3 py-2 rounded-full text-[#355872] hover:bg-[#9CD5FF]/40 transition-all"
    );

    return (
        <div className="sticky top-3 z-50 mb-6">
            <div className="flex items-center justify-between text-sm px-4 py-3 rounded-2xl border border-[#7AAACE]/40 bg-[#F7F8F0]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(53,88,114,0.12)]">
            {/* 1. اللوجو */}
            <img 
                onClick={() => navg('/')} 
                src="/vite.svg" 
                alt="logo" 
                className="w-11 h-11 cursor-pointer hover:opacity-80 transition-opacity" 
            />

            {/* 2. القائمة الرئيسية (تتغير حسب الصلاحيات) */}
            <ul className="hidden md:flex items-start gap-2 font-semibold tracking-wide">
                <NavLink to="/" className={linkStyle}><li>Home</li></NavLink>
                <NavLink to="/doctors" className={linkStyle}><li>All Doctors</li></NavLink>

                {/* روابط الدكتور فقط */}
                {isAuthenticated && user?.role === 'doctor' && (
                    <>
                        <NavLink to="/doctor-dashboard" className={linkStyle}><li>Dashboard</li></NavLink>
                        <NavLink to="/doctor-appointments" className={linkStyle}><li>Appointments</li></NavLink>
                    </>
                )}

                {/* روابط الأدمن فقط */}
                {isSuperAdmin && (
                    <>
                        <NavLink to="/admin-dashboard" className={linkStyle}><li className="text-main font-bold">Admin Panel</li></NavLink>
                        <NavLink to="/add-doctor" className={linkStyle}><li>Add Doctor</li></NavLink>
                    </>
                )}
            </ul>

            {/* 3. منطقة الحساب (Profile / Login) */}
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${profileBadgeClasses}`}>
                            <img className="w-8 h-8 rounded-full object-cover" src={user?.image || asts.prof} alt="profile" />
                            <span className="text-xs font-bold hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
                            <img className="w-2.5" src={asts.dropdown_icon} alt="" />
                        </div>
                        
                        {/* القائمة المنسدلة (Dropdown) */}
                        <div className="absolute top-full right-0 pt-2 text-base font-medium text-gray-600 z-50 hidden group-hover:block transition-all animate-fadeIn">
                            <div className="min-w-56 bg-white rounded-xl flex flex-col gap-1 p-2 shadow-xl border border-[#7AAACE]/30">
                                
                                {/* لو دكتور يروح لبروفايل الدكتور، لو مريض يروح للبروفايل الشخصي */}
                                {user?.role === 'doctor' ? (
                                    <p onClick={() => navg('/doctor-profile')} className="hover:bg-[#9CD5FF]/30 p-3 rounded-lg cursor-pointer font-bold text-main">My Doctor Profile</p>
                                ) : (
                                    <p onClick={() => navg('/profile')} className="hover:bg-[#9CD5FF]/30 p-3 rounded-lg cursor-pointer">My Profile</p>
                                )}

                                {/* رابط مواعيد المريض يظهر للمريض فقط */}
                                {user?.role === 'patient' && (
                                    <p onClick={() => navg('/my-appointments')} className="hover:bg-[#9CD5FF]/30 p-3 rounded-lg cursor-pointer">My Appointments</p>
                                )}

                                <hr className="my-1 border-gray-100" />
                                <p onClick={handleLogout} className="hover:bg-red-50 p-3 rounded-lg cursor-pointer text-red-500 font-bold">Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => navg('/login')} className="text-[#355872] font-semibold px-4 py-2 rounded-full hover:bg-[#9CD5FF]/35 transition-colors">Login</button>
                        <button type="button" onClick={() => navg('/register')} className="bg-main text-white px-8 py-2.5 rounded-full hidden md:block hover:shadow-lg hover:bg-[#2c4960] transition-all active:scale-95">Create Account</button>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

export default Nav;