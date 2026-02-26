import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// 1. استيراد الأكشنز من الـ Slice
import { fetchMyAppointments, cancelAppointment } from "../redux/slices/appointmentSlice";

const Appointment = () => {
    const dispatch = useDispatch();
    
    // جلب البيانات من Redux
    const { myAppointments, loading } = useSelector((state) => state.appointments);

    // 2. جلب المواعيد بمجرد فتح الصفحة
    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    // 3. دالة التعامل مع زر الإلغاء
    const handleCancel = (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            dispatch(cancelAppointment(appointmentId));
        }
    };

    if (loading) return <p className="text-center py-20 text-xl font-medium">Loading your appointments...</p>;

    return (
        <div className="md:mx-10">
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b text-xl">My Appointments</p>
            <div>
                {myAppointments && myAppointments.length > 0 ? (
                    myAppointments.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b transition-all hover:bg-gray-50/50">
                            <div>
                                <img className="w-32 bg-indigo-50 rounded-lg shadow-sm" src={item.doctor?.image || ""} alt="Doctor" />
                            </div>
                            <div className="flex-1 text-sm text-zinc-600">
                                <p className="text-neutral-800 font-semibold text-lg">{item.doctor?.user?.name}</p>
                                <p className="text-main font-medium">{item.doctor?.specialty}</p>
                                <p className="text-zinc-700 font-medium mt-2">Address:</p>
                                <p className="text-xs text-gray-500">Assiut, Egypt</p> 
                                <p className="text-xs mt-3">
                                    <span className="text-sm text-neutral-700 font-medium">Date & Time:</span> 
                                    <span className="ml-1 text-gray-600">
                                        {new Date(item.date).toLocaleDateString('en-GB')} | {item.startTime}
                                    </span>
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 justify-end pb-2">
                                {/* 4. تحسين الأزرار: لو الموعد ملغي اظهر كلمة Cancelled */}
                                {item.status !== 'cancelled' ? (
                                    <>
                                        <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-main hover:text-white transition-all duration-300">
                                            Pay Online
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(item._id)} 
                                            className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                        >
                                            Cancel Appointment
                                        </button>
                                    </>
                                ) : (
                                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 bg-red-50 cursor-not-allowed">
                                        Appointment Cancelled
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center">
                         <p className="text-gray-500 text-lg">You have no appointments booked yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointment;