import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "patient", 
        phone: "",
        gender: "male",
        age: "",
        // Doctor specific fields
        specialty: "",
        experience: "",
        about: "",
        degree: "", 
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };

        if (formData.phone?.trim()) payload.phone = formData.phone.trim();
        if (formData.gender) payload.gender = formData.gender.toLowerCase();
        if (formData.age !== "") payload.age = Number(formData.age);

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
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center py-12 bg-gray-50">
            <div className="flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[550px] border border-zinc-200 rounded-2xl shadow-xl bg-white">
                <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-blue-600">Create Account</p>
                    <p className="text-zinc-500 mt-2">Please enter your details to register</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

                {/* Role Selection */}
                <div className="w-full">
                    <p className="font-medium text-zinc-700">I am a:</p>
                    <select 
                        className="border border-zinc-300 rounded-lg w-full p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <p className="text-zinc-600 text-sm">Full Name</p>
                        <input className="border border-zinc-300 rounded-lg w-full p-2 mt-1" type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-zinc-600 text-sm">Email Address</p>
                        <input className="border border-zinc-300 rounded-lg w-full p-2 mt-1" type="email" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-zinc-600 text-sm">Password</p>
                        <input className="border border-zinc-300 rounded-lg w-full p-2 mt-1" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-zinc-600 text-sm">Phone Number</p>
                        <input className="border border-zinc-300 rounded-lg w-full p-2 mt-1" type="tel" placeholder="0123456789" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-zinc-600 text-sm">Age</p>
                        <input className="border border-zinc-300 rounded-lg w-full p-2 mt-1" type="number" placeholder="25" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                    </div>
                    <div>
                        <p className="text-zinc-600 text-sm">Gender</p>
                        <select className="border border-zinc-300 rounded-lg w-full p-2 mt-1" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Conditional Doctor Fields */}
                {formData.role === "doctor" && (
                    <div className="border-t pt-4 mt-2 bg-blue-50/50 p-4 rounded-xl border-blue-100">
                        <p className="font-bold text-blue-700 mb-3">Professional Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-zinc-600 text-sm">Specialty</p>
                                <input className="border border-blue-200 rounded-lg w-full p-2 mt-1" type="text" placeholder="e.g. Cardiology" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} required={formData.role === "doctor"} />
                            </div>
                            <div>
                                <p className="text-zinc-600 text-sm">Years of Experience</p>
                                <input className="border border-blue-200 rounded-lg w-full p-2 mt-1" type="number" placeholder="e.g. 5" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required={formData.role === "doctor"} />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-zinc-600 text-sm">Medical Degree</p>
                                <input className="border border-blue-200 rounded-lg w-full p-2 mt-1" type="text" placeholder="e.g. MBBS, MD" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-zinc-600 text-sm">Bio / About</p>
                                <textarea rows="2" className="border border-blue-200 rounded-lg w-full p-2 mt-1" placeholder="Briefly describe your medical background" value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value})} />
                            </div>
                        </div>
                    </div>
                )}
                
                <button 
                    disabled={loading} 
                    className="bg-blue-600 text-white w-full py-3 rounded-xl text-lg font-bold mt-4 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-400"
                >
                    {loading ? "Creating Account..." : "Register Now"}
                </button>

                <p className="text-center text-zinc-600 mt-2">
                    Already have an account? 
                    <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer underline font-bold ml-1">Login here</span>
                </p>
            </div>
        </form>
    );
};

export default Register;