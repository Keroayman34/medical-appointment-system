import React,{useState , useSelector , useNavigate , useDispatch} from "react";

let Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <form className="min-h-[80px] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                <p className="text-2xl font-semibold">{state === "signUp" ? "Sign Up" : "Login"}</p>

                <p>please fill in all fields</p>
                <div className="w-full">

                    <p>Email</p>
                    <input className="border border-zinc-100 rounded w-full p-2 mt-1 " type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>

                </div>
                <div className="w-full">

                    <p>Password</p>
                    <input className="border border-zinc-100 rounded w-full p-2 mt-1 " type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>

                </div>
                <button className="bg-main text-white w-full py-2 rounded-md text-base">Login</button>
                <p className="text-center">Don't have an account? <span onClick={() => navigate("/register")} className="text-main cursor-pointer">Sign Up</span></p>
            </div>
        </form>
        </>
    )
}

export default Login;