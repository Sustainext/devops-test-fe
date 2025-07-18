"use client";
import React, { useState, useEffect } from "react";
import { MdInfoOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const InputField = React.memo(({ type, required, value, onChange,cellIndex }) => {
  const handleInputChange = (e) => {
    // Determine how to update based on the input type
    onChange(
      e.target.type === "checkbox" ? e.target.checked : e.target.value,
      type
    );
  };

  return (
    <input
      type={type}
      required={required && type === "text"}
      value={type === "checkbox" ? undefined : value}
      checked={type === "checkbox" ? value : undefined}
      onChange={handleInputChange}
      style={{ width: "100%" }}
      className={`text-[12px]  py-2  ${cellIndex === 4 ? 'border-b border-slate-500' : ''} `}
      placeholder={type === "text" ? "Enter data" : ""}
    />
  );
});

const CustomTableWidget4 = ({
  id,
  options,
  value,
  required,
  onChange,
  formContext,
}) => {
  // Use local state to manage input data to reduce prop drilling delays
  const [localData, setLocalData] = useState(value);

  // Update local state immediately on user change
  const updateField = (index, key, newValue) => {
    const newData = [...localData];
    newData[index][key] = newValue;
    setLocalData(newData); // Update local state immediately
  };

  // Push changes to the parent component's state only on blur or specific events
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localData);
    }, 500); // Delayed update to propagate changes upwards
    return () => clearTimeout(timer);
  }, [localData, onChange]);

  // Sync local data with external changes
  useEffect(() => {
    setLocalData(value);
  }, [value]);

  return (
    <div style={{ overflowY: "auto", maxHeight: "600px" }}>
      <table id={id} className="rounded-md  w-full ">
        <thead className="gradient-background h-[40px]">
          <tr>
            {options.titles.map((item, idx) => (
              <th
                key={idx}
                style={{
                  minWidth: "120px",
                  textAlign: item.title === "Benefits" ? "left" : "center",
                }}
                className="text-[12px] px-4 py-2"
              >
                <div
                  className={`flex items-center relative ${
                    item.title === "Benefits" ? "" : "justify-center"
                  }`}
                >
                  <p
                    style={{
                      textAlign: item.title === "Benefits" ? "left" : "center",
                    }}
                  >
                    {item.title}
                  </p>
                  <p>
                    <MdInfoOutline
                      data-tooltip-id={`tooltip-${item.title.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      data-tooltip-content={item.tooltip}
                      style={{ display: `${item.display}` }}
                      className="ml-2 cursor-pointer"
                    />
                    <ReactTooltip
                      id={`tooltip-${item.title.replace(/\s+/g, "-")}`}
                      place="top"
                      effect="solid"
                      style={{
                        width:"400px",
                        backgroundColor: "#000",
                        color: "white",
                        fontSize: "12px",
                        boxShadow: 3,
                        borderRadius: "8px",
                        zIndex:"1000",
                      }}
                    />
                  </p>
                </div>
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localData.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(item).map((key, cellIndex) => (
                <td
                  key={cellIndex}
                  className=" p-3 w-[20%]"
                >
                  <InputField
                    type={options.types[key] === "string" ? "text" : "checkbox"}
                    required={required}
                    cellIndex={cellIndex} 
                    value={item[key]}
                    onChange={(newValue) =>
                      updateField(rowIndex, key, newValue)
                    }
                  />
                </td>
              ))}
              <td className="p-3">
                <button onClick={() => formContext.onRemove(rowIndex)}>
                  <MdOutlineDeleteOutline className="text-[23px] text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTableWidget4;
