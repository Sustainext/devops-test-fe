"use client";
import React, { useState, useEffect, useRef } from "react";
import EnvironmentHeader2 from "../../environmentheader2";
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from "react-icons/md";
import { Energydata } from "../../data/griinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Screen1 from "./screen1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WasteTopBar from '../wasteTopBar'
import { useSelector } from "react-redux";

const SignificantSpills = ({apiData,isSidepanelOpen,setMobileopen}) => {
    const { corporate_id, organization_id,materiality_year, start_date, end_date, loading, error } = useSelector(
        (state) => state.materialitySlice
      );
      const materialityEnvData=apiData&&apiData.environment?apiData.environment:{}
      const [year, setYear] = useState(materiality_year?materiality_year:'');
      const [selectedOrg, setSelectedOrg] = useState(organization_id?organization_id:'');
      const [selectedCorp, setSelectedCorp] = useState(corporate_id?corporate_id:'');
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState("");
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [organisationMessage, setOrganisationMessage] = useState("");
  const [corporateMessage, setCorporateMessage] = useState("");
  const [yearMessage, setYearMessage] = useState("");
  const [togglestatus, setToggleStatus] = useState("Organization");
  const drawerRef = useRef(null);
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  useEffect(() => {
    var newData = [];
    Energydata.map((program) => {
      program.category.map((tag) => {
        if (tag === category) {
          newData.push(program);
        }
      });
    });
    // //console.log(newData);
    setData(newData);
  }, [category]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false); // Close drawer when clicking outside
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sdgData=[
  {
    tagName:'SDG 3',
    toggle:'19',
    textColor:"#fff",
    bgColor:"bg-[#2D9A47]"
},
{
    tagName:'SDG 6',
    toggle:'49',
    textColor:"#fff",
    bgColor:"bg-[#26BDE2]"
},
{
    tagName:'SDG 12',
    toggle:'30',
    textColor:"#fff",
    bgColor:"bg-[#BF8B2E]"
},
{
    tagName:'SDG 15',
    toggle:'23',
    textColor:"#fff",
    bgColor:"bg-[#56C02B]"
},
]
  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="flex flex-col justify-start overflow-x-hidden ">
        <WasteTopBar toggleDrawer={toggleDrawer} sdgData={sdgData} apiData={apiData} SignificantSpills={true} setMobileopen={setMobileopen}  />

        <div className="ml-3 flex relative">
          <h6 className="text-[17px] mb-4 font-semibold flex">
         Significant Spills (GRI: 306-3, 2016 )
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e1`}
              data-tooltip-content="This section documents the data corresponding to the significant spills."
              className="mt-1.5 ml-2 text-[15px]"
            />
            <ReactTooltip
              id={`tooltip-$e1`}
              place="top"
              effect="solid"
              style={{
                width: "290px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                textAlign: "left",
              }}
            ></ReactTooltip>
          </h6>
        </div>
        <div
          ref={drawerRef}
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
                <div className="pt-2 pb-4 ml-4" onClick={toggleDrawerclose}>
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
       <EnvironmentHeader2
             activeMonth={activeMonth}
             setActiveMonth={setActiveMonth}
             selectedOrg={selectedOrg}
             setSelectedOrg={setSelectedOrg}
             selectedCorp={selectedCorp}
             setSelectedCorp={setSelectedCorp}
             year={year}
             setYear={setYear}
             organisationMessage={organisationMessage}
             setOrganisationMessage={setOrganisationMessage}
             corporateMessage={corporateMessage}
             setCorporateMessage={setCorporateMessage}
             setYearMessage={setYearMessage}
             yearMessage={yearMessage}
             setToggleStatus={setToggleStatus}
           />
      <Screen1
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        year={year}
        setYear={setYear}
        setOrganisationMessage={setOrganisationMessage}
        setCorporateMessage={setCorporateMessage}
        setYearMessage={setYearMessage}
        isSidepanelOpen={isSidepanelOpen}
        togglestatus={togglestatus}
      />
    </>
  );
};
export default SignificantSpills;
