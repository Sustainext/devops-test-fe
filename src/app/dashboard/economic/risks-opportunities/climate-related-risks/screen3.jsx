"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import axiosInstance from "@/app/utils/axiosMiddleware";
import Economictable from "../../../../shared/widgets/Economic/economictable";
// Simple Custom Table Widget
const widgets = {
  TableWidget: Economictable,
};

const view_path = "gri-economic-climate_related_risks-202-2a-other_risk";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      RiskCategory: {
        type: "string",
        title: "Risk Category",
      },
      TypeofRiskoth: {
        type: "string",
        title: "Type of Risk",
      },
      PotentialImpactoth: {
        type: "string",
        title: "Potential Impact",
      },
      Likelihoodofimpact: {
        type: "string",
        title: "Likelihood of impact",
        enum: ["Low", "Moderate", "High", "Not Sure"],
      },
      MagnitudeofImpact: {
        type: "string",
        title: "Magnitude of Impact",
        enum: ["Low", "Moderate", "High", "Not Sure"],
      },
      FinancialEffect: {
        type: "string",
        title: "Financial Effect",
        enum: ["Very High", "High", "Moderate", "Low", "Very Low"],
      },
      FinancialImplications: {
        type: "string",
        title: "Financial Implications",
        enum: [
          "Increased maintenance costs",
          "Potential fines and revenue loss",
          "Higher premiums",
          "Reduced energy costs",
          "Decreased sales revenue",
          "Others (please specify)",
        ],
      },
      ManagementMethodsoth: {
        type: "string",
        title: "Management Methods",
      },
      TimeFrame: {
        type: "string",
        title: "Time Frame",
        enum: [
          "Immediate-term (0-1 year)",
          "Short-term (1-3 years)",
          "Medium-term (3-5 years)",
          "Long-term (5+ years)",
        ],
      },
      DirectImpacts: {
        type: "string",
        title: "Direct or Indirect Impacts",
        enum: ["Indirect", "Direct", "Not Sure"],
      },
      ImplementedMitigationStrategies: {
        type: "string",
        title: "Implemented Mitigation Strategies",
        enum: ["Yes", "No"],
      },
      MitigationStrategiesoth: {
        type: "string",
        title: "Mitigation Strategies",
      },
    },
  },
};

const uiSchema = {
  "ui:widget": "TableWidget",
  "ui:options": {
    titles: [
      {
        key: "RiskCategory",
        title: "Risk Category",
        tooltip:
          "Please choose the specific type of risk within the selected category",
        tooltipdisplay: "none",
      },
      {
        key: "TypeofRisk",
        title: "Type of Risk",
        tooltip:
          "Please choose the specific type of risk within the selected category",
        tooltipdisplay: "block",
      },
      {
        key: "PotentialImpactoth",
        title: "Potential Impact",
        tooltip:
          "Please identify all potential impacts associated with the selected risk.",
        tooltipdisplay: "block",
      },
      {
        key: "Likelihoodofimpact",
        title: "Likelihood of impact",
        tooltip:
          "Please specify the probability of the impact of the risk on the organization.",
        tooltipdisplay: "block",
      },
      {
        key: "ManagementMethodsoth",
        title: "Magnitude of Impact",
        tooltip:
          "Indicate the estimated magnitude of the impact of the chosen risk.",
        tooltipdisplay: "block",
      },
      {
        key: "FinancialEffect",
        title: "Financial Effect",
        tooltip:
          "Indicate the estimated magnitude of the financial impact of the chosen risk",
        tooltipdisplay: "block",
      },
      {
        key: "FinancialImplications ",
        title: "Financial Implications",
        tooltip:
          "Please describe the specific financial consequences that may result from the chosen risk.",
        tooltipdisplay: "block",
      },
      {
        key: "ManagementMethods ",
        title: "Management Methods",
        tooltip:
          "Select the strategies and actions the organization will implement to manage and mitigate the chosen risk.",
        tooltipdisplay: "block",
      },
      {
        key: "TimeFrame",
        title: "Time Frame",
        tooltip:
          "Please indicate the expected period for the selected risk to materialize.",
        tooltipdisplay: "block",
      },
      {
        key: "DirectImpacts",
        title: "Direct or Indirect Impacts",
        tooltip:
          "Please specify whether the impacts of the selected risk on the organization are direct,indirect, or uncertain.",
        tooltipdisplay: "block",
      },
      {
        key: "ImplementedMitigationStrategies",
        title: "Implemented Mitigation Strategies",
        textdriction: "start",
        tooltip:
          "Indicate whether any mitigation strategies have already been implemented for the chosen risk (Yes/No).",
        tooltipdisplay: "block",
      },
      {
        key: "MitigationStrategiesoth",
        title: "Mitigation Strategies",
        tooltip:
          "If yes, Please select the actions taken by the organization to mitigate or reduce the selected risk.",
        tooltipdisplay: "block",
      },
    ],
  },
};
const Screen3 = ({
  selectedOrg,
  selectedCorp,
  selectedLocation,
  year,
  month,
  tcfdtag,
  togglestatus,
}) => {
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);

  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };

  const handleChange = (e) => {
    setFormData(e.formData);
  };

  const updateFormData = async () => {
    const data = {
      client_id: client_id,
      user_id: user_id,
      path: view_path,
      form_data: formData,
      corporate: selectedCorp,
      organisation: selectedOrg,
      year,
      location: selectedLocation,
    };
    const url = `${process.env.BACKEND_API_URL}/datametric/update-fieldgroup`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status === 200) {
        toast.success("Data added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        LoaderClose();
        loadFormData();
      } else {
        toast.error("Oops, something went wrong", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        LoaderClose();
      }
    } catch (error) {
      toast.error("Oops, something went wrong", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      LoaderClose();
    }
    // console.log('Response:', response.data);
    // } catch (error) {
    // console.error('Error:', error);
    // }
  };

  const loadFormData = async () => {
    console.log("loadFormData screen 2");
    LoaderOpen();
    setFormData([{}]);
    const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&corporate=${selectedCorp}&organisation=${selectedOrg}&year=${year}&location=${selectedLocation}`;
    try {
      const response = await axiosInstance.get(url);
      console.log("API called successfully:", response.data);
      setRemoteSchema(response.data.form[0].schema);
      setRemoteUiSchema(response.data.form[0].ui_schema);
      setFormData(response.data.form_data[0].data);
    } catch (error) {
      setFormData([{}]);
    } finally {
      LoaderClose();
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with:", {
      selectedOrg,
      year,
      togglestatus,
      selectedLocation,
      selectedCorp,
    });

    if (selectedOrg && year && togglestatus) {
      if (togglestatus === "Corporate") {
        if (selectedCorp) {
          console.log("Calling loadFormData for Corporate");
          loadFormData();
        } else {
          console.log("Clearing form data for Corporate");
          setFormData([{}]);
          setRemoteSchema({});
          setRemoteUiSchema({});
        }
      } else if (togglestatus === "Location") {
        if (selectedLocation) {
          console.log("Calling loadFormData for Location");
          loadFormData();
        } else {
          console.log("Clearing form data for Location");
          setFormData([{}]);
          setRemoteSchema({});
          setRemoteUiSchema({});
        }
      } else {
        console.log("Calling loadFormData for Other");
        loadFormData();
      }

      toastShown.current = false;
    } else {
      if (!toastShown.current) {
        console.log("Toast should be shown");
        toastShown.current = true;
      }
    }
  }, [selectedOrg, year, selectedCorp, togglestatus, selectedLocation]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log("Form data:", formData);
    updateFormData();
  };

  return (
    <>
      <div
        className="mx-2 pb-11 pt-3 px-3 mb-6 rounded-md "
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        }}
      >
        <div className="mb-4 flex">
          <div className="w-[80%] relative">
            <h2 className="flex mx-2 text-[15px] text-neutral-950 font-[500]">
              Other risks
              {/* <MdInfoOutline
                data-tooltip-id={`tooltip-$e87`}
                data-tooltip-content="This section documents data corresponding to the number of
workers who are not employees but whose work is controlled by your organization.
It also describes the most common types of these workers,
their contractual relationships with your organization, and the types of work they perform."
                className="mt-1.5 ml-2 text-[15px]"
              />
              <ReactTooltip
                id={`tooltip-$e87`}
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
              ></ReactTooltip> */}
            </h2>
          </div>
          <div className="w-full xl:w-[20%] lg:w-[20%] md:w-[20%] 2xl:w-[20%] 4k:w-[20%] 2k:w-[20%] mb-4">
            <div
              className={`flex flex-wrap gap-2 items-center ${
                tcfdtag.length === 0 ? "justify-end" : "justify-end"
              }`}
            >
              {/* Static GRI tag */}
              <div className="w-[80px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg flex justify-center items-center">
                <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight text-center">
                  GRI 201-2a
                </div>
              </div>

              {/* Dynamic TCFD tags */}
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
            </div>
          </div>
        </div>
        <div className="mx-2 ">
          <Form
            schema={r_schema}
            uiSchema={r_ui_schema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            widgets={widgets}
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            className={`text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end ${
              (!selectedCorp && togglestatus === "Corporate") ||
              (!selectedLocation && togglestatus === "Location") ||
              !selectedOrg ||
              !year
                ? "cursor-not-allowed opacity-90"
                : ""
            }`}
            onClick={handleSubmit}
            disabled={
              (togglestatus === "Corporate" && !selectedCorp) ||
              (togglestatus === "Location" && !selectedLocation) ||
              !selectedOrg ||
              !year
            }
          >
            Submit
          </button>
        </div>
      </div>
      {loopen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Oval
            height={50}
            width={50}
            color="#00BFFF"
            secondaryColor="#f3f3f3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
};

export default Screen3;
