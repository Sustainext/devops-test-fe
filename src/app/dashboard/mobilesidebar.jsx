import React, { useState, useEffect } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowDown,
  MdOutlineAddBox,
  MdPublic,
  MdOutlineGroup,
  MdOutlineDiversity1,
  MdOutlineDiversity2,
  MdOutlineDiversity3,
  MdOutlinePieChartOutline,
  MdOutlineBarChart,
  MdOutlineSettingsSuggest,
  MdOutlineSearch,
  MdOutlineAccountTree,
  MdInfoOutline,
  MdEditNote,
  MdOutlineManageAccounts,
  MdOutlinePersonAddAlt,
  MdLockOutline,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { TbNotes } from "react-icons/tb";
import { LiaHomeSolid } from "react-icons/lia";
import Link from "next/link";

import { CiSettings } from "react-icons/ci";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAssignment } from "react-icons/md";
import {
  fetchMaterialityData,
  setCorpID,
  setCorpName,
  setMaterialityYear,
  setOrgName,
  setOrgID,
  setStartDate,
  setEndDate,
  setIsYearChanged,
} from "../../lib/redux/features/materialitySlice";
import { GiHamburgerMenu } from "react-icons/gi";
import Userprofile from "./Mobilecomponent/userprofile";
import Breadcrumb from "./Mobilecomponent/breadcrumb";
const MobileSidenav = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [newrole, setRole] = useState(""); // Ensure role is initialized
  const [open, setOpen] = useState(false);
  //materiality variables
  const dispatch = useDispatch();
  const {
    corporate_id,
    organization_id,
    start_date,
    end_date,
    data,
    loading,
    error,
    materiality_year,
  } = useSelector((state) => state.materialitySlice);

  const loadMaterialityDashboard = () => {
    dispatch(
      fetchMaterialityData({
        corporate: corporate_id ? corporate_id : "",
        organization: organization_id ? organization_id : "",
        start_date: materiality_year ? `${materiality_year}-01-01` : "",
        end_date: materiality_year ? `${materiality_year}-12-31` : "",
      })
    );
  };

  // Load permissions and role from localStorage or API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPermissions = localStorage.getItem("permissions");
      const storedRole = localStorage.getItem("custom_role"); // Fetch the role
      if (storedPermissions) {
        try {
          setPermissions(JSON.parse(storedPermissions));
        } catch (error) {
          console.error("Failed to parse stored permissions:", error);
          setPermissions({}); // Fallback to an empty object if parsing fails
        }
      } else {
        setPermissions({}); // Set permissions to empty object if not available
      }

      if (storedRole) {
        setRole(storedRole); // Get role from localStorage
        console.log("Stored role:", storedRole);
      }
    }
  }, []);
  const isNewRole = newrole === "true";

  const Menus = [
    {
      id: 0,
      title: "Sustainext HQ",
      icon: <LiaHomeSolid />,
      link: "/dashboard",
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    {
      id: 1,
      title: "Materiality Dashboard",
      icon: <MdOutlinePieChartOutline />,
      spacing: true,
      link: "/dashboard/Materiality",
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    // {
    //   id: 2,
    //   title: "Supplier Assessment",
    //   icon: <MdOutlineAssignment />,
    //   link: "/dashboard/SupplierAssessment",
    //   spacing: true,
    //   // permission: "supplier",
    //   // role: false,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    {
      id: 3,
      title: "Collect",
      icon: <MdOutlineAddBox />,
      submenu: true,
      permission: "collect",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,

      submenuItems: [
        {
          id: "2-1",
          title: "Environment",
          icon: <MdPublic />,
          link: "/dashboard/environment",
        },
        {
          id: "2-2",
          title: "Social",
          icon: <MdOutlineGroup />,
          link: "/dashboard/social",
        },
        {
          id: "2-3",
          title: "Governance",
          icon: <MdOutlineDiversity1 />,
          link: "/dashboard/governance",
        },
        {
          id: "2-4",
          title: "General",
          icon: <MdOutlineDiversity2 />,
          link: "/dashboard/general",
        },
        {
          id: "2-5",
          title: "Economic",
          icon: <MdOutlineDiversity3 />,
          link: "/dashboard/economic",
        },
      ],
    },
    {
      id: 4,
      title: "Analyse",
      icon: <MdOutlineBarChart />,
      submenu: true,
      permission: "analyse",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,

      submenuItems: [
        {
          id: "3-1",
          title: "Environment",
          icon: <MdPublic />,
          link: "/dashboard/Analyse/environment",
        },
        {
          id: "3-2",
          title: "Social",
          icon: <MdOutlineGroup />,
          link: "/dashboard/Analyse/social",
        },
        {
          id: "3-3",
          title: "Governance",
          icon: <MdOutlineDiversity1 />,
          link: "/dashboard/Analyse/governance",
        },
        {
          id: "3-4",
          title: "General",
          icon: <MdOutlineDiversity2 />,
          link: "/dashboard/Analyse/general",
        },
        {
          id: "3-5",
          title: "Economic",
          icon: <MdOutlineDiversity3 />,
          link: "/dashboard/Analyse/economic",
        },
      ],
    },
    {
      id: 5,
      title: "Report",
      icon: <MdEditNote />,
      link: "/dashboard/Report",
      permission: "report",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    {
      id: 6,
      title: "Optimise",
      icon: <MdOutlineSettingsSuggest />,
      link: "/dashboard/Optimise",
      permission: "optimise",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    {
      id: 7,
      title: "Track",
      icon: <MdOutlineSearch />,
      spacing: true,
      role: true,
      link: "/dashboard/Track",
      permission: "track",
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },

    isNewRole && {
      id: 8,
      title: "Users",
      icon: <MdOutlineGroup />,
      submenu: true,
      role: true,
      submenuItems: [
        {
          id: "7-1",
          title: "Create new user",
          icon: <MdOutlinePersonAddAlt />,
          link: "/dashboard/Users/create-new-users",
        },
        {
          id: "7-2",
          title: "Manage Users",
          icon: <MdOutlineManageAccounts />,
          link: "/dashboard/Users/manage-users",
        },
      ],
    },

    {
      id: 9,
      title: "Organizational Structure",
      icon: <MdOutlineAccountTree />,
      link: "/dashboard/OrgStructure",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
      spacing: true,
    },

    // isNewRole && {
    //   id: 10,
    //   title: "Audit logs",
    //   icon: <TbNotes />,
    //   link: "/dashboard/Auditlogs",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // {
    //   id: 11,
    //   title: "Settings",
    //   icon: <CiSettings />,
    //   link: "/dashboard/Settings",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // {
    //   id: 10,
    //   title: "About",
    //   icon: <MdInfoOutline />,
    //   link: "#",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
  ].filter(Boolean); // Remove false values (if the "Users" menu is not rendered)

  const [submenuOpen, setSubmenuOpen] = useState(
    new Array(Menus.length).fill(false)
  );

  const toggleSubmenu = (index) => {
    const newSubmenuOpen = submenuOpen.map((item, i) =>
      i === index ? !item : false
    );
    setSubmenuOpen(newSubmenuOpen);
  };

  const isSubmenuActive = (menu) => {
    return menu.submenuItems?.some(
      (submenuItem) => submenuItem.id === activeIndex
    );
  };

  const hasPermission = (menu) => {
    if (!menu.permission) return true; // No permission needed
    return permissions[menu.permission] === true; // Allow if permission is granted
  };
  const toggleSidebar = () => {
    setOpen(!open);
  };
  return (
    <>
      <div className="w-full py-2 px-4 fixed shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] bg-white z-[100]">
        <div className="flex gap-4 py-2">
          <div>
            <div className="flex items-center gap-x-4">
              <GiHamburgerMenu
                className="text-4xl cursor-pointe text-[#667085]"
                onClick={toggleSidebar}
              />
              <div className="flex justify-center">
                <img
                  src="/sustainext.png"
                  alt="Logo"
                  className="h-10 w-[3.5rem]"
                />
              </div>
            </div>
          </div>

          <div className="float-end me-2 w-[90%] ">
            <Userprofile />
          </div>
        </div>
        <div className="mx-1">
          <Breadcrumb />
        </div>
        <div
          className={`fixed top-0 left-0 w-full h-full bg-gray-900 text-white overflow-hidden transition-all duration-500 ease-in-out z-[100] ${
            open
              ? "opacity-100 overflow-y-auto table-scrollbar"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center w-full px-4 pt-7">
            {/* Close Button (on the left) */}

            {/* Logo & Title (Centered) */}
            <div className="flex justify-center items-center  w-[80%] py-6">
              <img src="/download.png" alt="Logo" className="h-10 w-auto" />
              <h1 className="text-white text-2xl ml-2">Sustainext</h1>
            </div>
            <div className="w-[20%] ">
              <MdClose
                className="text-white text-3xl cursor-pointer float-end"
                onClick={toggleSidebar}
              />
            </div>
            <div></div>
          </div>

          {/* mobile version end*/}
          <ul className="pt-2 overflow-y-scroll  scrollable-content">
            {Menus.filter(hasPermission).map((menu, index) => (
              <React.Fragment key={menu.id}>
                {menu.submenu ? (
                  <li
                    className={`text-white text-sm flex justify-center items-center cursor-pointer rounded-md mt-2 w-full p-2
          ${submenuOpen[index] || isSubmenuActive(menu) ? "bg-[#081746]" : ""}
          ${!open && activeIndex === menu.id ? "bg-[#081746]" : ""}`}
                    onClick={() => {
                      toggleSubmenu(index);
                      setActiveIndex(menu.id);

                      // Check if the clicked menu is "Collect" and call loadMaterialityDashboard
                      if (menu.title === "Collect") {
                        loadMaterialityDashboard();
                      } else {
                        dispatch(setCorpID(""));
                        dispatch(setCorpName(""));
                        dispatch(setOrgID(""));
                        dispatch(setOrgName(""));
                        dispatch(setMaterialityYear(""));
                        dispatch(setStartDate(""));
                        dispatch(setEndDate(""));
                        dispatch(setIsYearChanged(false));
                      }
                    }}
                  >
                    <div className="w-[90%] flex justify-center items-center">
                      <span
                        className={`text-2xl flex items-center justify-center w-12 h-8 rounded-md ${
                          !open ? "hover:bg-[#007EEF]" : ""
                        }${
                          !open &&
                          (activeIndex === menu.id || isSubmenuActive(menu))
                            ? "bg-[#081746]"
                            : ""
                        }`}
                        data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-content={menu.title}
                        onClick={() => setOpen(!open)}
                      >
                        {menu.icon ? menu.icon : <LiaHomeSolid />}
                      </span>

                      <div className="text-left w-[42vw]">
                        <span className={`text-sm font-medium`}>
                          {menu.title}
                        </span>
                      </div>
                    </div>
                    <div className="w-[10%]">
                      {menu.submenu && open && (
                        <MdKeyboardArrowDown
                          className={`text-2xl float-end ${
                            submenuOpen[index] ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {!open && (
                      <ReactTooltip
                        id={`tooltip-${index}`}
                        place="right"
                        effect="solid"
                        style={{
                          fontSize: "10px",
                          background: "#0a0528",
                          boxShadow: 3,
                          borderRadius: "8px",
                          zIndex: 1000,
                        }}
                      />
                    )}
                  </li>
                ) : (
                  <Link href={menu.link} key={menu.id}>
                    <li
                      className={`text-white text-sm flex justify-center items-center  cursor-pointer rounded-md mt-2 w-full p-2
            ${open ? "hover:bg-[#007EEF]" : ""} ${
                        open && activeIndex === menu.id ? "bg-[#081746]" : ""
                      } ${
                        !open && activeIndex === menu.id ? "bg-[#081746]" : ""
                      }`}
                      onClick={() => {
                        setActiveIndex(menu.id);
                        setOpen(!open);

                        // Check if the clicked menu is "Collect" and call loadMaterialityDashboard
                        if (menu.title === "Collect") {
                          loadMaterialityDashboard();
                        } else {
                          dispatch(setCorpID(""));
                          dispatch(setCorpName(""));
                          dispatch(setOrgID(""));
                          dispatch(setOrgName(""));
                          dispatch(setMaterialityYear(""));
                          dispatch(setStartDate(""));
                          dispatch(setEndDate(""));
                          dispatch(setIsYearChanged(false));
                        }
                      }}
                    >
                      <div className="w-[90%] flex justify-center items-center ">
                        <span
                          className={`text-2xl flex items-center justify-center rounded-md w-12 h-8 ${
                            !open ? "hover:bg-[#007EEF]" : ""
                          }
              ${!open && activeIndex === menu.id ? "bg-[#081746]" : ""}`}
                          data-tooltip-id={`tooltip-${index}`}
                          data-tooltip-content={menu.title}
                        >
                          {menu.icon ? menu.icon : <LiaHomeSolid />}
                        </span>

                        <div className="text-left w-[42vw]">
                          <span className={`text-sm font-medium `}>
                            {menu.title}
                          </span>
                        </div>
                      </div>
                      <div className="w-[10%]">
                        {menu.lockiconshow && open && (
                          <span className="text-2xl w-5 h-8 rounded-md float-end">
                            {menu.lockicon}
                          </span>
                        )}
                      </div>

                      {!open && (
                        <ReactTooltip
                          id={`tooltip-${index}`}
                          place="right"
                          effect="solid"
                          style={{
                            fontSize: "10px",
                            background: "#0a0528",
                            boxShadow: 3,
                            borderRadius: "8px",
                            zIndex: 1000,
                          }}
                        />
                      )}
                    </li>
                  </Link>
                )}
                {menu.spacing && (
                  <hr className="bg-[rgba(217, 217, 217, 1)] h-[0.0625rem] my-4 mx-3 opacity-30" />
                )}
                {menu.submenu && submenuOpen[index] && open && (
                  <ul>
                    {menu.submenuItems.map((submenuItem) => (
                      <Link href={submenuItem.link} key={submenuItem.id}>
                        <li
                          className={`text-white text-sm p-2 flex justify-center items-center  w-full  cursor-pointer hover:bg-[#007EEF] rounded-md  mt-2 ${
                            activeIndex === submenuItem.id ? "bg-[#081746]" : ""
                          }`}
                          onClick={() => {
                            setActiveIndex(submenuItem.id);
                            setOpen(!open);

                            // if (submenuItem.title === "Environment") {
                            //   loadMaterialityDashboard();
                            // }
                            // else{
                            //   dispatch(setCorpID(''))
                            //   dispatch(setCorpName(''))
                            //   dispatch(setOrgID(''))
                            //   dispatch(setOrgName(''))
                            //   dispatch(setMaterialityYear(''))
                            //   dispatch(setStartDate(''))
                            //   dispatch(setEndDate(''))
                            // }
                          }}
                        >
                          <div className="flex justify-center items-center w-full">
                            <div>
                              <span className="text-2xl flex items-center justify-center rounded-md w-12 h-8">
                                {submenuItem.icon ? (
                                  submenuItem.icon
                                ) : (
                                  <LiaHomeSolid />
                                )}
                              </span>
                            </div>
                            <div className="text-left w-[52vw]">
                              <span className={`text-sm font-medium`}>
                                {submenuItem.title}
                              </span>
                            </div>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileSidenav;
