'use client';
import { useState } from "react";

// Dynamic Table Component
const ScopeTable = ({ title, columns,data }) => {

  return (
    <div>
      <div
        style={{
          display: "block",
          overflowX: "auto",
          maxWidth: "100%",
          minWidth: "100%",
          width: "40vw",
          maxHeight: "450px",
        }}
        className="mb-2 rounded-md table-scrollbar"
      >
        <table className="w-full border border-gray-200 rounded-md">
          <thead className="gradient-background">
          <tr className="text-[12px] border border-gray-200">
            {/* <th colSpan={7} className="p-4 text-start text-gray-500">
              {title}
            </th> */}
          </tr>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-[12px] border-r px-4 py-4 text-gray-500 text-left border-b"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length>0?(
              data.map((val)=>(
                <tr className="text-[13px]">
    {/* Display Category */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
      {val.category?val.category:"No data available"}
    </td>

    {/* Display Subcategory */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {val.subcategory?val.subcategory:"No data available"}
    </td>

    {/* Display Activity */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {val.activity?val.activity:"No data available"}
    </td>

    {/* Display Quantity */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {val.emission?val.emission:"No data available"}
    </td>
  </tr>
              ))
            ):(
              <tr className="text-[13px]">
    {/* Display Category */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
      {"No data available"}
    </td>

    {/* Display Subcategory */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {"No data available"}
    </td>

    {/* Display Activity */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {"No data available"}
    </td>

    {/* Display Quantity */}
    <td className="border-t border-r border-gray-200 p-4 text-left">
    {"No data available"}
    </td>
  </tr>
            )}
  
</tbody>

        </table>
      </div>
    </div>
  );
};



export default ScopeTable;
