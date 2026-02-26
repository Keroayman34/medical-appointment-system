import React, { useState } from 'react'
import { asts } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import { addDoctor } from '../redux/slices/adminSlice'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address, setAddress] = useState('')
    const [about, setAbout] = useState('')

    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.admin)

    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (!docImg) return alert("Please select doctor image")

        const formData = new FormData()
        formData.append('image', docImg)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('experience', experience)
        formData.append('fees', Number(fees))
        formData.append('speciality', speciality)
        formData.append('degree', degree)
        formData.append('address', address)
        formData.append('about', about)

        dispatch(addDoctor(formData))
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer object-cover h-16' src={docImg ? URL.createObjectURL(docImg) : asts.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2 outline-main' type="text" placeholder='Name' required />
                        </div>
                        {/* كرر نفس النمط للإيميل والباسورد والتخصص */}
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 outline-main' type="email" placeholder='Email' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2 outline-main'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2 outline-main' type="number" placeholder='Fees' required />
                        </div>
                    </div>
                </div>

                <div className='mt-4 flex flex-col gap-1'>
                    <p>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded px-3 py-2 outline-main' placeholder='Write about doctor' rows={5} required />
                </div>

                <button type='submit' className='bg-main px-10 py-3 mt-4 text-white rounded-full hover:bg-opacity-90 transition-all'>
                    {loading ? 'Adding...' : 'Add Doctor'}
                </button>
            </div>
        </form>
    )
}

export default AddDoctor