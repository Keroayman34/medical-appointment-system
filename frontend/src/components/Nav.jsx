import React from "react";
import { asts } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice.js';

const Nav = () => {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navg = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navg('/login');
    }

    // دالة مساعدة لتنسيق الروابط النشطة
    const linkStyle = ({ isActive }) => (
        isActive ? "py-1 border-b-2 border-main font-bold text-main" : "py-1 hover:text-main transition-all"
    );

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 bg-white sticky top-0 z-50">
            {/* 1. اللوجو */}
            <img 
                onClick={() => navg('/')} 
                src={asts.logo} 
                alt="logo" 
                className="w-40 cursor-pointer hover:opacity-80 transition-opacity" 
            />

            {/* 2. القائمة الرئيسية (تتغير حسب الصلاحيات) */}
            <ul className="hidden md:flex items-start gap-6 font-medium uppercase tracking-wider">
                <NavLink to="/" className={linkStyle}><li>Home</li></NavLink>
                <NavLink to="/doctors" className={linkStyle}><li>All Doctors</li></NavLink>

                {/* روابط الدكتور فقط */}
                {token && user?.role === 'doctor' && (
                    <>
                        <NavLink to="/doctor-dashboard" className={linkStyle}><li>Dashboard</li></NavLink>
                        <NavLink to="/doctor-appointments" className={linkStyle}><li>Appointments</li></NavLink>
                    </>
                )}

                {/* روابط الأدمن فقط */}
                {token && user?.role === 'admin' && (
                    <>
                        <NavLink to="/admin-dashboard" className={linkStyle}><li className="text-main font-bold italic">Admin Panel</li></NavLink>
                        <NavLink to="/add-doctor" className={linkStyle}><li>Add Doctor</li></NavLink>
                    </>
                )}
            </ul>

            {/* 3. منطقة الحساب (Profile / Login) */}
            <div className="flex items-center gap-4">
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                            <img className="w-8 h-8 rounded-full object-cover" src={user?.image || asts.prof} alt="profile" />
                            <span className="text-xs font-bold text-gray-700 hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
                            <img className="w-2.5" src={asts.dropdown_icon} alt="" />
                        </div>
                        
                        {/* القائمة المنسدلة (Dropdown) */}
                        <div className="absolute top-full right-0 pt-2 text-base font-medium text-gray-600 z-50 hidden group-hover:block transition-all animate-fadeIn">
                            <div className="min-w-56 bg-white rounded-lg flex flex-col gap-1 p-2 shadow-xl border border-gray-100">
                                
                                {/* لو دكتور يروح لبروفايل الدكتور، لو مريض يروح للبروفايل الشخصي */}
                                {user?.role === 'doctor' ? (
                                    <p onClick={() => navg('/doctor-profile')} className="hover:bg-gray-100 p-3 rounded cursor-pointer font-bold text-green-600">My Doctor Profile</p>
                                ) : (
                                    <p onClick={() => navg('/profile')} className="hover:bg-gray-100 p-3 rounded cursor-pointer">My Profile</p>
                                )}

                                {/* رابط مواعيد المريض يظهر للمريض فقط */}
                                {user?.role === 'user' && (
                                    <p onClick={() => navg('/my-appointments')} className="hover:bg-gray-100 p-3 rounded cursor-pointer">My Appointments</p>
                                )}

                                <hr className="my-1 border-gray-100" />
                                <p onClick={handleLogout} className="hover:bg-red-50 p-3 rounded cursor-pointer text-red-500 font-bold">Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                         <button onClick={() => navg('/login')} className="text-gray-600 font-medium px-4 py-2 hover:text-main transition-colors">Login</button>
                         <button onClick={() => navg('/register')} className="bg-main text-white px-8 py-2.5 rounded-full hidden md:block hover:shadow-lg transition-all active:scale-95">Create Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Nav;