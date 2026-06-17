import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDoctorAppointments, completeAppointment, cancelDoctorAppointment } from '../redux/slices/doctorSlice' 
import { asts } from '../assets/assets'

const DoctorAppointments = () => {
  const dispatch = useDispatch()
  const { appointments, loading } = useSelector(state => state.doctors)

  useEffect(() => {
    dispatch(fetchDoctorAppointments())
  }, [dispatch])

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    if (typeof dob === 'number') return dob;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  }

  if (loading) return <p className="text-center py-20 text-xl">Loading...</p>;

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-3xl font-bold text-[#355872]'>All Appointments</p>

      <div className='bg-[#F7F8F0]/95 border border-[#7AAACE]/40 rounded-2xl text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
        {/* رأس الجدول */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-[#9CD5FF]/45 bg-[#F7F8F0] text-[#355872] font-bold'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age & Date</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* عرض المواعيد */}
        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] items-center text-[#355872]/85 py-3 px-6 border-b border-[#9CD5FF]/45 hover:bg-[#9CD5FF]/18 transition-all' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              
              <div className='flex items-center gap-2'>
                {/* Use patient image when available, otherwise fallback */}
                <img
                  className='w-10 h-10 rounded-full object-cover border border-[#9CD5FF]/60'
                  src={item.patient?.user?.image || asts.prof}
                  alt='Patient'
                  onError={(e) => {
                    e.currentTarget.src = asts.prof
                  }}
                />
                <p className='text-[#355872] font-semibold'>{item.patient?.user?.name || "Unknown Patient"}</p>
              </div>

              <div>
                <p className='text-xs inline border border-main/30 bg-main/10 px-2 py-0.5 rounded-full text-main font-semibold'>
                  Cash
                </p>
              </div>

              <div className='text-[#355872]/80'>
                <p>{calculateAge(item.patient?.age)} Years</p>
                <p className='text-xs'>
                  {new Date(item.date).toLocaleDateString('en-GB')}, {item.startTime}
                </p>
              </div>

              <p className='font-bold text-[#355872]'>${item.doctor?.fees ?? '-'}</p>
              
              <div className='flex gap-2 items-center'>
                {item.status === 'cancelled' 
                  ? <p className='text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded'>Cancelled</p>
                  : item.status === 'completed' 
                    ? <p className='text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded'>Completed</p>
                    : <>
                        <button
                          type='button'
                          onClick={() => dispatch(completeAppointment(item._id))}
                          className='w-10 h-10 cursor-pointer bg-green-50 border border-green-200 rounded-full hover:scale-110 transition-all text-green-600 text-lg font-bold flex items-center justify-center'
                          aria-label='Complete appointment'
                          title='Complete appointment'
                        >
                          ✓
                        </button>
                        <button
                          type='button'
                          onClick={() => dispatch(cancelDoctorAppointment(item._id))}
                          className='w-10 h-10 cursor-pointer bg-red-50 border border-red-200 rounded-full hover:scale-110 transition-all text-red-600 text-lg font-bold flex items-center justify-center'
                          aria-label='Cancel appointment'
                          title='Cancel appointment'
                        >
                          ✕
                        </button>
                      </>
                }
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-20 text-[#355872]/60'>No appointments found.</div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments;