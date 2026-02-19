import React from "react";
import { asts } from "../assets/assets";
import { useNavigate } from "react-router-dom";

let Baner = () => {

    let navg = useNavigate();

    return(
        <>
        <div className="flex bg-main rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
            <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">

                    <p>book </p>
                    <p className="mt-4">with +10000 trusted doctors</p>

                </div>
                <button onClick={() => {navg("/register"); scrollTo(0, 0)}} className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all">create Acc</button>
            </div>
            <div className="hidden md:block md:w-1/2 lg:w-[-370px] relative">
                <img className="w-full absolute bottom-0 right-0 max-w-md" src={asts.appoint} alt="" />
            </div>
        </div>
        </>
    )
}

export default Baner;