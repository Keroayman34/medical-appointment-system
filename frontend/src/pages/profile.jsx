import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { asts } from "../assets/assets";

const Profile = () => {
    const dispatch = useDispatch();
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    
    const { user, loading } = useSelector((state) => state.auth);

    const [editMode, setEditMode] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const [userData, setUserData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        gender: user?.gender || "male",
        age: user?.age ?? "",
        img: user?.image || asts.prof 
    });

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setUploadError("الصورة لازم تكون JPG أو PNG أو WEBP. اختاري صورة تانية.");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setUploadError("حجم الصورة كبير (أقصى حاجة 2MB). اختاري صورة أصغر.");
            e.target.value = "";
            return;
        }

        const tempImage = new Image();
        const objectUrl = URL.createObjectURL(file);

        tempImage.onload = () => {
            if (tempImage.width < 120 || tempImage.height < 120) {
                setUploadError("أبعاد الصورة صغيرة جدًا. اختاري صورة أوضح.");
                URL.revokeObjectURL(objectUrl);
                e.target.value = "";
                return;
            }

            URL.revokeObjectURL(objectUrl);

            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prev) => ({ ...prev, img: reader.result }));
            };
            reader.readAsDataURL(file);
        };

        tempImage.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setUploadError("الصورة غير صالحة. اختاري صورة تانية.");
            e.target.value = "";
        };

        tempImage.src = objectUrl;
    };

    // دالة حفظ التعديلات وإرسالها للسيرفر
    const handleUpdate = async () => {
        if (uploadError) return;

        const payload = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            gender: userData.gender,
            age: userData.age === "" ? null : Number(userData.age),
            image: typeof userData.img === "string" ? userData.img : "",
        };

        const result = await dispatch(updateProfile(payload)); // نداء الأكشن عشان يحفظ في الداتابيز
        if (result.meta.requestStatus === "fulfilled") {
            setEditMode(false); // قفل وضع التعديل بعد نجاح الحفظ
        }
    };

    if (!user) return <p className="text-center py-20">Please Login to see your profile.</p>;
    
    return(
        <div className="max-w-4xl mx-auto my-8 border border-[#7AAACE]/45 rounded-3xl bg-[#F7F8F0]/90 p-6 md:p-8 shadow-[0_12px_34px_rgba(53,88,114,0.14)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-[#9CD5FF]/65">
                <div className="flex items-center gap-4">
                    <img
                        src={userData.img}
                        alt="Profile"
                        className="rounded-2xl w-24 h-24 object-cover border border-[#7AAACE]/50 shadow-sm"
                    />
                    <div>
                        {editMode ? (
                            <input
                                type="text"
                                className="bg-white/85 border border-[#9CD5FF]/75 text-3xl font-bold rounded-xl px-3 py-2 w-56 outline-none"
                                value={userData.name}
                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                            />
                        ) : (
                            <p className="text-4xl font-bold text-[#355872]">{userData.name}</p>
                        )}
                        <p className="text-[#355872]/75 mt-1">Manage your personal information</p>
                    </div>
                </div>

                {editMode && (
                    <div className="flex flex-col gap-2">
                        <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-main text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300">
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                        </label>
                        {uploadError && <p className="text-red-500 text-xs max-w-48">{uploadError}</p>}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
                <div className="rounded-2xl border border-[#9CD5FF]/55 bg-white/55 p-5">
                    <p className="text-[#355872] text-lg font-bold mb-4">Contact Information</p>

                    <div className="space-y-3">
                        <div>
                            <p className="text-[#355872]/80 font-semibold mb-1">Email</p>
                            {editMode
                                ? <input type="email" className="w-full bg-white/90 border border-[#9CD5FF]/75 rounded-lg px-3 py-2" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})}/>
                                : <p className="text-main font-medium">{userData.email}</p>}
                        </div>

                        <div>
                            <p className="text-[#355872]/80 font-semibold mb-1">Phone</p>
                            {editMode
                                ? <input type="text" className="w-full bg-white/90 border border-[#9CD5FF]/75 rounded-lg px-3 py-2" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})}/>
                                : <p className="text-main font-medium">{userData.phone}</p>}
                        </div>

                        <div>
                            <p className="text-[#355872]/80 font-semibold mb-1">Address</p>
                            {editMode
                                ? <input type="text" className="w-full bg-white/90 border border-[#9CD5FF]/75 rounded-lg px-3 py-2" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})}/>
                                : <p className="text-[#355872]/85">{userData.address}</p>}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#9CD5FF]/55 bg-white/55 p-5">
                    <p className="text-[#355872] text-lg font-bold mb-4">Basic Information</p>

                    <div className="space-y-3">
                        <div>
                            <p className="text-[#355872]/80 font-semibold mb-1">Gender</p>
                            {editMode
                                ? <select className="w-full bg-white/90 border border-[#9CD5FF]/75 rounded-lg px-3 py-2" value={userData.gender} onChange={(e) => setUserData({...userData, gender: e.target.value})}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                : <p className="text-[#355872]/85">{userData.gender}</p>}
                        </div>

                        <div>
                            <p className="text-[#355872]/80 font-semibold mb-1">Age</p>
                            {editMode
                                ? <input className="w-full bg-white/90 border border-[#9CD5FF]/75 rounded-lg px-3 py-2" type="number" min="0" max="130" value={userData.age} onChange={(e) => setUserData({...userData, age: e.target.value})}/>
                                : <p className="text-[#355872]/85">{userData.age ?? ""}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                {editMode ? (
                    <button
                        onClick={handleUpdate}
                        className="border border-main bg-main text-white px-10 py-2.5 rounded-full hover:shadow-lg transition-all"
                    >
                        {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="border border-main text-main px-10 py-2.5 rounded-full hover:bg-main hover:text-white transition-all"
                    >
                        EDIT PROFILE
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile;