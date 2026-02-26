import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

let Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        // إرسال البيانات (الاسم، الإيميل، الباسورد) للباك إيند
        dispatch(registerUser({ name, email, password })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/'); // التوجه للرئيسية بعد النجاح
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg">
                <p className="text-2xl font-semibold">Create Account</p>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                
                <div className="w-full">
                    <p>Full Name</p>
                    <input className="border rounded w-full p-2 mt-1" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="w-full">
                    <p>Email</p>
                    <input className="border rounded w-full p-2 mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input className="border rounded w-full p-2 mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <button disabled={loading} className="bg-main text-white w-full py-2 rounded-md mt-4">
                    {loading ? "Creating account..." : "Create Account"}
                </button>
                <p>Already have an account? <span onClick={() => navigate('/login')} className="text-main cursor-pointer">Login here</span></p>
            </div>
        </form>
    );
};

export default Register;