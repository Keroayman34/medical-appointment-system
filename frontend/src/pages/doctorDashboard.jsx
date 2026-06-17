import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDoctorAppointments, completeAppointment, cancelDoctorAppointment } from '../redux/slices/doctorSlice.js'
import { asts } from '../assets/assets.js'
import StatCard from '../components/statCard.jsx'
import AppointmentRow from '../components/appointmentRow.jsx'

const DoctorDashboard = () => {
    const dispatch = useDispatch()
    const { appointments, loading } = useSelector(state => state.doctors)

    useEffect(() => {
        dispatch(fetchDoctorAppointments())
    }, [dispatch])

    if (loading) return <div className='p-10 text-center'>Loading Dashboard...</div>

    return (
        <div className='m-5'>
            {/* الإحصائيات */}
            <div className='flex flex-wrap gap-3'>
                <StatCard icon={asts.earning_icon} label="Earnings" value={`$1200`} />
                <StatCard icon={asts.appointments_icon} label="Appointments" value={appointments.length} />
                <StatCard icon={asts.patients_icon} label="Patients" value="5" />
            </div>

            {/* أحدث الحجوزات */}
            <div className='bg-[#F7F8F0]/95 mt-10 rounded-2xl border border-[#7AAACE]/40 shadow-sm'>
                <div className='flex items-center gap-2.5 px-4 py-4 border-b border-[#9CD5FF]/50 bg-[#F7F8F0]'>
                    <img src={asts.list_icon} alt="" />
                    <p className='font-bold text-[#355872] text-2xl'>Latest Appointments</p>
                </div>

                <div className='pt-2 border-b border-[#9CD5FF]/50 bg-[#F7F8F0]/85'>
                    {appointments.length > 0 ? appointments.slice(0, 5).map((item, index) => (
                        <AppointmentRow 
                            key={index} 
                            item={item} 
                            index={index} 
                            onComplete={(id) => dispatch(completeAppointment(id))}
                            onCancel={(id) => dispatch(cancelDoctorAppointment(id))}
                        />
                    )) : (
                        <p className='px-5 py-8 text-[#355872]/70'>No appointments yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard