import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // نستخدم useSelector فقط لأن البيانات غالباً تم جلبها بالفعل
import { useNavigate } from "react-router-dom";
import { asts } from "../assets/assets.js"

let RelateDoc = ({ specialty, docID }) => {
    const { doctors } = useSelector((state) => state.doctors);
    const navg = useNavigate();
    const [relatedDocs, setRelatedDocs] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && specialty) {
            // فلترة الدكاترة حسب التخصص واستبعاد الدكتور الحالي
            const filtered = doctors.filter(d => d.specialty === specialty && d._id !== docID);
            setRelatedDocs(filtered);
        }
    }, [specialty, doctors, docID]);
    
    return(
        <>
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-bold">Top Doctors</h1>
            <p className="sm:w-1/3 text-center text-sm">the most popular doctors in our clinic</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {relatedDocs.slice(0,5).map((item, index) => {
                    return(
                        <div onClick={()=>{navg(`/Appint/${item._id}`); scrollTo(0,0)}} key={index} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
                            <img className="w-40 h-40 object-cover rounded-full mx-auto bg-blue-50" src={asts.doc} alt="" />
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                                    <p className="w-2 h-2 bg-green-500 rounded-full"></p><p>Available</p>
                                </div>
                                <p className="text-lg font-medium text-gray-900">{item.name}</p>
                                <p className="text-gray-600 text-sm">{item.speciality}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <button onClick={()=>{navg('/doctors'); scrollTo(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10">View All</button>
        </div>
        </>
    )
}

export default RelateDoc;