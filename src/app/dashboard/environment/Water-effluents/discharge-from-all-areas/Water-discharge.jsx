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
import SelectWidgetWaternew from "../../../../shared/widgets/Select/selectWidgetWaternew";
import WaterinputWidget from "../../../../shared/widgets/Input/WaterinputWidget";
import SelectWidgetuit from "../../../../shared/widgets/Select/selectWidgetuit";
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
  SelectWidgetWaternew: SelectWidgetWaternew,
  WaterinputWidget: WaterinputWidget,
  SelectWidgetUit: SelectWidgetuit,
};

const view_path = "gri-environment-water-303-4a-third_party";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Discharge: {
        type: "string",
        title:
          "Do you discharge third-party water and send it to use for other organizations?",
        enum: ["Yes", "No"],
        tooltiptext:
          "Third party water is defined as: municipal water suppliers and municipal wastewater treatment plants, public or private utilities, and other organizations involved in the provision, transport, treatment, disposal, or use of water and effluent if you discharge third-party water and it is sent to use for other organizations, then please provide the volume of the total water sent for use to other organizations",
      },

      Volume: {
        type: "string",
        title: "Volume of water",
        tooltiptext:
          "Indicate the amount of water sent for use to other organisation",
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
          "Select the correct unit corresponding to the quantity of water discharge.",
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
    },
  },
};

const uiSchema = {
  items: {
    classNames: "fieldset",
    "ui:order": [
      "Discharge",
      "Volume",
      "Unit",
      "AssignTo",
      "FileUpload",
      "Remove",
    ],
    Discharge: {
      "ui:widget": "SelectWidgetWaternew",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Volume: {
      "ui:widget": "WaterinputWidget",
      "ui:options": {
        label: false,
      },
    },
    Unit: {
      "ui:widget": "SelectWidgetUit",
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
      rowErrors.Discharge = "Discharge third-party water is required";
    }

    if (row.Discharge === "Yes") {
      if (!row.Volume) {
        rowErrors.Volume = "Volume of water is required";
      }
      if (!row.Unit) {
        rowErrors.Unit = "Unit is required";
      }
    }

    return rowErrors;
  });
};


const Waterdischarge = ({ location, year, month }) => {
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
      setEnabledRows(initialEnabledRows); // This will ensure the rows are enabled or disabled based on the Discharge value
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      LoaderClose();
    }
  };
  useEffect(() => {
    if (location && year && month) {
      loadFormData();
      toastShown.current = false; // Reset the flag when valid data is present
    } else {
      // Only show the toast if it has not been shown already
      if (!toastShown.current) {
        toastShown.current = true; // Set the flag to true after showing the toast
      }
    }
  }, [location, year, month]);
  const handleChange = (e) => {
    const newData = e.formData.map((item, index) => {
      const updatedItem = { ...item }; // Create a copy to avoid directly mutating state

      if (updatedItem.Discharge === "Yes") {
        setEnabledRows((prev) => {
          const newEnabledRows = [...prev];
          newEnabledRows[index] = true; // Enable the row
          return newEnabledRows;
        });
      } else if (updatedItem.Discharge === "No") {
        setEnabledRows((prev) => {
          const newEnabledRows = [...prev];
          newEnabledRows[index] = false; // Disable the row
          return newEnabledRows;
        });
        updatedItem.Volume = ""; // Reset values if necessary
        updatedItem.Unit = "";
      }
      return updatedItem;
    });
    setFormData(newData); // Update the formData with new values
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
    setEnabledRows((prev) => [...prev, false]); // Add a new disabled row state
  };

  const updateFormDatanew = (updatedData) => {
    setFormData(updatedData);
  };

  const handleRemove = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
    setEnabledRows((prev) => prev.filter((_, i) => i !== index)); // Remove the state of the deleted row
  };
  useEffect(() => {
    console.log("Enabled rows updated", enabledRows);
    // Add logic to handle changes to enabledRows
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
              SelectWidgetUit: (props) => {
                const match = props.id.match(/^root_(\d+)/);
                const index = match ? parseInt(match[1], 10) : null;
                const isEnabled = index !== null ? enabledRows[index] : false; // Get the enable state for the row
                return (
                  <SelectWidgetuit
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
                  scopes="wec2"
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

export default Waterdischarge;
