import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// تأكد إنك ضفت cancelAppointment في الـ Slice بتاعك
import { fetchDoctorAppointments, completeAppointment } from '../redux/slices/doctorSlice' 
import { asts } from '../assets/assets'

const DoctorAppointments = () => {
  const dispatch = useDispatch()
  const { appointments, loading } = useSelector(state => state.doctor)

  useEffect(() => {
    dispatch(fetchDoctorAppointments())
  }, [dispatch])

  // دالة بسيطة لحساب السن من تاريخ الميلاد
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  }

  if (loading) return <p className="text-center py-20 text-xl">Loading...</p>;

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium text-zinc-700'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
        {/* رأس الجدول */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50 text-gray-700 font-semibold'>
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
            <div className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              
              <div className='flex items-center gap-2'>
                {/* استخدام صورة افتراضية لو المريض محطش صورة */}
                <img className='w-8 h-8 rounded-full object-cover' src={item.userData?.image || asts.prof} alt="" />
                <p className='text-zinc-800 font-medium'>{item.userData?.name || "Unknown Patient"}</p>
              </div>

              <div>
                <p className='text-xs inline border border-main px-2 py-0.5 rounded-full text-main font-medium'>
                  {item.payment ? 'Online' : 'Cash'}
                </p>
              </div>

              <div className='text-zinc-600'>
                <p>{calculateAge(item.userData?.dob)} Years</p>
                <p className='text-xs'>{item.slotDate}, {item.slotTime}</p>
              </div>

              <p className='font-bold text-zinc-700'>${item.amount}</p>
              
              <div className='flex gap-2 items-center'>
                {item.cancelled 
                  ? <p className='text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded'>Cancelled</p>
                  : item.isCompleted 
                    ? <p className='text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded'>Completed</p>
                    : <>
                        <img 
                          onClick={() => dispatch(completeAppointment(item._id))} 
                          className='w-10 cursor-pointer p-2 bg-green-50 rounded-full hover:scale-110 transition-all' 
                          src={asts.tick_icon} 
                          alt="Complete" 
                        />
                        {/* هنا ممكن تضيف دالة الـ Cancel لاحقاً */}
                        <img 
                          className='w-10 cursor-pointer p-2 bg-red-50 rounded-full hover:scale-110 transition-all' 
                          src={asts.cancel_icon} 
                          alt="Cancel" 
                        />
                      </>
                }
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-20 text-gray-400'>No appointments found.</div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments;