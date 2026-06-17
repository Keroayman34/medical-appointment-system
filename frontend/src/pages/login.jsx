import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";

let Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/'); // روح للهوم لو السجل صح
            }
        });
    };

    return(
        <>
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center py-12">
            <div className="flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[550px] border border-[#7AAACE]/40 rounded-2xl shadow-xl bg-transparent backdrop-blur-sm">
                <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-[#355872]">Login</p>
                    <p className="text-[#355872]/70 mt-2">Please enter your credentials to continue</p>
                </div>

                {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 whitespace-pre-line">{error}</p>}

                <div className="w-full">
                    <p className="text-[#355872] text-sm font-semibold">Email Address</p>
                    <input className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 mt-1 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" required/>
                </div>

                <div className="w-full">
                    <p className="text-[#355872] text-sm font-semibold">Password</p>
                    <div className="relative mt-1">
                        <input
                            className="border border-[#9CD5FF]/75 rounded-lg w-full p-2 pr-10 bg-white/90 focus:ring-2 focus:ring-[#7AAACE] outline-none"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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

                <button disabled={loading} className="bg-main text-white w-full py-3 rounded-xl text-lg font-bold mt-4 hover:shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:bg-gray-400">
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-[#355872]/80 mt-2">
                    Don't have an account?
                    <span onClick={() => navigate("/register")} className="text-main cursor-pointer underline font-bold ml-1">Sign Up</span>
                </p>
            </div>
        </form>
        </>
    )
}

export default Login;