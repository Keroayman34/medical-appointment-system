import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyAppointments, cancelAppointment } from "../redux/slices/appointmentSlice";
import { toast } from "react-toastify";
import { asts } from "../assets/assets.js";

const Appointment = () => {
    const dispatch = useDispatch();
    
    const { myAppointments, loading } = useSelector((state) => state.appointment);

    const isMongoId = (str) => {
        return typeof str === 'string' && /^[0-9a-f]{24}$/i.test(str);
    };

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const confirmCancelWithToast = (appointmentId) => {
        toast.info(
            ({ closeToast }) => (
                <div className="text-sm">
                    <p className="font-semibold text-[#355872] mb-2">Are you sure you want to cancel this appointment?</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            onClick={async () => {
                                closeToast();
                                const result = await dispatch(cancelAppointment(appointmentId));
                                if (result.meta.requestStatus === "fulfilled") {
                                    toast.success("Appointment cancelled successfully");
                                } else {
                                    toast.error(result.payload || "Could not cancel appointment");
                                }
                            }}
                        >
                            Yes, Cancel
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-md border border-[#7AAACE]/60 text-[#355872] bg-white hover:bg-[#F7F8F0] transition-colors"
                            onClick={closeToast}
                        >
                            Keep Appointment
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            },
        );
    };

    // 3. دالة التعامل مع زر الإلغاء
    const handleCancel = (appointmentId) => {
        confirmCancelWithToast(appointmentId);
    };

    if (loading) return <p className="text-center py-20 text-xl font-semibold text-[#355872]">Loading your appointments...</p>;

    return (
        <div className="md:mx-10">
            <p className="pb-3 mt-12 font-bold text-[#355872] border-b-2 border-[#7AAACE]/60 text-3xl">My Appointments</p>
            <div className="mt-3 space-y-3">
                {myAppointments && myAppointments.length > 0 ? (
                    myAppointments.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 px-4 border border-[#7AAACE]/55 bg-[#F7F8F0]/85 rounded-2xl shadow-sm transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-md">
                            <div>
                                <img className="w-32 h-24 object-cover bg-[#7AAACE]/25 rounded-xl shadow-sm border border-[#7AAACE]/45" src={item.doctor?.user?.image || item.doctor?.image || asts.doc} alt="Doctor" />
                            </div>
                            <div className="flex-1 text-sm text-[#355872]">
                                <p className="text-[#355872] font-bold text-2xl">{item.doctor?.user?.name || "Doctor"}</p>
                                {!isMongoId(item.doctor?.specialty?.name) && item.doctor?.specialty?.name && (
                                    <p className="text-main font-bold">{item.doctor?.specialty?.name}</p>
                                )}
                                {!isMongoId(item.doctor?.specialty) && item.doctor?.specialty && typeof item.doctor?.specialty === 'string' && (
                                    <p className="text-main font-bold">{item.doctor?.specialty}</p>
                                )}
                                <p className="text-[#355872] font-semibold mt-2">Address:</p>
                                <p className="text-sm text-[#355872]/90">Assiut, Egypt</p> 
                                <p className="text-xs mt-3">
                                    <span className="text-sm text-[#355872] font-semibold">Date & Time:</span> 
                                    <span className="ml-1 text-[#355872] font-medium">
                                        {new Date(item.date).toLocaleDateString('en-GB')} | {item.startTime}
                                    </span>
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 justify-end pb-2">
                                {/* 4. تحسين الأزرار: لو الموعد ملغي اظهر كلمة Cancelled */}
                                {item.status !== 'cancelled' ? (
                                    <>
                                        <button className="text-sm font-semibold text-white text-center sm:min-w-48 py-2 border border-main bg-main rounded-lg hover:opacity-90 transition-all duration-300">
                                            Pay Online
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(item._id)} 
                                            className="text-sm font-semibold text-red-700 text-center sm:min-w-48 py-2 border border-red-300 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                                        >
                                            Cancel Appointment
                                        </button>
                                    </>
                                ) : (
                                    <button className="sm:min-w-48 py-2 border border-red-500 rounded-lg text-red-600 bg-red-50 cursor-not-allowed">
                                        Appointment Cancelled
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center">
                         <p className="text-[#355872]/80 text-lg">You have no appointments booked yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointment;