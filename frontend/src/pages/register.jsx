import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "patient", 
        phone: "",
        address: "",
        gender: "male",
        age: "",
        // Doctor specific fields
        specialtyId: "",
        experienceYears: "",
        bio: "",
        fees: "",
    });
    const [specialties, setSpecialties] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const { data } = await axios.get('/api/specialties');
                setSpecialties(data.specialties || []);
            } catch {
                setSpecialties([]);
            }
        };

        loadSpecialties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };

        if (formData.phone?.trim()) payload.phone = formData.phone.trim();
        if (formData.address?.trim()) payload.address = formData.address.trim();
        if (formData.gender) payload.gender = formData.gender.toLowerCase();
        if (formData.age !== "") payload.age = Number(formData.age);

        if (formData.role === "doctor") {
            payload.specialtyId = formData.specialtyId;
            payload.bio = formData.bio || "";
            if (formData.experienceYears !== "") payload.experienceYears = Number(formData.experienceYears);
            if (formData.fees !== "") payload.fees = Number(formData.fees);
        }

        const resultAction = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Account created successfully!");
            navigate('/'); 
        } else {
            console.error("Server Response:", resultAction.payload);
            toast.error(resultAction.payload || "Registration Failed. Please check all fields.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center py-12">
            <div className="flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[550px] border border-[#7AAACE]/40 rounded-2xl shadow-xl bg-transparent backdrop-blur-sm">
                <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-[#355872]">Create Account</p>
                    <p className="text-[#355872]/70 mt-2">Please enter your details to register</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 whitespace-pre-line">{error}</div>}

                {/* Role Selection */}
                <div className="w-full">
                    <p className="font-medium text-[#355872]">I am a:</p>
                    <select 
                        className="border border-[#9CD5FF]/75 rounded-lg w-full p-2.5 mt-1 focus:ring-2 focus:ring-[#7AAACE] outline-none bg-white/90"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Common Fields */}
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Full Name</p>
                        <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Email Address</p>
                        <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="email" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Password</p>
                        <div className="relative mt-1">
                            <input
                                className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 pr-10 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 px-3 text-[#355872]/70 hover:text-[#355872]"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.875 13.293A3.963 3.963 0 0110 14.5c-2.256 0-3.53-1.61-4.262-2.75a.75.75 0 011.262-.81c.61.95 1.58 2.06 3 2.06a2.5 2.5 0 002.384-3.254.75.75 0 111.43-.455c.144.45.186.916.126 1.372l1.53 1.53a.75.75 0 11-1.06 1.06l-.535-.534z" />
                                        <path d="M3.22 2.22a.75.75 0 011.06 0l12.5 12.5a.75.75 0 11-1.06 1.06l-1.857-1.857A8.617 8.617 0 0110 15.5c-4.55 0-7.237-3.973-8.043-5.36a1.75 1.75 0 010-1.78c.52-.895 1.83-2.84 3.91-4.145L3.22 3.28a.75.75 0 010-1.06zm4.77 4.77A2.5 2.5 0 0111.01 10l-3.02-3.01z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 4.5c-4.55 0-7.237 3.973-8.043 5.36a1.75 1.75 0 000 1.78C2.763 13.027 5.45 17 10 17s7.237-3.973 8.043-5.36a1.75 1.75 0 000-1.78C17.237 8.473 14.55 4.5 10 4.5zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                                        <path d="M10 8a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Phone Number</p>
                        <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="tel" placeholder="0123456789" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Age</p>
                        <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="number" placeholder="25" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Address</p>
                        <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="text" placeholder="City, Area" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-[#355872] text-sm font-semibold">Gender</p>
                        <select className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Conditional Doctor Fields */}
                {formData.role === "doctor" && (
                    <div className="border-t pt-4 mt-2 bg-[#9CD5FF]/15 p-4 rounded-xl border-[#7AAACE]/40">
                        <p className="font-bold text-[#355872] mb-3">Professional Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-[#355872] text-sm font-semibold">Specialty</p>
                                <select className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" value={formData.specialtyId} onChange={(e) => setFormData({...formData, specialtyId: e.target.value})} required={formData.role === "doctor"}>
                                    <option value="">Select specialty</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty._id} value={specialty._id}>{specialty.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p className="text-[#355872] text-sm font-semibold">Years of Experience</p>
                                <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="number" placeholder="e.g. 5" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} required={formData.role === "doctor"} />
                            </div>
                            <div>
                                <p className="text-[#355872] text-sm font-semibold">Fees</p>
                                <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="number" placeholder="e.g. 200" value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-[#355872] text-sm font-semibold">Bio / About</p>
                                <textarea rows="2" className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" placeholder="Briefly describe your medical background" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                            </div>
                        </div>
                    </div>
                )}
                
                <button 
                    disabled={loading} 
                    className="bg-main text-white w-full py-3 rounded-xl text-lg font-bold mt-4 hover:shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:bg-gray-400"
                >
                    {loading ? "Creating Account..." : "Register Now"}
                </button>

                <p className="text-center text-[#355872]/80 mt-2">
                    Already have an account? 
                    <span onClick={() => navigate('/login')} className="text-main cursor-pointer underline font-bold ml-1">Login here</span>
                </p>
            </div>
        </form>
    );
};

export default Register;