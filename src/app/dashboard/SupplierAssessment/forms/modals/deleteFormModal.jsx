"use client";
import React, { useState } from "react";
import { MdOutlineEdit, MdOutlineDeleteOutline } from "react-icons/md";
// import axiosInstance from "../../../utils/axiosMiddleware";
import {  toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";

const DeleteModal = ({ setRefresh,refresh,isModalOpen, setIsModalOpen,deleteData }) => {

//   const handleDelete= async(id)=>{
   
//     const url = `${process.env.BACKEND_API_URL}/materiality_dashboard/materiality-assessments/${id}/`;
//     try {
//       const response = await axiosInstance.delete(url);
//       if(response.status===204){
//         toast.success(
//           <div style={{ display: 'flex', alignItems: 'flex-start' }}>
//             <RiDeleteBin6Line style={{ marginRight: '10px', color: '#EB9042',fontSize:'37px' }} />
//             <div>
//             <strong style={{ display: 'block', marginBottom: '4px', fontSize: '16px' }}> {/* Main heading */}
//           Materiality Assessment Deleted
//          </strong>
//          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}> {/* Paragraph aligned below heading */}
//            Materiality Assessment has been successfully deleted. Changes are made in the platform.
//          </p>
//           </div>
//           </div>, {
//             position: "top-right",
//             autoClose: 3000, 
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light", 
//             style: {
//               borderRadius: '8px', 
//               border: '1px solid #E5E5E5', 
//               boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//               width:'371px',
//             },
//             icon: false, 
//         });

//         setRefresh((prevRefresh) => !prevRefresh);
//         setIsModalOpen(false);
        
//       }
//       else{
//         toast.error("Oops, something went wrong", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       }
      
//     }
//     catch (error) {
//       toast.error("Oops, something went wrong", {
//         position: "top-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       });
//     }
//   }
   
  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay z-50">
          <div className="modal-center">
            <div className="modal-content-custom">
              <div className="flex justify-between items-center drop-shadow-lg pt-3 w-full px-3">
                <div className="flex">
                  <MdOutlineDeleteOutline className="w-7 h-7 mr-2 text-red-400" />
                  <h2 className="self-stretch text-black text-[18px] font-bold">
                    <span>Delete Form A</span>
                  </h2>
                </div>

              </div>

              <div className="mb-2 p-4">
                <p className="text-[14px] text-[#667085] font-[400]">
                  <span className="text-[14px] text-[#C62828] mr-1">Warning!</span>
                  This process will delete the entire form with its contents and cannot be retrieved.
                </p>
               
              </div>

              <div className="border-t border-b border-gray-200 p-4 mb-2">
                <div className="p-1 mb-2">
                    <span className="text-[#344054] text-[14px] font-semibold">
                        Organization:
                    </span>
                    <span className="text-[#667085] text-[14px] ml-3">
                        {/* {deleteData.organization} */}
                        HBK Test
                    </span>
                </div>
                <div className="p-1 mb-2">
                    <span className="text-[#344054] text-[14px] font-semibold">
                    Created by:
                    </span>
                    <span className="text-[#667085] text-[14px] ml-3">
                       {/* {deleteData.corporate} */}
                       Test
                    </span>
                </div>
                <div className="p-1 mb-2">
                    <span className="text-[#344054] text-[14px] font-semibold">
                    Created on:
                    </span>
                    <span className="text-[#667085] text-[14px] ml-3">
                    {/* {deleteData.type} */}
                    24/05/25
                    </span>
                </div>
                <div className="p-1 mb-2">
                    <span className="text-[#344054] text-[14px] font-semibold">
                    Usage:
                    </span>
                    <span className="text-[#667085] text-[14px] ml-3">
                    {/* {deleteData.period} */}
                    5
                    </span>
                </div>
              </div>
              <div className="p-4">
                  <p className="text-[14px] text-[#667085] font-[400]">
                  Are you sure you want to delete this form?
                  </p>
                  <div className="flex justify-between mt-5">
                  <button
                  className="w-full h-full mr-2 py-2 px-3 border border-gray-200 text-gray-500 rounded-[8px] shadow cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-full mr-2 py-2 px-3 bg-[#EF5350] text-white rounded-[8px] shadow cursor-pointer"
                //   onClick={()=>{handleDelete(deleteData.id)}}
                >
                  Yes, Delete
                </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
