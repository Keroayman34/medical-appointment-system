import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { asts } from "../assets/assets";

const Profile = () => {
    const dispatch = useDispatch();
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    
    // جلب البيانات من Redux
    const { user, loading } = useSelector((state) => state.auth);

    // حالة التعديل
    const [editMode, setEditMode] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // حالة البيانات المحلية
    const [userData, setUserData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        gender: user?.gender || "male",
        dob: user?.dob || "",
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
            dob: userData.dob,
            image: typeof userData.img === "string" ? userData.img : "",
        };

        const result = await dispatch(updateProfile(payload)); // نداء الأكشن عشان يحفظ في الداتابيز
        if (result.meta.requestStatus === "fulfilled") {
            setEditMode(false); // قفل وضع التعديل بعد نجاح الحفظ
        }
    };

    if (!user) return <p className="text-center py-20">Please Login to see your profile.</p>;
    
    return(
        <>
        <div className="max-w-lg flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-4">
                <img src={userData.img} alt="Profile" className="rounded-full w-24 h-24 object-cover"/>
                {editMode && (
                    <div className="flex flex-col gap-1">
                        <label className="cursor-pointer flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300">
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                        </label>
                        {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
                    </div>
                )}
            </div>

            {
                editMode
                ? <input type="text" className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 outline-none px-2" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})}/>
                : <p className="text-3xl font-medium mt-4 text-neutral-800">{userData.name}</p>
            }

            <hr className="bg-zinc-400 h-[1px] border-none"/>

            <div>
                <p className="text-neutral-500 underline mt-3 uppercase font-medium">CONTACT INFO</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">EMAIL IS : </p>
                    {
                        editMode
                        ? <input type="email" className="bg-gray-100 max-w-52 px-1" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})}/>
                        : <p className="text-blue-400">{userData.email}</p>
                    }
                    <p className="font-medium">PHONE : </p>
                    {
                        editMode
                        ? <input type="text" className="bg-gray-100 max-w-52 px-1" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})}/>
                        : <p className="text-blue-400">{userData.phone}</p>
                    }
                    <p className="font-medium">ADDRESS : </p>
                    {
                        editMode
                        ? <input type="text" className="bg-gray-50 px-1" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})}/>
                        : <p className="text-gray-500">{userData.address}</p>
                    }
                </div>
            </div>

            <div>
                <p className="text-neutral-500 underline mt-3 uppercase font-medium">Basic Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">GENDER : </p>
                    {
                        editMode
                        ? <select className="max-w-20 bg-gray-100 outline-none" value={userData.gender} onChange={(e) => setUserData({...userData, gender: e.target.value})}> 
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        : <p className="text-gray-400">{userData.gender}</p>
                    }
                    <p className="font-medium">DATE OF BIRTH : </p>
                    {
                        editMode
                        ? <input className="max-w-28 bg-gray-100 px-1" type="date" value={userData.dob} onChange={(e) => setUserData({...userData, dob: e.target.value})}/>
                        : <p className="text-gray-400">{userData.dob}</p>
                    }
                </div>
            </div>

            <div className="mt-10">
                {
                    editMode                    
                    ? <button onClick={handleUpdate} className="border border-main px-8 py-2 rounded-full hover:bg-main hover:text-white transition-all">
                        {loading ? "SAVING..." : "SAVE"}
                      </button>
                    : <button onClick={() => setEditMode(true)} className="border border-main px-8 py-2 rounded-full hover:bg-main hover:text-white transition-all">EDIT</button>
                }
            </div>
        </div>
        </>
    )
}

export default Profile;