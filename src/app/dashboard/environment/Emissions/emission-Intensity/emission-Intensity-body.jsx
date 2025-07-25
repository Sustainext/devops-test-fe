"use client";
import { useState, useCallback } from "react";
import { MdKeyboardArrowDown, MdInfoOutline } from "react-icons/md";
import { GlobalState } from "../../../../../Context/page";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Screen1 from "./screen1";
import { useDispatch } from "react-redux";
import { f_setTabName } from "../../../../../lib/redux/features/FileInfoSlice";

const AccordionItem = ({
  title,
  children,
  tooltiptext,
  sdg,
  display,
  location,
  setLocationMessage,
  year,
  setYearMessage,
  selectedOrg,
  tcfdtag,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open } = GlobalState();
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!selectedOrg || !year) {
      return; // Prevent opening if selectedOrg or year is not selected
    }

    setIsOpen(!isOpen);
    dispatch(f_setTabName(title));
  };

  return (
    <div
      className={`shadow-md py-1 mb-4 rounded-[8px] cursor-pointer border border-b-3 border-neutral-200 `}
    >
      <button
        className="py-3 text-left block  xl:flex w-[100%]"
        onClick={handleClick} // Unique ID for the tooltip, spaces replaced by dashes
      >
        <div className="block w-full xl:flex lg:flex md:flex 2xl:flex 4k:flex">
          <div
            className={`flex w-full xl:w-[75%] lg:w-[75%] md:w-[75%] 4k:w-[75%] 2xl:w-[75%]`}
          >
            <div className="flex w-[95%] xl:w-[75%] lg:w-[75%] md:w-[75%] 4k:w-[75%] 2xl:w-[75%] mb-2">
              <div className="flex items-center ">
                <h5 className="text-[15px] text-[#344054] px-3 font-[500]">
                  {title}
                </h5>
              </div>

              <div className="xl:flex md:flex lg:flex 2xl:flex 4k:flex block xl:items-center lg:items-center md:items-center 2xl:items-center 4k:items-center  justify-center relative">
                <MdInfoOutline
                  data-tooltip-id={`tooltip-${title.replace(/\s+/g, "-")}`}
                  data-tooltip-content={tooltiptext}
                  className="mt-1 text-[14px]"
                  style={{ display: display }}
                />
                {/* Tooltip */}
                <ReactTooltip
                  id={`tooltip-${title.replace(/\s+/g, "-")}`}
                  place="top"
                  effect="solid"
                  style={{
                    width: "300px",
                    backgroundColor: "#000",
                    color: "white",
                    fontSize: "12px",
                    boxShadow: 3,
                    borderRadius: "8px",
                  }}
                ></ReactTooltip>
              </div>
            </div>

            <div className="block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden  w-[25%]">
              <MdKeyboardArrowDown
                className={`text-2xl float-end me-1 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          <div className="w-full xl:w-[25%] lg:w-[25%] 2xl:w-[25%] 4k:w-[25%] md:w-[25%]">
            <div
              className={`flex float-start xl:float-end lg:float-end 2xl:float-end md:float-end`}
            >
              {isOpen ? (
                <>
                  {sdg &&
                    sdg.map((sdgItem, index) => (
                      <div
                        key={index}
                        className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2"
                        style={{ display: display }}
                      >
                        <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">
                          {sdgItem}
                        </p>
                      </div>
                    ))}
                  {tcfdtag.map((item, index) => (
                    <div
                      key={index}
                      className="w-[110px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg flex justify-center items-center"
                    >
                      <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight text-center">
                        {item.tagName}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {sdg &&
                    sdg.map((sdgItem, index) => (
                      <div
                        key={index}
                        className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2"
                      >
                        <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">
                          {sdgItem}
                        </p>
                      </div>
                    ))}
                  {tcfdtag.map((item, index) => (
                    <div
                      key={index}
                      className="w-[110px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg flex justify-center items-center"
                    >
                      <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight text-center">
                        {item.tagName}
                      </div>
                    </div>
                  ))}
                </>
              )}
              <MdKeyboardArrowDown
                className={`text-2xl hidden xl:block lg:block md:block 2xl:block 4k:block ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </button>
      {isOpen && <div className="py-4 px-3">{children}</div>}
    </div>
  );
};

const EmissionIntensitybody = ({
  selectedOrg,
  selectedCorp,
  year,
  tcfdtag,
  togglestatus,
}) => {
  return (
    <>
      <div className="xl:mx-3 lg:mx-3 md:mx-3 2xl:mx-3 4k:mx-3 2k:mx-3 mx-1">
        <AccordionItem
          title="GHG Emission Intensity"
          tooltiptext={`This section documents the data corresponding 
to the energy intensity ratio of the organisation.`}
          sdg={["GRI 305-4b", "GRI 305-4c"]}
          display="block"
          selectedOrg={selectedOrg}
          selectedCorp={selectedCorp}
          year={year}
          togglestatus={togglestatus}
          tcfdtag={tcfdtag}
        >
          <Screen1
            selectedOrg={selectedOrg}
            selectedCorp={selectedCorp}
            year={year}
            togglestatus={togglestatus}
          />
        </AccordionItem>
      </div>
    </>
  );
};

export default EmissionIntensitybody;
