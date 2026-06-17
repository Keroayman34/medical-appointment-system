import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMnu = () => {
    return(
        <>
        <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-[#355872]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#355872]">Find Your Specialty</h1>
            <p className="sm:w-2/3 text-center text-sm text-[#355872]/85 leading-relaxed">Discover the perfect specialty that matches your passion and skills. Our platform helps you explore different fields easily and guides you to choose the best path for your future. Whether you're a beginner or looking to improve your career, we provide the tools and support you need to succeed.</p>

            <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
                {specialityData.map((item, index) => (
                    <Link onClick={()=>scrollTo(0,0)} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" key={index} to={`/doctors/${item.speciality}`}>
                        <img className="w-16 sm:w-24 mb-2" src={item.img} alt={item.speciality} />
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
        </>
    )
}

export default SpecialityMnu;