'use client'
import { useState, useRef, useEffect } from "react";


const SustainabilityJourneyTable=({tableData})=>{

    const col=[
        "Suppliers",
        "Location of Supplier",
        "Significant actual and potential negative social impacts.",
    ]
    return (
        <>
       <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mb-2">
    <table className="w-full border border-gray-200 rounded-md overflow-hidden">
        <thead className="gradient-background">
            <tr>
                {col.map((item, idx) => (
                    <th
                        key={idx}
                        style={{ minWidth: "120px", textAlign: "left" }}
                        className={`text-[12px] border-r px-4 py-4 ${
                            idx === 0 ? 'rounded-tl-md' : '' // Top-left corner
                        } ${
                            idx === col.length - 1 ? 'rounded-tr-md' : '' // Top-right corner
                        } text-gray-500`}
                    >
                        <div className="flex">
                            <p className="flex">
                                {item}
                            </p>
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
  {tableData.length>0?tableData.map((item, index) => (
    <tr className="text-[13px]" key={index}>
      <td className="border-t border-r border-gray-200 p-4 text-left">{item.Suppliers}</td>
      <td className="border border-gray-200 p-4 text-left">{item.Locationofsupplier}</td>
      <td className="border border-gray-200 p-4 text-left">{item.Significantsocialimpacts}</td>
    </tr>
  )):(
    <tr className="text-[13px]">
      <td className="border-t border-r border-gray-200 p-4 text-left">No data available</td>
      <td className="border border-gray-200 p-4 text-left">No data available</td>
      <td className="border border-gray-200 p-4 text-left">No data available</td>
    </tr>
  )
}
</tbody>

    </table>
</div>

        </>
    )
}
export default SustainabilityJourneyTable