"use client";
import { useState, useRef, useEffect } from "react";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setEmission } from "../../../../../../lib/redux/features/ESGSlice/screen12Slice";

const Section2 = ({ section12_1Ref,
  sectionNumber = reportType=='GRI Report: In accordance With' || reportType==='Custom ESG Report'?'12.1':'12.1',
  sectionTitle = 'Emissions',
  sectionOrder = 12,
 }) => {
  const content = useSelector((state) => state.screen12Slice.emissions);
  const dispatch = useDispatch();
  const loadContent = () => {
    dispatch(
      setEmission(
        `We manage our emissions through a comprehensive strategy that includes setting reduction targets, implementing energy-efficient technologies, and monitoring our progress.`
      )
    );
  };

  const handleEditorChange = (e) => {
    dispatch(setEmission(e.target.value));
  };

  return (
    <>
      <div id="section12_1" ref={section12_1Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add statement about company’s strategy to reduce emission
          </p>
          <button
            className="px-2 py-2 text-[#007EEF] border border-[#007EEF] text-[12px] rounded-md mb-2 flex"
            onClick={loadContent}
          >
            {/* <MdOutlinePlaylistAdd className="mr-1 w-[20px] h-[20px]"/> */}
            <Image src={STARSVG} className="w-5 h-5 mr-1.5" alt="star" />
            Auto Fill
          </button>
        </div>
        <textarea
          onChange={handleEditorChange}
          value={content}
          className={`border appearance-none text-sm border-gray-400 text-[#667085] pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full mb-4 `}
          rows={4}
        />
      </div>
    </>
  );
};

export default Section2;
