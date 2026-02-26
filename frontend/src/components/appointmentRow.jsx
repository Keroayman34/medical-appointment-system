import React from 'react'

const AppointmentRow = ({ item, index, onComplete, onCancel }) => {
  return (
    <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50 border-b'>
        <p className='w-10'>{index + 1}</p>
        <div className='flex-1 flex items-center gap-2'>
            <img className='w-8 rounded-full' src={item.userData.image} alt="" />
            <p>{item.userData.name}</p>
        </div>
        <p className='w-32'>{item.slotDate}</p>
        <div className='w-32'>
            {item.cancelled 
                ? <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                : item.isCompleted 
                    ? <span className='text-green-500 text-xs font-medium'>Completed</span>
                    : <div className='flex gap-2'>
                        <button onClick={() => onComplete(item._id)} className='w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all'>✓</button>
                        <button onClick={() => onCancel(item._id)} className='w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all'>✕</button>
                      </div>
            }
        </div>
    </div>
  )
}

export default AppointmentRow