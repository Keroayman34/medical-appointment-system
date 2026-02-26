import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux' // استيراد useSelector عشان نعرف مين اللي مسجل دخول
import { asts } from '../assets/assets'

const Sidebar = () => {
    // جلب بيانات المستخدم من الـ auth slice
    const { user } = useSelector((state) => state.auth);

    return (
        <div className='min-h-screen bg-white border-r'>
            <ul className='text-[#515151] mt-5'>

                {/* --- روابط الدكتور (تظهر فقط لو الدور doctor) --- */}
                {user && user.role === 'doctor' && (
                    <>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/doctor-dashboard'}>
                            <img className='w-5' src={asts.home_icon} alt="" />
                            <p className='hidden md:block'>Dashboard</p>
                        </NavLink>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/doctor-appointments'}>
                            <img className='w-5' src={asts.appointment_icon} alt="" />
                            <p className='hidden md:block'>Appointments</p>
                        </NavLink>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/doctor-profile'}>
                            <img className='w-5' src={asts.people_icon} alt="" />
                            <p className='hidden md:block'>Profile</p>
                        </NavLink>
                    </>
                )}

                {/* --- روابط الأدمن (تظهر فقط لو الدور admin) --- */}
                {user && user.role === 'admin' && (
                    <>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/admin-dashboard'}>
                            <img className='w-5' src={asts.home_icon} alt="" />
                            <p className='hidden md:block'>Admin Dashboard</p>
                        </NavLink>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/add-doctor'}>
                            <img className='w-5' src={asts.add_icon} alt="" /> {/* تأكد من وجود أيقونة add_icon */}
                            <p className='hidden md:block'>Add Doctor</p>
                        </NavLink>
                        <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-main' : ''}`} to={'/admin-all-doctors'}>
                            <img className='w-5' src={asts.people_icon} alt="" />
                            <p className='hidden md:block'>Doctors List</p>
                        </NavLink>
                    </>
                )}

            </ul>
        </div>
    )
}

export default Sidebar