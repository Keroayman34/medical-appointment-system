import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDoctorProfile, getDoctorProfile, updateDoctorProfile } from '../redux/slices/doctorSlice'
import { asts } from '../assets/assets'
import axios from 'axios'

const DoctorProfile = () => {
    const dispatch = useDispatch()
    const { profile, loading, error } = useSelector(state => state.doctors)
    const { token } = useSelector(state => state.auth)

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

    const [editMode, setEditMode] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [docData, setDocData] = useState({})
    const [specialties, setSpecialties] = useState([])
    const [availability, setAvailability] = useState([])
    const [availabilityLoading, setAvailabilityLoading] = useState(false)
    const [availabilityError, setAvailabilityError] = useState('')
    const [slotForm, setSlotForm] = useState({
        day: 'monday',
        from: '17:00',
        to: '18:00',
    })

    const dayOptions = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ]

    const toLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1)

    useEffect(() => {
        dispatch(getDoctorProfile())
    }, [dispatch])

    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const { data } = await axios.get('/api/specialties')
                setSpecialties(data.specialties || [])
            } catch {
                setSpecialties([])
            }
        }

        loadSpecialties()
    }, [])

    useEffect(() => {
        if (profile) {
            setDocData({
                name: profile.user?.name || '',
                email: profile.user?.email || '',
                image: profile.user?.image || asts.prof,
                address: profile.user?.address || '',
                gender: profile.user?.gender || 'male',
                age: profile.user?.age ?? '',
                specialtyId: profile.specialty?._id || '',
                speciality: profile.specialty?.name || '',
                experience: profile.experienceYears ?? 0,
                about: profile.bio || '',
                fees: profile.fees ?? 0,
                phone: profile.phone || profile.user?.phone || '',
            })
        }
    }, [profile])

    useEffect(() => {
        const loadAvailability = async () => {
            if (!token) return
            setAvailabilityLoading(true)
            setAvailabilityError('')

            try {
                const { data } = await axios.get('/api/availability/me', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setAvailability(data.availability || [])
            } catch (err) {
                setAvailabilityError(err?.response?.data?.message || 'Failed to load availability')
                setAvailability([])
            } finally {
                setAvailabilityLoading(false)
            }
        }

        loadAvailability()
    }, [token])

    const handleAddAvailability = async () => {
        if (!token) return

        try {
            setAvailabilityError('')
            const { data } = await axios.post(
                '/api/availability',
                slotForm,
                { headers: { Authorization: `Bearer ${token}` } },
            )
            setAvailability((prev) => [...prev, data.availability].sort((a, b) => {
                if (a.day === b.day) return a.from.localeCompare(b.from)
                return a.day.localeCompare(b.day)
            }))
        } catch (err) {
            setAvailabilityError(err?.response?.data?.message || 'Failed to add availability')
        }
    }

    const handleDeleteAvailability = async (slotId) => {
        if (!token) return

        try {
            setAvailabilityError('')
            await axios.delete(`/api/availability/${slotId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setAvailability((prev) => prev.filter((item) => item._id !== slotId))
        } catch (err) {
            setAvailabilityError(err?.response?.data?.message || 'Failed to delete availability')
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadError('')

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setUploadError('Image must be JPG, PNG or WEBP')
            e.target.value = ''
            return
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setUploadError('Image size must be 2MB or less')
            e.target.value = ''
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setDocData((prev) => ({ ...prev, image: reader.result }))
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (uploadError) return

        const payload = {
            name: docData.name,
            email: docData.email,
            image: typeof docData.image === 'string' ? docData.image : '',
            address: docData.address,
            gender: docData.gender,
            age: docData.age === '' ? null : Number(docData.age),
            specialtyId: docData.specialtyId || undefined,
            bio: docData.about,
            phone: docData.phone,
            fees: Number(docData.fees) || 0,
            experienceYears: Number(docData.experience) || 0,
        }

        const result = await dispatch(updateDoctorProfile(payload))
        if (result.meta.requestStatus === 'fulfilled') {
            setEditMode(false)
        }
    }

    const handleCreateProfile = async () => {
        const payload = {
            specialtyId: docData.specialtyId,
            bio: docData.about || '',
            phone: docData.phone || '',
            fees: Number(docData.fees) || 0,
            experienceYears: Number(docData.experience) || 0,
        }

        const result = await dispatch(createDoctorProfile(payload))
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(getDoctorProfile())
        }
    }

    if (loading && !profile) return <p className="text-center py-20">Loading Doctor Profile...</p>
    if (error === 'Doctor profile not found' && !profile) {
        return (
            <div className='max-w-2xl mx-auto p-6 border rounded-xl bg-white mt-8'>
                <h2 className='text-2xl font-bold mb-4'>Create Doctor Profile</h2>
                <p className='text-sm text-gray-600 mb-4'>Your account is doctor role, but profile is not created yet.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='md:col-span-2'>
                        <p className='text-sm mb-1'>Specialty</p>
                        <select
                            className='border rounded w-full p-2'
                            value={docData.specialtyId || ''}
                            onChange={(e) => setDocData({ ...docData, specialtyId: e.target.value })}
                        >
                            <option value=''>Select specialty</option>
                            {specialties.map((specialty) => (
                                <option key={specialty._id} value={specialty._id}>{specialty.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className='text-sm mb-1'>Phone</p>
                        <input className='border rounded w-full p-2' value={docData.phone || ''} onChange={(e) => setDocData({ ...docData, phone: e.target.value })} />
                    </div>
                    <div>
                        <p className='text-sm mb-1'>Fees</p>
                        <input type='number' className='border rounded w-full p-2' value={docData.fees || ''} onChange={(e) => setDocData({ ...docData, fees: e.target.value })} />
                    </div>
                    <div>
                        <p className='text-sm mb-1'>Experience Years</p>
                        <input type='number' className='border rounded w-full p-2' value={docData.experience || ''} onChange={(e) => setDocData({ ...docData, experience: e.target.value })} />
                    </div>
                    <div className='md:col-span-2'>
                        <p className='text-sm mb-1'>About</p>
                        <textarea rows='3' className='border rounded w-full p-2' value={docData.about || ''} onChange={(e) => setDocData({ ...docData, about: e.target.value })} />
                    </div>
                </div>

                <button className='mt-5 px-6 py-2 bg-main text-white rounded' onClick={handleCreateProfile} disabled={loading || !docData.specialtyId}>
                    {loading ? 'Creating...' : 'Create Profile'}
                </button>
            </div>
        )
    }

    if (error && !profile) return <p className="text-center py-20 text-red-500">{error}</p>
    if (!profile) return <p className="text-center py-20">Doctor Profile not found.</p>

    return (
        <div className='m-5'>
            <div className='flex flex-col gap-4 bg-white p-8 border rounded-xl shadow-sm max-w-4xl mx-auto'>
                <div className='flex flex-col sm:flex-row gap-6'>
                    <div className='sm:max-w-64'>
                        <img className='w-full rounded-lg bg-main/10 border object-cover' src={docData.image || asts.prof} alt="" />
                        {editMode && (
                            <div className='mt-2'>
                                <label className='cursor-pointer inline-block bg-main text-white px-4 py-2 rounded'>
                                    Upload Image
                                    <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
                                </label>
                                {uploadError && <p className='text-red-500 text-xs mt-1'>{uploadError}</p>}
                            </div>
                        )}
                    </div>

                    <div className='flex-1'>
                        {editMode ? (
                            <input type='text' className='text-3xl font-medium border px-2 py-1 rounded w-full max-w-md' value={docData.name} onChange={(e) => setDocData({ ...docData, name: e.target.value })} />
                        ) : (
                            <p className='text-3xl font-medium text-gray-800'>{docData.name}</p>
                        )}

                        <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                            <div>
                                <p className='font-semibold text-gray-700'>Email</p>
                                {editMode ? <input type='email' className='border px-2 py-1 rounded w-full' value={docData.email} onChange={(e) => setDocData({ ...docData, email: e.target.value })} /> : <p>{docData.email}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Phone</p>
                                {editMode ? <input type='text' className='border px-2 py-1 rounded w-full' value={docData.phone} onChange={(e) => setDocData({ ...docData, phone: e.target.value })} /> : <p>{docData.phone}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Address</p>
                                {editMode ? <input type='text' className='border px-2 py-1 rounded w-full' value={docData.address} onChange={(e) => setDocData({ ...docData, address: e.target.value })} /> : <p>{docData.address}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Gender</p>
                                {editMode ? (
                                    <select className='border px-2 py-1 rounded w-full' value={docData.gender} onChange={(e) => setDocData({ ...docData, gender: e.target.value })}>
                                        <option value='male'>Male</option>
                                        <option value='female'>Female</option>
                                    </select>
                                ) : <p>{docData.gender}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Age</p>
                                {editMode ? <input type='number' min='0' max='130' className='border px-2 py-1 rounded w-full' value={docData.age} onChange={(e) => setDocData({ ...docData, age: e.target.value })} /> : <p>{docData.age}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Specialty</p>
                                {editMode ? (
                                    <select className='border px-2 py-1 rounded w-full' value={docData.specialtyId} onChange={(e) => setDocData({ ...docData, specialtyId: e.target.value, speciality: specialties.find((item) => item._id === e.target.value)?.name || '' })}>
                                        <option value=''>Select specialty</option>
                                        {specialties.map((specialty) => (
                                            <option key={specialty._id} value={specialty._id}>{specialty.name}</option>
                                        ))}
                                    </select>
                                ) : <p>{docData.speciality}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Experience Years</p>
                                {editMode ? <input type='number' min='0' className='border px-2 py-1 rounded w-full' value={docData.experience} onChange={(e) => setDocData({ ...docData, experience: e.target.value })} /> : <p>{docData.experience}</p>}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-700'>Fees</p>
                                {editMode ? <input type='number' min='0' className='border px-2 py-1 rounded w-full' value={docData.fees} onChange={(e) => setDocData({ ...docData, fees: e.target.value })} /> : <p>${docData.fees}</p>}
                            </div>
                            <div className='md:col-span-2'>
                                <p className='font-semibold text-gray-700'>About</p>
                                {editMode ? <textarea rows='3' className='border px-2 py-1 rounded w-full' value={docData.about} onChange={(e) => setDocData({ ...docData, about: e.target.value })} /> : <p>{docData.about}</p>}
                            </div>
                        </div>

                        <p className='text-sm text-gray-500 mt-3'>Approval Status: {profile.isApproved ? 'Approved' : 'Pending approval'}</p>

                        <div className='mt-6 border rounded-xl p-4 bg-gray-50'>
                            <p className='text-lg font-semibold text-gray-800'>Availability Schedule</p>
                            <p className='text-xs text-gray-500 mt-1'>Define days and time ranges when you are available for booking.</p>

                            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-4'>
                                <div>
                                    <p className='text-xs mb-1 text-gray-600'>Day</p>
                                    <select
                                        className='border px-2 py-2 rounded w-full'
                                        value={slotForm.day}
                                        onChange={(e) => setSlotForm((prev) => ({ ...prev, day: e.target.value }))}
                                    >
                                        {dayOptions.map((day) => (
                                            <option key={day} value={day}>{toLabel(day)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <p className='text-xs mb-1 text-gray-600'>From</p>
                                    <input
                                        type='time'
                                        className='border px-2 py-2 rounded w-full'
                                        value={slotForm.from}
                                        onChange={(e) => setSlotForm((prev) => ({ ...prev, from: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <p className='text-xs mb-1 text-gray-600'>To</p>
                                    <input
                                        type='time'
                                        className='border px-2 py-2 rounded w-full'
                                        value={slotForm.to}
                                        onChange={(e) => setSlotForm((prev) => ({ ...prev, to: e.target.value }))}
                                    />
                                </div>

                                <div className='flex items-end'>
                                    <button
                                        type='button'
                                        className='w-full py-2 rounded bg-main text-white hover:opacity-90 transition-all'
                                        onClick={handleAddAvailability}
                                    >
                                        Add Slot
                                    </button>
                                </div>
                            </div>

                            {availabilityError && <p className='text-sm text-red-500 mt-3'>{availabilityError}</p>}

                            <div className='mt-4'>
                                {availabilityLoading ? (
                                    <p className='text-sm text-gray-500'>Loading availability...</p>
                                ) : availability.length === 0 ? (
                                    <p className='text-sm text-gray-500'>No availability slots yet.</p>
                                ) : (
                                    <div className='space-y-2'>
                                        {availability.map((slot) => (
                                            <div key={slot._id} className='flex items-center justify-between border rounded px-3 py-2 bg-white'>
                                                <p className='text-sm text-gray-700'>
                                                    <span className='font-medium'>{toLabel(slot.day)}</span> — {slot.from} to {slot.to}
                                                </p>
                                                <button
                                                    type='button'
                                                    className='text-xs px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50'
                                                    onClick={() => handleDeleteAvailability(slot._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='mt-8'>
                            {editMode ? (
                                <button onClick={handleSave} className='px-10 py-2 border border-main bg-main text-white rounded-full hover:shadow-lg transition-all'>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            ) : (
                                <button onClick={() => setEditMode(true)} className='px-10 py-2 border border-main text-main rounded-full hover:bg-main hover:text-white transition-all'>
                                    Edit Profile
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