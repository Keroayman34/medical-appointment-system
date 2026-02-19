import React from "react";
import { asts } from "../assets/assets.js";

let About = () => {
    return(
        <>
        <div className="text-center text-2xl pt-10 text-gray-500">
            <p>ABOUT<span className="text-gray-700 font-medium">US</span></p>
        </div>

        <div className="my-10 flex flex-col sm:flex-row gap-12">
            <img className="w-full md:max-w-[360px]" src={asts.abot} alt="About Us"/>
            <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
                <p>uwhdksjbkjsabnk kLBD KJN.LA AIkJ SDK DSDKJIDSKJB  IJBNWISJKB SBISLNISAKJBNJS SLIKJANLISJABSKJ SIKJBSDDNIJKSB AIKLKXMOBS CCIAJKKUCAH kshdz iba,  dusjk</p>
                <p>khdjjhbi ijbissjkb jkinjj k KIJ Ijij k ksn jjk, H K,J K k kj kdjm k s klocdibuhvdcbuk  ivdj yudbskcdjsb udsybdch ikjdbs ijdsbi dhsbi disdon h ikbdsi hkjbds hkjdbi hjbdsibj jhjbd ujhbd khjdsu kjbfbikjbdbkj iujbds</p>
                <b className="text-gray-800">our vision</b>
                <p>idskbksjknodsljkndslbndskjbvds djsbidk sudsnld.kxndk jk sdiolkdsnoj dsidskndsk sondso </p>
            </div>
        </div>

        <div className="text-xl my-10">
            <p>WHY<span className="text-gray-700 font-semibold">CHOOSE US</span></p>
        </div>

        <div className="flex flex-col sm:flex-row mb-20">
            <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-main hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">

                <b>Effisioncy</b>
                <p>Our commitment to efficiency ensures that every project is delivered on time and within budget.</p>

            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-main hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">

                <b>Confeditionalty</b>
                <p>We maintain strict confidentiality and trustworthiness in all our dealings.</p>

            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-main hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">

                <b>Profitionaly</b>
                <p>We deliver professional services with expertise and attention to detail.</p>

            </div>
        </div>
        </>
    )
}

export default About;