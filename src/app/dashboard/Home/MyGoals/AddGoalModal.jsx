// AddGoalModal.jsx
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance, { post } from "../../../utils/axiosMiddleware";

const AddGoalModal = ({ isOpen, onClose, onSubmit }) => {
  const [addgoles, setAddGoals] = useState({
    task_name: "",
    deadline: "",
  });

  const { task_name, deadline } = addgoles;

  const getTodayDate = () => {
    const today = new Date();
    let month = "" + (today.getMonth() + 1);
    let day = "" + today.getDate();
    const year = today.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  // const datahandleChange = (e) => {
  //   setAddGoals({ ...addgoles, [e.target.name]: e.target.value });
  // };

  const datahandleChange = (e) => {
  const { name, value } = e.target;

  let cleanValue = value;

  // Sanitize input for text fields only
  if (name !== "deadline" && name !== "date") {
    cleanValue = value.replace(/[^a-zA-Z0-9\s]/g, ""); // Only letters, numbers, spaces
  }

  setAddGoals({ ...addgoles, [e.target.name]: cleanValue });
};
  const LoaderOpen = () => {
    // Open loader
  };

  const LoaderClose = () => {
    // Close loader
  };

  const fetchMytaskDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.BACKEND_API_URL}/organization_task_dashboard/`
      );
      // Update tasks in the parent component
      onSubmit(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    LoaderOpen();

    const sandData = {
      ...addgoles,
      assigned_to: parseInt(localStorage.getItem("user_id")),
      assigned_by: parseInt(localStorage.getItem("user_id")),
      user_client: 1,
      roles: 3,
    };

    await post(`/organization_task_dashboard/`, sandData)
      .then((response) => {
        if (response.status == "201") {
          toast.success("Task has been added successfully", {
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
          onClose();
          fetchMytaskDetails();
          setAddGoals({});
        } else {
          toast.error("Error", {
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
      })
      .catch((error) => {
        const errorMessage = "Oops, something went wrong";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        LoaderClose();
        onClose();
        fetchMytaskDetails();
        setAddGoals({});
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-50">
      <div className="modal-center">
        <div className="modal-content">
          <div className="flex justify-between items-center drop-shadow-lg border-b-2 py-6 w-full">
            <h2 className="self-stretch text-black text-opacity-90 text-[22px] font-normal leading-relaxed flex space-x-8 items-center ms-6">
              <span>Add task</span>
            </h2>
            <button
              className="absolute top-2 right-2 mt-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="my-6 mx-8 ">
            <div className="mb-2 py-4 px-3">
              <form className="w-full text-left" onSubmit={submitForm}>
                <div className="mr-2 mb-4 w-[101%]">
                  <label
                    htmlFor="cname"
                    className="block text-neutral-800 text-[13px] font-normal"
                  >
                    Task name
                  </label>
                  <div className="mt-2 mr-2">
                    <input
                      id="title"
                      title="title"
                      type="text"
                      name="task_name"
                      autoComplete="off"
                      required
                      placeholder="Enter Task Title"
                      onChange={datahandleChange}
                      value={task_name}
                      className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="flex ">
                  <div className="col-span-2 mb-4 flex-1">
                    <div>
                      <label
                        htmlFor="dateField"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Deadline
                      </label>
                      <div className="mt-2 ">
                        <input
                          id="deadline"
                          title="deadline"
                          type="date"
                          name="deadline"
                          autoComplete="off"
                          onChange={datahandleChange}
                          value={deadline}
                          min={getTodayDate()}
                          required
                          className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  <input
                    type="submit"
                    value="Save"
                    className="w-[30%] h-auto px-[22px] py-2 bg-blue-500 text-white rounded shadow flex-col justify-center items-center inline-flex cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoalModal;
