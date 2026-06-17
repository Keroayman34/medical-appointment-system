import React from "react";
import { asts } from "../assets/assets.js";

let About = () => {
    return(
        <>
        <div className="text-center text-2xl pt-10 text-[#355872]">
            <p>ABOUT<span className="text-[#355872] font-bold">US</span></p>
        </div>

        <div className="my-10 flex flex-col sm:flex-row gap-12">
            <img className="w-full md:max-w-[360px]" src={asts.abot} alt="About Us"/>
            <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-[#355872]/85">
                <p>At our medical facility, we're dedicated to providing comprehensive healthcare solutions tailored to your needs. Our team of experienced professionals works tirelessly to ensure your wellbeing.</p>
                <p>We believe that quality healthcare should be accessible to everyone. That's why we've invested in state-of-the-art equipment and trained our team to deliver the highest standards of care.</p>
                <b className="text-[#355872]">Our Vision</b>
                <p>To be a leading healthcare provider that combines compassionate care with cutting-edge medical technology.</p>
            </div>
        </div>

        <div className="text-xl my-10">
            <p className="text-[#355872] font-bold">WHY<span className="text-[#355872]">CHOOSE US</span></p>
        </div>

        <div className="flex flex-col sm:flex-row mb-20">
            <div className="border border-[#7AAACE]/40 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-base text-[#355872] hover:bg-main hover:text-white transition-all duration-300 cursor-pointer">

                <b>Efficiency</b>
                <p>Our commitment to efficiency ensures that every project is delivered on time and within budget.</p>

            </div>
            <div className="border border-[#7AAACE]/40 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-base text-[#355872] hover:bg-main hover:text-white transition-all duration-300 cursor-pointer">

                <b>Confidentiality</b>
                <p>We maintain strict confidentiality and trustworthiness in all our dealings.</p>

            </div>
            <div className="border border-[#7AAACE]/40 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-base text-[#355872] hover:bg-main hover:text-white transition-all duration-300 cursor-pointer">

                <b>Professionalism</b>
                <p>We deliver professional services with expertise and attention to detail.</p>

            </div>
        </div>
        </>
    )
}

export default About;