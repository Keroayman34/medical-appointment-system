import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorById } from "../redux/slices/doctorSlice";
import { bookAppointment } from "../redux/slices/appointmentSlice";
import { asts } from "../assets/assets.js";
import RelateDoc from "../components/relateDoc.jsx";

const Appoint = () => {
    // 1. استخراج الـ ID والربط مع Redux
    const { docID } = useParams();
    const dispatch = useDispatch();
    const navg = useNavigate();
    
    const { selectedDoctor, loading } = useSelector((state) => state.doctors);
    const { token } = useSelector((state) => state.auth);

    // 2. الـ States الخاصة بالـ Slots (نفس الأسماء التي استخدمتها أنت)
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let [docSlots, setDocSlots] = useState([]);
    let [slotIndex, setSlotIndex] = useState(0);
    let [selectedSlot, setSelectedSlot] = useState(null);

    // 3. جلب بيانات الدكتور عند فتح الصفحة
    useEffect(() => {
        dispatch(fetchDoctorById(docID));
    }, [dispatch, docID]);

    // 4. دالة توليد المواعيد (تعتمد على Availability من السيرفر مع الحفاظ على المنطق الخاص بك)
    const getSlots = () => {
        if (!selectedDoctor || !selectedDoctor.availabilities) return;
        
        setDocSlots([]);
        let today = new Date();
        let allSlots = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            let dayName = dayNames[currentDate.getDay()];

            // البحث عن مواعيد هذا اليوم في بيانات الدكتور القادمة من الباك إيند
            const dayConfig = selectedDoctor.availabilities.find(a => a.day === dayName);
            let slots = [];

            if (dayConfig) {
                let startHour = parseInt(dayConfig.from.split(':')[0]);
                let endHour = parseInt(dayConfig.to.split(':')[0]);

                let curuntDate = new Date(currentDate);
                curuntDate.setHours(startHour, 0, 0, 0);

                let endTime = new Date(currentDate);
                endTime.setHours(endHour, 0, 0, 0);

                // منطق الوقت الحالي (لا يظهر مواعيد مرت في نفس اليوم)
                if (today.getDate() === currentDate.getDate()) {
                    let nextHour = today.getHours() + 1;
                    if (nextHour > startHour) {
                        curuntDate.setHours(nextHour);
                    }
                }

                while (curuntDate < endTime) {
                    const slotStart = new Date(curuntDate);
                    const slotEnd = new Date(curuntDate);
                    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

                    const formatToHHmm = (timeDate) => {
                        const hh = String(timeDate.getHours()).padStart(2, '0');
                        const mm = String(timeDate.getMinutes()).padStart(2, '0');
                        return `${hh}:${mm}`;
                    };

                    let formatTime = slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    slots.push({
                        date: new Date(slotStart),
                        displayTime: formatTime,
                        startTime: formatToHHmm(slotStart),
                        endTime: formatToHHmm(slotEnd),
                    });
                    curuntDate.setMinutes(curuntDate.getMinutes() + 30);
                }
            }
            allSlots.push(slots);
        }
        setDocSlots(allSlots);
    };

    useEffect(() => {
        if (selectedDoctor) {
            getSlots();
        }
    }, [selectedDoctor]);

    // دالة الحجز
    const handleBooking = async () => {
        if (!token) {
            alert("Please login to book an appointment");
            return navg('/login');
        }
        if (!selectedSlot) return alert("Please select a time slot");

        const appointmentData = {
            doctorId: docID,
            date: selectedSlot.date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
        };
        dispatch(bookAppointment(appointmentData));
    };

    if (loading || !selectedDoctor) return <p className="text-center py-20">Loading...</p>;

    return (
        <>
            {/* --- الجزء العلوي: بيانات الدكتور (نفس تصميمك بالظبط) --- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    {/* استخدمنا الصورة من السيرفر أو صورة افتراضية */}
                    <img className="w-full sm:max-w-72 rounded-lg bg-main" src={selectedDoctor.image || asts.doc1} alt="" />
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

            {/* --- الجزء السفلي: الـ Slots (نفس تصميمك وحركات الـ Scroll) --- */}
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
                            <p>{daySlots[0] && dayNames[daySlots[0].date.getDay()].substring(0, 3)}</p>
                            <p>{daySlots[0] && daySlots[0].date.getDate()}</p>
                        </div>
                    ))}
                </div>
                
                {/* اختيار الساعات */}
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 pb-2">
                    {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
                        docSlots[slotIndex].map((slot, index) => (
                            <p 
                                key={index} 
                                onClick={() => setSelectedSlot(slot)} 
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${selectedSlot?.startTime === slot.startTime ? 'bg-main text-white shadow-sm' : 'text-gray-400 border border-gray-200'}`} 
                            >
                                {slot.displayTime.toLowerCase()}
                            </p>
                        ))
                    ) : (
                        <p className="text-sm text-red-400 py-4">No slots available for this day.</p>
                    )}
                </div>

                {/* زرار الحجز بنفس الـ Classes الخاصة بك */}
                <button 
                    onClick={handleBooking} 
                    className="my-6 px-14 py-3 text-sm font-light rounded-full bg-main text-white hover:scale-105 transition-all"
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