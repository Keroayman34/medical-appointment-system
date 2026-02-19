import doc1 from "./doc1.png";
import doc2 from "./doc2.jpeg";
import doc4 from "./doc4.png";
import doc5 from "./doc5.png";
import doc6 from "./doc6.png";
import doc7 from "./doc7.png";
import General_physician from "./General_physician.svg";
import Gynecologist from "./Gynecologist.svg";
import logo from "./logo.svg";
import dropdown_icon from "./dropdown_icon.svg";
import Gast from "./Gastroenterologist.svg";
import arrow from "./arrow_icon.svg";
import head from "./header_img.png";
import group from "./group_profiles.png";
import prof from "./profile_pic.png";
import Neur from "./Neurologist.svg";
import Derma from "./Dermatologist.svg";
import Pedia from "./Pediatricians.svg";
import appoint from "./appointment_img.png";
import verf from "./verified_icon.svg";
import info from "./info_icon.svg";
import abot from "./about_image.png";
import cont from "./contact_image.png";


export const asts = {doc1 , doc2 , doc4 , doc5 , doc6 , doc7 , logo , dropdown_icon, arrow, head, group, prof, appoint, verf, info, abot, cont};

export const specialityData =[
    {
        speciality: "General physician",
        img: General_physician
    },

    {
        speciality: "Genacologist",
        img: Gynecologist
    },

    {
        speciality: "Gastroenterologist",
        img: Gast
    },
    {
        speciality: "Neurologist",
        img: Neur
    },
    {
        speciality: "Dermatologist",
        img: Derma
    },
    {
        speciality: "Pediatrician",
        img: Pedia
    },

]


const doctors =[
    {
        _id: 0,
        name: "Dr. Ahmed",
        img: doc1,
        speciality: "General physician",
        degree: "MBBS",
        experiance: "6 months",
        fees: 100,
        address: "25 Mohafza street - Assiut"
    },
    {
        _id: 1,
        name: "Dr. Ahmed",
        img: doc2,
        speciality: "General physician",
        degree: "MBBS",
        experiance: "6 months",
        fees: 100,
        address: "25 Mohafza street - Assiut"
    },
    {
        _id: 2,
        name: "Dr. Ahmed",
        img: doc4,
        speciality: "General physician",
        degree: "MBBS",
        experiance: "6 months",
        fees: 100,
        address: "25 Mohafza street - Assiut"
    }
]

export default doctors;