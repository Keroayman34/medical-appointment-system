import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorById } from "../redux/slices/doctorSlice";
import { bookAppointment } from "../redux/slices/appointmentSlice";
import { asts } from "../assets/assets.js";
import RelateDoc from "../components/relateDoc.jsx";
import axios from "axios";

const Appoint = () => {
    const { docID } = useParams();
    const dispatch = useDispatch();
    const navg = useNavigate();
    
    const { selectedDoctor, loading } = useSelector((state) => state.doctors);
    const { token, user } = useSelector((state) => state.auth);
    const isPatient = (user?.role || "").toLowerCase() === "patient";

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [occupiedSet, setOccupiedSet] = useState(new Set());

    useEffect(() => {
        dispatch(fetchDoctorById(docID));
    }, [dispatch, docID]);

    useEffect(() => {
        const loadOccupiedSlots = async () => {
            try {
                const from = new Date();
                const to = new Date();
                to.setDate(to.getDate() + 7);

                const { data } = await axios.get(`/api/appointments/doctor/${docID}/occupied`, {
                    params: {
                        from: from.toISOString().split("T")[0],
                        to: to.toISOString().split("T")[0],
                    },
                });

                const keySet = new Set(
                    (data.occupiedSlots || []).map((item) => `${item.date}_${item.startTime}`),
                );
                setOccupiedSet(keySet);
            } catch {
                setOccupiedSet(new Set());
            }
        };

        loadOccupiedSlots();
    }, [docID]);

    const toMinutes = (timeValue) => {
        const [hours, minutes] = timeValue.split(":").map(Number);
        return (hours * 60) + minutes;
    };

    const minutesToHHmm = (minutes) => {
        const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
        const mins = String(minutes % 60).padStart(2, "0");
        return `${hours}:${mins}`;
    };

    const toDisplayRange = (startHHmm, endHHmm) => {
        const [sh, sm] = startHHmm.split(":").map(Number);
        const [eh, em] = endHHmm.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(sh, sm, 0, 0);
        const endDate = new Date();
        endDate.setHours(eh, em, 0, 0);
        return `${startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    };

    const getSlots = () => {
        if (!selectedDoctor) return;
        
        setDocSlots([]);
        const today = new Date();
        const allSlots = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dayNameLower = dayNames[currentDate.getDay()].toLowerCase();
            const dayConfigs = (selectedDoctor.availabilities || []).filter((item) => item.day === dayNameLower);
            const dateKey = currentDate.toISOString().split("T")[0];

            const ranges = dayConfigs.flatMap((config) => {
                    const startMinutes = toMinutes(config.from);
                    const endMinutes = toMinutes(config.to);
                    const output = [];

                    for (let cursor = startMinutes; cursor + 60 <= endMinutes; cursor += 60) {
                        output.push([
                            minutesToHHmm(cursor),
                            minutesToHHmm(cursor + 60),
                        ]);
                    }

                    return output;
                });

            const slots = ranges
                .map(([startTime, endTime]) => {
                    const slotKey = `${dateKey}_${startTime}`;
                    return {
                        date: dateKey,
                        dateObj: new Date(currentDate),
                        startTime,
                        endTime,
                        displayTime: toDisplayRange(startTime, endTime),
                        isBooked: occupiedSet.has(slotKey),
                    };
                })
                .filter((slot) => {
                    const now = new Date();
                    const slotDateTime = new Date(slot.dateObj);
                    const [h, m] = slot.startTime.split(":").map(Number);
                    slotDateTime.setHours(h, m, 0, 0);
                    return slotDateTime > now;
                });

            allSlots.push(slots);
        }

        setDocSlots(allSlots);
    };

    useEffect(() => {
        getSlots();
    }, [selectedDoctor, occupiedSet]);

    const selectedDaySlots = docSlots[slotIndex] || [];
    const bookedSlotsInSelectedDay = selectedDaySlots.filter((slot) => slot.isBooked);

    const handleBooking = async () => {
        if (!token) {
            alert("Please login to book an appointment");
            return navg('/login');
        }
        if (!isPatient) {
            return alert("Booking is allowed for patients only");
        }
        if (!selectedSlot) return alert("Please select a time slot");
        if (selectedSlot.isBooked) return alert("This slot is already booked");

        const appointmentData = {
            doctorId: docID,
            date: selectedSlot.date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
        };

        const result = await dispatch(bookAppointment(appointmentData));
        if (result.meta.requestStatus === "fulfilled") {
            setOccupiedSet((prev) => new Set(prev).add(`${selectedSlot.date}_${selectedSlot.startTime}`));
            alert("Appointment booked successfully");
            navg("/my-appointments");
            return;
        }

        alert(result.payload || "Could not book this slot");
    };

    if (loading || !selectedDoctor) return <p className="text-center py-20">Loading...</p>;

    return (
        <>
            {/* --- الجزء العلوي: بيانات الدكتور (نفس تصميمك بالظبط) --- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    {/* استخدمنا الصورة من السيرفر أو صورة افتراضية */}
                    <img className="w-full sm:max-w-72 rounded-lg bg-main" src={selectedDoctor.image || asts.doc} alt="" />
                </div>

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {selectedDoctor.user?.name}
                        <img className="w-5" src={asts.verf} alt="" />
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{selectedDoctor.degree || 'MBBS'} - {selectedDoctor.specialty?.name || selectedDoctor.specialty || 'Specialty'}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{selectedDoctor.experienceYears} Years Exp</button>
                    </div>

                    <div className="mt-3">
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                            about <img src={asts.info} alt="" />
                        </p>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">{selectedDoctor.bio}</p>
                    </div>
                    <p className="text-gray-500 mt-4 font-medium">fee: <span className="text-gray-600">${selectedDoctor.fees}</span></p>
                </div>
            </div>

            <div className="sm:ml-72 sm:pl-6 mt-6 font-medium text-gray-700">
                <p>Booking Times</p>
                
                {/* اختيار الأيام */}
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-2">
                    {docSlots.length > 0 && docSlots.map((daySlots, index) => (
                        <div 
                            key={index} 
                            onClick={() => setSlotIndex(index)} 
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${slotIndex === index ? 'bg-main text-white shadow-md' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {/* عرض اسم اليوم ورقمه */}
                            <p>{daySlots[0] && dayNames[daySlots[0].dateObj.getDay()].substring(0, 3)}</p>
                            <p>{daySlots[0] && daySlots[0].dateObj.getDate()}</p>
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 pb-2">
                    {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
                        selectedDaySlots.map((slot, index) => (
                            <button
                                type="button"
                                key={index} 
                                onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                                className={`text-sm font-light flex-shrink-0 px-4 py-2 rounded-full transition-all border flex items-center gap-2 ${slot.isBooked ? 'text-red-500 border-red-300 bg-red-50 cursor-not-allowed' : selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime ? 'bg-main text-white border-main shadow-sm' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${slot.isBooked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                <span>{slot.displayTime}</span>
                            </button>
                        ))
                    ) : (
                        <p className="text-sm text-red-400 py-4">No slots available for this day.</p>
                    )}
                </div>

                {bookedSlotsInSelectedDay.length > 0 && (
                    <p className="mt-2 text-sm text-red-500">
                        Booked on this doctor/day: {bookedSlotsInSelectedDay.map((slot) => slot.displayTime).join(" • ")}
                    </p>
                )}

                {token && !isPatient && (
                    <p className="mt-2 text-sm text-amber-600">
                        View only: booking is available for patient accounts.
                    </p>
                )}

                {/* زرار الحجز بنفس الـ Classes الخاصة بك */}
                <button 
                    onClick={handleBooking} 
                    disabled={token && !isPatient}
                    className={`my-6 px-14 py-3 text-sm font-light rounded-full transition-all ${token && !isPatient ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-main text-white hover:scale-105'}`}
                >
                    Book Appointment
                </button>
            </div>

            {/* المكون الفرعي */}
            <RelateDoc docID={docID} speciality={selectedDoctor.specialty} />
        </>
    );
};

export default Appoint;