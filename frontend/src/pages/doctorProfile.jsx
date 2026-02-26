import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorProfile, updateDoctorProfile } from '../redux/slices/doctorSlice'

const DoctorProfile = () => {
    const dispatch = useDispatch()
    const { profile, loading } = useSelector(state => state.doctor)
    
    const [editMode, setEditMode] = useState(false)
    const [docData, setDocData] = useState({})

    // جلب البيانات أول ما الصفحة تفتح
    useEffect(() => {
        dispatch(getDoctorProfile())
    }, [dispatch])

    // تحديث السيت المحلي لما الداتا تيجي من الريدكس
    useEffect(() => {
        if (profile) {
            setDocData({ ...profile })
        }
    }, [profile])

    const handleSave = async () => {
        await dispatch(updateDoctorProfile(docData))
        setEditMode(false)
    }

    if (!profile) return <p className="text-center py-20">Loading Doctor Profile...</p>

    return (
        <div className='m-5'>
            <div className='flex flex-col gap-4 bg-white p-8 border rounded-xl shadow-sm max-w-4xl mx-auto'>
                
                {/* الجزء العلوي: الصورة والبيانات الأساسية */}
                <div className='flex flex-col sm:flex-row gap-6'>
                    <div>
                        <img className='w-full sm:max-w-64 rounded-lg bg-main/10 border' src={docData.image} alt="" />
                    </div>

                    <div className='flex-1'>
                        <p className='text-3xl font-medium text-gray-800'>{docData.name}</p>
                        <div className='flex items-center gap-2 mt-1 text-gray-600 font-medium'>
                            <p>{docData.degree} - {docData.speciality}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{docData.experience} Years Exp</button>
                        </div>

                        {/* قسم About */}
                        <div className='mt-4'>
                            <p className='text-sm font-bold text-neutral-800 uppercase underline'>About:</p>
                            <p className='text-sm text-gray-600 mt-2 leading-6'>
                                {docData.about}
                            </p>
                        </div>

                        {/* سعر الكشف */}
                        <p className='text-gray-700 font-bold mt-5'>
                            Appointment Fee: 
                            <span className='text-main ml-2'>
                                $ {editMode 
                                    ? <input type="number" className='border px-2 w-24 outline-none' value={docData.fees} onChange={(e)=> setDocData({...docData, fees: e.target.value})} /> 
                                    : docData.fees}
                            </span>
                        </p>

                        {/* العنوان المهني (العيادة) */}
                        <div className='flex gap-2 py-2 mt-2'>
                            <p className='font-bold text-neutral-800'>Address:</p>
                            <p className='text-gray-600'>
                                {editMode 
                                    ? <input type="text" className='border px-2 w-full outline-none' value={docData.address} onChange={(e)=> setDocData({...docData, address: e.target.value})} /> 
                                    : docData.address}
                            </p>
                        </div>

                        {/* حالة التوفر */}
                        <div className='flex gap-2 mt-2 items-center'>
                            <input 
                                type="checkbox" 
                                id="available"
                                checked={docData.available} 
                                onChange={()=> editMode && setDocData({...docData, available: !docData.available})} 
                                className='cursor-pointer w-4 h-4'
                            />
                            <label htmlFor="available" className='text-gray-700 font-medium cursor-pointer'>Available for Booking</label>
                        </div>

                        {/* أزرار التحكم */}
                        <div className='mt-8'>
                            {editMode ? (
                                <button onClick={handleSave} className='px-10 py-2 border border-main bg-main text-white rounded-full hover:shadow-lg transition-all'>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            ) : (
                                <button onClick={() => setEditMode(true)} className='px-10 py-2 border border-main text-main rounded-full hover:bg-main hover:text-white transition-all'>
                                    Edit Professional Info
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile