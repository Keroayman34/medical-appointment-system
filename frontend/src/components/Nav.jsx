import React from "react";
import { asts } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

let Nav = () => {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navg = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navg('/login');
    }

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            {/* اللوجو */}
            <img onClick={() => navg('/')} src={asts.logo} alt="logo" className="w-44 cursor-pointer" />

            <ul className="hidden md:flex items-start gap-5 font-medium uppercase">
                <NavLink to="/">
                    <li className="py-1">Home</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">All Doctors</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                </NavLink>

                {/* روابط الدكتور */}
                {token && user?.role === 'doctor' && (
                    <>
                        <NavLink to="/doctor-dashboard">
                            <li className="py-1">Dashboard</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                        <NavLink to="/doctor-appointments">
                            <li className="py-1">Appointments</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                        {/* تعديل 1: إضافة رابط البروفايل للدكتور في القائمة العلوية */}
                        <NavLink to="/doctor-profile">
                            <li className="py-1 text-green-600">Profile</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                    </>
                )}

                {/* روابط الأدمن */}
                {token && user?.role === 'admin' && (
                    <>
                        <NavLink to="/admin-dashboard">
                            <li className="py-1 text-main">Admin Panel</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                        <NavLink to="/add-doctor">
                            <li className="py-1">Add Doctor</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                        <NavLink to="/admin-all-doctors">
                            <li className="py-1">Manage</li>
                            <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden" />
                        </NavLink>
                    </>
                )}
            </ul>

            <div className="flex items-center gap-4">
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img className="w-8 h-8 rounded-full object-cover border" src={user?.image || asts.prof} alt="profile" />
                        <img className="w-2.5" src={asts.dropdown_icon} alt="" />
                        
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md border">
                                
                                {/* تعديل 2: لو المستخدم مريض يروح لـ /profile، لو دكتور يروح لـ /doctor-profile */}
                                {user?.role === 'doctor' ? (
                                    <p onClick={() => navg('/doctor-profile')} className="hover:text-black cursor-pointer font-bold text-green-600">My Doctor Profile</p>
                                ) : (
                                    <p onClick={() => navg('/profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                )}

                                <p onClick={() => navg('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                                <hr className="border-gray-300" />
                                <p onClick={handleLogout} className="hover:text-red-700 cursor-pointer text-red-500 font-semibold">Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                         <button onClick={() => navg('/login')} className="text-gray-600 px-4 py-3 hover:text-main transition-all">Login</button>
                         <button onClick={() => navg('/register')} className="bg-main text-white px-8 py-3 rounded-full hidden md:block hover:bg-opacity-90 transition-all">Create Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Nav;