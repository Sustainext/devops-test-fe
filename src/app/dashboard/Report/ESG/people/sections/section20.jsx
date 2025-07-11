"use client";
import { useState, useRef, useEffect } from "react";

const Section20 = ({ section13_6_3Ref, data,reportType,
  sectionNumber = reportType=='GRI Report: In accordance With' || reportType==='Custom ESG Report'?'13.6.3':'13.6.2',
  sectionTitle = "Occupational Health Services", 
  sectionOrder = 13
 }) => {
  const [content, setContent] = useState(
    `We provide access to occupational health services that support the physical and mental well-being of our employees. This includes medical check-ups, health screenings, and counseling services.`
  );

  return (
    <>
      <div id="section13_6_3" ref={section13_6_3Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
        {sectionNumber} {sectionTitle}
        </h3>

        <p className="text-sm mb-4">
          {data["403-3a-ohs_functions"]
            ? data["403-3a-ohs_functions"].data
              ? data["403-3a-ohs_functions"].data.length > 0
                ? data["403-3a-ohs_functions"].data[0].Q1
                  ? data["403-3a-ohs_functions"].data[0].Q1
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section20;
