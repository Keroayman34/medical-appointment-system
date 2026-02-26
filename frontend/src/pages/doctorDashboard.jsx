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
            <div className='bg-white mt-10 rounded border shadow-sm'>
                <div className='flex items-center gap-2.5 px-4 py-4 border-b bg-gray-50'>
                    <img src={asts.list_icon} alt="" />
                    <p className='font-semibold'>Latest Appointments</p>
                </div>

                <div className='pt-4 border-b bg-white'>
                    {appointments.slice(0, 5).map((item, index) => (
                        <AppointmentRow 
                            key={index} 
                            item={item} 
                            index={index} 
                            onComplete={(id) => dispatch(completeAppointment(id))}
                            onCancel={(id) => dispatch(cancelDoctorAppointment(id))}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard