"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { GlobalState } from "../../../../../Context/page";
import dateWidget from "../../../../shared/widgets/Input/dateWidget";
import selectWidget from "../../../../shared/widgets/Select/selectWidget";
import inputWidget from "../../../../shared/widgets/Input/inputWidget";
import CustomFileUploadWidget from "../../../../shared/widgets/CustomFileUploadWidget";
import AssignToWidget from "../../../../shared/widgets/assignToWidget";
import CustomSelectInputWidget from "../../../../shared/widgets/CustomSelectInputWidget";
import RemoveWidget from "../../../../shared/widgets/RemoveWidget";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import selectWidget3 from "../../../../shared/widgets/Select/selectWidget3";
import inputnumberWidget from "../../../../shared/widgets/Input/inputnumberWidget";
import axiosInstance from "../../../../utils/axiosMiddleware";
import WaterinputWidget from "../../../../shared/widgets/Input/WaterinputWidget";
import SelectdisableWidget from "../../../../shared/widgets/Select/selectdisableWidget";
const widgets = {
  inputWidget: inputWidget,
  dateWidget: dateWidget,
  selectWidget: selectWidget,
  FileUploadWidget: CustomFileUploadWidget,
  AssignTobutton: AssignToWidget,
  CustomSelectInputWidget: CustomSelectInputWidget,
  RemoveWidget: RemoveWidget,
  selectWidget3: selectWidget3,
  inputnumberWidget: inputnumberWidget,
  WaterinputWidget: WaterinputWidget,
  SelectdisableWidget: SelectdisableWidget,
};
const view_path =
  "gri-environment-water-303-3b-water_withdrawal_areas_water_stress";
const client_id = 1;
const user_id = 1;
const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Discharge: {
        type: "string",
        title: "Do you withdraw water from third-parties?",
        enum: ["Yes", "No"],
        tooltiptext:
          "Do you withdraw water from third parties? if yes then please provide a breakdown of the total third party-water withdrawn by the withdrawal sources. Third-party water: municipal water suppliers and municipal wastewater treatment plants, public or private utilities, and other organizations involved in the provision, transport, treatment, disposal, or use of water and effluent",
      },
      Source: {
        type: "string",
        title: "Source",
        enum: [
          "Surface Water",
          "Ground water",
          "Sea water",
          "Municipal water",
          "Third party water",
          "Other (please specify)",
        ],
        tooltiptext:
          "Indicate where does the third-party withdraw water from? ",
      },
      Quantity: {
        type: "string",
        title: "Quantity",
        tooltiptext:
          "Please specify the amount of water withdrawal from third-parties",
      },
      Unit: {
        type: "string",
        title: "Unit",
        enum: [
          "Litre",
          "Megalitre",
          "Cubic meter",
          "Kilolitre",
          "Million litres  per day",
        ],
        tooltiptext:
          "Select the correct unit corresponding to the quantity of water withdrawal/discharge.",
      },

      AssignTo: {
        type: "string",
        title: "Assign To",
      },
      FileUpload: {
        type: "string",
        format: "data-url",
        title: "File Upload",
      },
      Remove: {
        type: "string",
        title: "Remove",
      },
      // Define other properties as needed
    },
  },
};

const uiSchema = {
  items: {
    classNames: "fieldset",
    "ui:order": [
      "Discharge",
      "Source",
      "Quantity",
      "Unit",
      "AssignTo",
      "FileUpload",
      "Remove",
    ],
    Discharge: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Source: {
      "ui:widget": "SelectdisableWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Quantity: {
      "ui:widget": "WaterinputWidget",
      "ui:options": {
        label: false,
      },
    },
    Unit: {
      "ui:widget": "selectWidget3",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },

    AssignTo: {
      "ui:widget": "AssignTobutton",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    FileUpload: {
      "ui:widget": "FileUploadWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Remove: {
      "ui:widget": "RemoveWidget",
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
const validateRows = (data) => {
  return data.map((row) => {
    const rowErrors = {};

    if (!row.Discharge) {
      rowErrors.Discharge = "Please select Yes or No.";
    }
    if (!row.Unit) {
      rowErrors.Unit = "Unit  is required";
    }
    if (row.Discharge === "Yes") {
      if (!row.Source) {
        rowErrors.Source = "Source is required";
      }
      if (!row.Quantity) {
        rowErrors.Quantity = "Quantity is required";
      }
    }

    return rowErrors;
  });
};
const WaterstressQ2 = ({ location, year, month }) => {
  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [enabledRows, setEnabledRows] = useState([]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);
  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };

  const updateFormData = async () => {
    LoaderOpen();
    const data = {
      client_id: client_id,
      user_id: user_id,
      path: view_path,
      form_data: formData,
      location,
      year,
      month,
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
    const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&location=${location}&year=${year}&month=${month}`;
    try {
      const response = await axiosInstance.get(url);
      console.log("API called successfully:", response.data);
      setRemoteSchema(response.data.form[0].schema);
      setRemoteUiSchema(response.data.form[0].ui_schema);
      const form_parent = response.data.form_data;
      setFormData(form_parent[0].data);
      const initialEnabledRows = form_parent[0].data.map(
        (item) => item.Discharge === "Yes"
      );
      setEnabledRows(initialEnabledRows);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      LoaderClose();
    }
  };
  useEffect(() => {
    if (location && year && month) {
      loadFormData();
      toastShown.current = false; 
    } else {
     
      if (!toastShown.current) {
        toastShown.current = true; 
      }
    }
  }, [location, year, month]); 
  const handleChange = (e) => {
    const newData = e.formData.map((item, index) => {
      const updatedItem = { ...item }; 

      if (updatedItem.Discharge === "Yes") {
        setEnabledRows((prev) => {
          const newEnabledRows = [...prev];
          newEnabledRows[index] = true; 
          return newEnabledRows;
        });
      } else if (updatedItem.Discharge === "No") {
        setEnabledRows((prev) => {
          const newEnabledRows = [...prev];
          newEnabledRows[index] = false; 
          return newEnabledRows;
        });
        updatedItem.Source = ""; 
        updatedItem.Quantity = "";
        updatedItem.otherValue = ""; 
      }
      return updatedItem;
    });
    setFormData(newData); 
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Debugging log
    const errors = validateRows(formData);
    setValidationErrors(errors);
    console.log("Validation Errors:", errors); // Debugging log
  
    const hasErrors = errors.some(rowErrors => Object.keys(rowErrors).length > 0);
    if (!hasErrors) {
      console.log("No validation errors, proceeding to update data"); // Debugging log
      updateFormData();
    } else {
      console.log("Validation errors found, submission aborted"); // Debugging log
    }
  };

  const handleAddNew = () => {
    const newData = [...formData, {}];
    setFormData(newData);
    setEnabledRows((prev) => [...prev, false]); 
  };

  const updateFormDatanew = (updatedData) => {
    setFormData(updatedData);
  };

  const handleRemove = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
    setEnabledRows((prev) => prev.filter((_, i) => i !== index)); 
  };
  useEffect(() => {
    console.log("Enabled rows updated test", enabledRows);
  }, [enabledRows]);

  return (
    <>
      <div className={`overflow-auto custom-scrollbar flex py-4`}>
        <div>
          <Form
            className="flex"
            schema={r_schema}
            uiSchema={r_ui_schema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            formContext={{ enabledRows,validationErrors }}
            widgets={{
              ...widgets,
              SelectdisableWidget: (props) => {
                const match = props.id.match(/^root_(\d+)/);
                const index = match ? parseInt(match[1], 10) : null;
                const isEnabled = index !== null ? enabledRows[index] : false; // Get the enable state for the row
                return (
                  <SelectdisableWidget
                    {...props}
                    isEnabled={isEnabled} // Pass it as a prop if needed
                  />
                );
              },
              WaterinputWidget: (props) => {
                const match = props.id.match(/^root_(\d+)/);
                const index = match ? parseInt(match[1], 10) : null;
                const isEnabled = index !== null ? enabledRows[index] : false; // Get the enable state for the row
                return (
                  <WaterinputWidget
                    {...props}
                    isEnabled={isEnabled} // Pass it as a prop if needed
                  />
                );
              },
              RemoveWidget: (props) => {
                const match = props.id.match(/^root_(\d+)/);
                const index = match ? parseInt(match[1], 10) : null;

                return (
                  <RemoveWidget
                    {...props}
                    index={index}
                    onRemove={handleRemove}
                  />
                );
              },
              FileUploadWidget: (props) => (
                <CustomFileUploadWidget
                  {...props}
                  scopes="ec2"
                  setFormData={updateFormDatanew}
                />
              ),
            }}
          ></Form>
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
      </div>
      <div></div>

      <div className="flex justify-start mt-4 right-1">
        <button
          type="button"
          className="text-[#007EEF] text-[12px] flex cursor-pointer mt-5 mb-5"
          onClick={handleAddNew}
        >
          <MdAdd className="text-lg" /> Add Row
        </button>
      </div>
      <div className="mb-4">
        <button
          type="button"
          className=" text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};
export default WaterstressQ2;
