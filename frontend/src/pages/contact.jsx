import React from "react";
import { asts } from "../assets/assets";

let Contact = () => {
    return(
        <>
        <div>

            <div className="text-center text-2xl pt-10 text-gray-500">
                <p>CONTACT<span className="text-gray-700 font-semibold">US</span></p>
            </div>

            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
                <img src={asts.cont} alt="Contact Us" className="w-full md:max-w-[360px]"/>
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
                    <p className="text-gray-500">1- Assiut, Egypt</p>
                    <p className="text-gray-500">Tel: +20123456789 <br/> Email: contact@hospital.com</p>
                    <p className="font-semibold text-lg text-gray-600">Careers jla  wajn qkln a</p>
                    <p className="text-gray-500">iwklb ajjlbla oianla qoalkna  olkal asolkanla olanal oclkanl olknd </p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">EXPLORE JOB</button>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default Contact;