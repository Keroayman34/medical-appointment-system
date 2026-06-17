import React from 'react'

const AppointmentRow = ({ item, index, onComplete, onCancel }) => {
  const patientName = item?.patient?.user?.name || item?.userData?.name || 'Unknown Patient'
  const patientImage = item?.userData?.image || ''
  const appointmentDate = item?.slotDate || (item?.date ? new Date(item.date).toLocaleDateString('en-GB') : '')
  const isCancelled = item?.status === 'cancelled' || item?.cancelled
  const isCompleted = item?.status === 'completed' || item?.isCompleted

  return (
    <div className='flex items-center px-6 py-3 gap-3 hover:bg-[#9CD5FF]/15 border-b border-[#9CD5FF]/40'>
      <p className='w-10 text-[#355872] font-semibold'>{index + 1}</p>
        <div className='flex-1 flex items-center gap-2'>
        <img className='w-8 h-8 rounded-full object-cover bg-[#7AAACE]/25 border border-[#7AAACE]/40' src={patientImage} alt="" />
        <p className='text-[#355872] font-medium'>{patientName}</p>
        </div>
      <p className='w-32 text-[#355872]/85'>{appointmentDate}</p>
        <div className='w-32'>
            {isCancelled 
          ? <span className='text-red-600 text-xs font-medium'>Cancelled</span>
                : isCompleted 
            ? <span className='text-green-600 text-xs font-medium'>Completed</span>
                    : <div className='flex gap-2'>
                        <button onClick={() => onComplete(item._id)} className='w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all'>✓</button>
                        <button onClick={() => onCancel?.(item._id)} className='w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all'>✕</button>
                      </div>
            }
        </div>
    </div>
  )
}

export default AppointmentRow