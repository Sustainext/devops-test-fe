"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineClear, MdInfoOutline,MdChevronRight } from "react-icons/md";
import { Socialdata } from "../../data/socialgriinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Section2 from "./Section2/page";
import SocialTopBar from '../../socialTopBar'

const InjuriesHazards = ({apiData,setMobileopen}) => {
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  useEffect(() => {
    var newData = [];
    Socialdata.map((program) => {
      program.category.map((tag) => {
        if (tag === category) {
          newData.push(program);
        }
      });
    });
    // //console.log(newData);
    setData(newData);
  }, [category]);
  const griData = [
    {
      tagName:'GRI 403 - 9',
      toggle:'38',
      textColor:"#007EEF",
      bgColor:"bg-slate-200"
  },
  ];

  const brsr = [
    {
      tagName: "BRSR C-P3-E12",
      id: "tooltip-$brsr1",
      content: "BRSR-Section C-Principle 3-Essential Indicators-12",
    },
    {
      tagName: "BRSR C-P3-E15",
      id: "tooltip-$brsr2",
      content: "BRSR-Section C-Principle 3-Essential Indicators-15",
    },
  ];
  const sdgData=[

    {
      tagName:'SDG 3',
      toggle:'39',
      textColor:"#fff",
      bgColor:"bg-green-600"
  },
  {
    tagName:'SDG 8',
    toggle:'40',
    textColor:"#fff",
    bgColor:"bg-red-900"
},
{
  tagName:'SDG 16',
  toggle:'41',
  textColor:"#fff",
  bgColor:"bg-blue-900"
},
]

  return (
    <>
      <div className="flex flex-col justify-start overflow-x-hidden ">
      <SocialTopBar toggleDrawer={toggleDrawer} sdgData={sdgData} apiData={apiData} title={'Occupational Health and Safety'} topic={'SocHealthSafety'} brsr={brsr} griData={griData} setMobileopen={setMobileopen} />
        
        <div className="ml-3 flex">
          <h6 className="text-[17px] mb-4 font-semibold flex">
          Work-related Hazards
            {/* <MdInfoOutline data-tooltip-id={`tooltip-$e1`}
                            data-tooltip-content="This section documents data corresponding to total water
                            withdrawn and total water discharged from areas with water stress." className="mt-1.5 ml-2 text-[15px]" />
                        <ReactTooltip id={`tooltip-$e1`} place="top" effect="solid" style={{
                            width: "290px", backgroundColor: "#000",
                            color: "white",
                            fontSize: "12px",
                            boxShadow: 3,
                            borderRadius: "8px",
                            textAlign: 'left',
                        }}>

                        </ReactTooltip> */}
          </h6>
        </div>
       <div
           className={`${
            isOpen
              ? "translate-x-[15%] block top-16"
              : "translate-x-[120%] hidden top-16"
          }
fixed right-[51px]  w-[360px] h-[92%] bg-white  rounded-md
transition-transform duration-300 ease-in-out z-[100] shadow-2xl px-2`}
        >
          {data &&
            data.map((program, index) => (
              <div key={index}>
                {/* Header */}
                <div className="flex justify-between p-2 pt-5 pb-4 border-b-2 ">
                  <div className="ml-2 h-[38px]">{program.header}</div>
                  <div className="ml-2 float-right ">
                    <h5
                      className="text-[#727272] text-[17px] font-bold cursor-pointer"
                      onClick={toggleDrawerclose}
                    >
                      <MdOutlineClear />
                    </h5>
                  </div>
                </div>

            
                    <div className="hidden xl:block lg:block md:block 2xl:block 4k:block 2k:block 3xl:block">
                <div className="h-[calc(100vh-30px)] overflow-y-auto custom-scrollbar p-2">
                  {program.data}
                </div>
                </div>
                <div className="block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden 2k:hidden 3xl:hidden">
                <div className="h-[calc(90vh-30px)] overflow-y-auto custom-scrollbar p-2">
                  {program.data}
                </div>
                </div>

                {/* Footer (Learn more link) */}
                <div className="pt-2 pb-4 ml-4">
                  <a
                    className="text-[14px] text-[#2196F3] pt-1 inline-flex"
                    href={program.link}
                    target="_blank"
                  >
                    Learn more <MdChevronRight className="text-lg pt-1" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Section2 />
    </>
  );
};
export default InjuriesHazards;
