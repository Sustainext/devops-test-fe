"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import inputWidget3 from "../../../../shared/widgets/Input/inputWidget3";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import { GlobalState } from "@/Context/page";
import axiosInstance from "@/app/utils/axiosMiddleware";
import AutoFillTextArea from "../../../../shared/widgets/Textarea/autoFillTextArea";
const widgets = {
  AutoFillTextArea: AutoFillTextArea,
};

const view_path = "gri-environment-emissions-standards_methodologies";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Q1: {
        type: "string",
        title: "Standards used",
      },
      Q2: {
        type: "string",
        title: "Methodologies used",
      },
      Q3: {
        type: "string",
        title: "Calculation tools used",
      },
    },
  },
};

const uiSchema = {
  items: {
    "ui:order": ["Q1", "Q2", "Q3"],

    Q1: {
      "ui:title": "Standards used",
      "ui:tooltipstitle":
        "Please select the consolidation approach considered by the organisation to calculate the greenhouse gas emissions according to the GHG Protocol",
      "ui:tooltipdisplay": "none",
      "ui:widget": "AutoFillTextArea",
      "ui:autoFillContent":
        "This report outlines the Greenhouse Gas (GHG) emissions accounting for the organization [Organization Name], following industry-leading standards. The methodologies and calculations adhere to the guidelines provided by the Greenhouse Gas Protocol, including both 'A Corporate Accounting and Reporting Standard (Revised Edition)' and the 'Corporate Value Chain (Scope 3) Standard,' developed by the World Business Council for Sustainable Development (WBCSD) and the World Resources Institute (WRI). These standards ensure a comprehensive and accurate assessment of the organization's GHG emissions across all relevant scopes and categories.",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Q2: {
      "ui:title": "Methodologies used",
      "ui:tooltipstitle":
        "Please select the consolidation approach considered by the organisation to calculate the greenhouse gas emissions according to the GHG Protocol",
      "ui:tooltipdisplay": "none",
      "ui:widget": "AutoFillTextArea",
      "ui:autoFillContent": `Data Collection and Monitoring Methodology\nEmission activity data is systematically collected from multiple data owners through the Sustainext platform. This platform centralizes the data, which is then meticulously reviewed to ensure completeness, accuracy, and the elimination of any duplication or human errors.\n\nQuantification Methodology\nThe quantification of GHG emissions begins with the identification of all relevant GHG emission sources within the organization. These sources are classified according to the GHG Protocol – Corporate Standard. Accurate activity data is then gathered, followed by the selection of emission factors from nationally or internationally recognized sources such as DEFRA, IPCC, GHG Protocol and National GHG Inventories. These emission factors are integral to the precise calculation of GHG emissions.\n\nCalculation Methodology\nUnderstanding the methodology for calculating greenhouse gas (GHG) emissions is essential for effectively tracking and mitigating our environmental impact. The calculation process involves the following key components:\n\nActivity Data: This refers to the measurable data associated with activities that lead to GHG emissions, such as the amount of fuel consumed, the kilowatt-hours (kWh) of electricity used, or the miles traveled by air.\n\nEmissions Factor: A coefficient used to convert activity data into the corresponding amount of GHG emissions. Emission factors are specific to each type of activity or emission source and are typically measured per unit of activity.\n\nCalculation Formula:\n\nEmissions = Activity Data × Emission Factor\nWhere:\n\nActivity Data is measured in units relevant to the activity (e.g., liters of fuel).\nEmission Factor is expressed in terms such as kilograms of CO₂ equivalent per unit of activity (e.g., kg CO₂e/Liter).\n\nExample Calculation:\n\nFuel Consumed: 100 Liters\nEmission Factor: 0.001557 kg CO₂e/Liter\nEmissions from Fuel Combustion: \n100×0.001557=0.1557 tCO₂e`,
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Q3: {
      "ui:title": "Calculation tools used",
      "ui:tooltipstitle":
        "Please select the consolidation approach considered by the organisation to calculate the greenhouse gas emissions according to the GHG Protocol",
      "ui:tooltipdisplay": "none",
      "ui:widget": "AutoFillTextArea",
      "ui:autoFillContent":
        "The calculation of GHG emissions in this report was performed using Sustainext’s SaaS-based platform. This tool is specifically designed to minimize errors and ensure the accuracy and reliability of sustainability metrics. The platform streamlines the GHG accounting process by allowing for the effortless creation of GHG inventories, accurate emission calculations, and ongoing performance tracking, all within a single, integrated system. Sustainext’s platform adheres to industry standards, including the GHG Protocol and ISO 14064, ensuring that the calculations are consistent with best practices and globally recognized methodologies.",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },

    "ui:options": {
      orderable: false,
      addable: false,
      removable: false,
      layout: "horizontal",
    },
  },
};

const Screen1 = ({ selectedOrg, year, selectedCorp, togglestatus }) => {
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);
  const { open } = GlobalState();
  const [validationErrors, setValidationErrors] = useState([]);

  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };

  const handleChange = (e) => {
    setFormData(e.formData);
  };

  const validateRows = (data) => {
    const errors = {};
    data.forEach((row) => {
      if (!row.Q1) {
        errors.Q1 = "This field is required";
      }
      if (!row.Q2) {
        errors.Q2 = "This field is required";
      }
      if (!row.Q3) {
        errors.Q3 = "This field is required";
      }
    });
    return errors;
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
  };

  const loadFormData = async () => {
    LoaderOpen();
    setFormData([{}]);
    const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&corporate=${selectedCorp}&organisation=${selectedOrg}&year=${year}`;
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
  if (selectedOrg && year && togglestatus) {
    if (togglestatus === "Corporate") {
      if (selectedCorp) {
        loadFormData();           // <-- Only load if a corporate is picked
      } else {
        setFormData([{}]); 
        setRemoteSchema({});
        setRemoteUiSchema({});       // <-- Clear the form if no corporate is picked
      }
    } else {
      loadFormData();             // Organization tab: always try to load
    }
    toastShown.current = false;
  } else {
    if (!toastShown.current) {
      toastShown.current = true;
    }
  }
}, [selectedOrg, year, selectedCorp, togglestatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateRows(formData);
    setValidationErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
      updateFormData();
    } else {
      console.log("validation error");
    }
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
          <div className="xl:mb-4 md:mb-4 2xl:mb-4 lg:mb-4 4k:mb-4 2k:mb-4 mb-6 block xl:flex lg:flex md:flex 2xl:flex 4k:flex 2k:flex">
          <div className="w-[100%] xl:w-[80%] lg:w-[80%] md:w-[80%] 2xl:w-[80%] 4k:w-[80%] 2k:w-[80%] relative mb-2 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
            <h2 className="flex mx-2 gap-6 text-[15px] text-neutral-950 font-[500]">
              Standards, methodologies and/or calculation tools used
              <MdInfoOutline
                data-tooltip-id={`es25`}
                data-tooltip-html="This section documents the data corresponding to the standards, methodologies, assumptions, and/or calculation tools used."
                className="text-[14px] mt-1"
              />
              <ReactTooltip
                id={`es25`}
                place="bottom"
                effect="solid"
                style={{
                  width: "290px",
                  backgroundColor: "#000",
                  color: "white",
                  fontSize: "12px",
                  boxShadow: 3,
                  borderRadius: "8px",
                  textAlign: "left",
                  zIndex: "100",
                }}
              ></ReactTooltip>
            </h2>
          </div>
          <div className="w-[100%] xl:w-[20%]  lg:w-[20%]  md:w-[20%]  2xl:w-[20%]  4k:w-[20%]  2k:w-[20%] mb-2 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0  ">
          <div className="flex xl:float-end lg:float-end md:float-end 2xl:float-end 4k:float-end 2k:float-end float-start gap-2 mb-1 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
          <div className="w-[70px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg justify-center items-center gap-2 inline-flex mb-1 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
                <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight">
                  GRI 305-1g
                </div>
              </div>
              <div className="w-[70px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg justify-center items-center gap-2 inline-flex mb-1 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
                <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight">
                  GRI 305-2g
                </div>
              </div>
              <div className="w-[70px] h-[26px] p-2 bg-sky-700 bg-opacity-5 rounded-lg justify-center items-center gap-2 inline-flex mb-1 xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
                <div className="text-sky-700 text-[10px] font-semibold font-['Manrope'] leading-[10px] tracking-tight">
                  GRI 305-3g
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-2 mb-2">
          <Form
            schema={r_schema}
            uiSchema={r_ui_schema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            widgets={widgets}
            formContext={{ validationErrors }}
          />
        </div>
        <div className="mt-4">
          <button
            type="button"
            className={`text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end ${
              (!selectedCorp && togglestatus === "Corporate") ||
              !selectedOrg ||
              !year
                ? "cursor-not-allowed opacity-90"
                : ""
            }`}
            onClick={handleSubmit}
            disabled={
              (togglestatus === "Corporate" && !selectedCorp) ||
              (togglestatus !== "Corporate" && (!selectedOrg || !year))
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

export default Screen1;
