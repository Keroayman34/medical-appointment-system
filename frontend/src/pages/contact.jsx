import React from "react";
import { asts } from "../assets/assets";

let Contact = () => {
    return(
        <>
        <div>

            <div className="text-center text-2xl pt-10 text-[#355872]">
                <p>CONTACT<span className="text-[#355872] font-bold">US</span></p>
            </div>

            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
                <img src={asts.cont} alt="Contact Us" className="w-full md:max-w-[360px]"/>
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-lg text-[#355872]">OUR OFFICE</p>
                    <p className="text-[#355872]/75">📍 Assiut, Egypt</p>
                    <p className="text-[#355872]/75">☎ Tel: +20 100 123 4567 <br/> ✉ Email: contact@medicalcenter.com</p>
                    <p className="font-semibold text-lg text-[#355872]">JOIN OUR TEAM</p>
                    <p className="text-[#355872]/75">We're always looking for talented healthcare professionals to join our growing team. Explore career opportunities and become part of our mission to provide excellent healthcare. </p>
                    <button className="border border-main bg-main hover:shadow-lg text-white px-8 py-3 text-sm rounded-lg font-semibold transition-all duration-300">EXPLORE JOB</button>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default Contact;