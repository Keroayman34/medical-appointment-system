import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../context/appContext";
const TopDoc = () => {

    let navg = useNavigate();
    let {doctors} = useContext(appContext);

    return(
        <>
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-bold">Top Doctors</h1>
            <p className="sm:w-1/3 text-center text-sm">the most popular doctors in our clinic</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {doctors.slice(0,10).map((item, index) => {
                    return(
                        <div onClick={()=>navg(`/Appint/${item._id}`)} key={index} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
                            <img className="w-40 h-40 object-cover rounded-full mx-auto bg-blue-50" src={item.img} alt="" />
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

export default TopDoc;