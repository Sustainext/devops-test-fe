'use client'
import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';


const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


const Section1=({section7_1Ref})=>{
    const [content,setContent] = useState(
        `Understanding the issues that matter most to our stakeholders and our business is fundamental to [Company Name]'s approach to sustainability. Our materiality assessment identifies and prioritizes the environmental, social, and governance (ESG) issues that are most significant to our stakeholders and our ability to create long-term value. `
    )
    const [content2,setContent2]=useState(
        `This report covers the period from [Start Date] to [End Date] and is part of our annual sustainability reporting cycle. 
We are committed to providing regular updates on our ESG performance to ensure transparency and keep our 
stakeholders informed of our progress.`
    )
    return (
        <>
        <div>
        <p className="text-[15px] text-[#344054] mb-2">
            Edit Statement
            </p>
            <textarea
          value={content}
          className={`border appearance-none text-sm border-gray-400 text-neutral-600 pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer  mt-2 w-full mb-4 `}
          rows={4}
        />
        {/* <div id="setion7_1" ref={section8_1Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
                7.1 Reporting Period, Frequency, and Point of Contact
        </h3>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Reporting Period and Frequency: 
            </p>
            <p className="mb-4 text-sm">{content2}</p>
            <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Point of Contact: 
            </p>
            <p className="mb-4 text-sm">{content2}</p>
        </div> */}
        </div>
        </>
    )
}

export default Section1