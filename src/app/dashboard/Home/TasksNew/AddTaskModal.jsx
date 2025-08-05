import React, { useState, useEffect } from "react";
import { getTodayDate } from "./TaskUtils";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTaskModal = ({ isOpen, onClose, onSubmit, users }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_name: "",
    description: "",
    deadline: "",
    assigned_to: "",
    status: "not_started",
  });
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("user_id");

    // Check if email exists in localStorage
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const isFormValid = formData.task_name && formData.deadline;

  if (!isOpen) return null;

  const handleStatusChange = (status) => {
    setFormData({ ...formData, status });
    setIsStatusDropdownOpen(false);
  };

 const handleFormChange = (e) => {
  const { name, value } = e.target;

  let cleanValue = value;

  // Only sanitize non-date fields
  if (name !== "deadline") {
    cleanValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  setFormData({
    ...formData,
    [name]: cleanValue,
  });

  setIsStatusDropdownOpen(false);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit function triggered");

    if (!isFormValid) {
      console.log("Form validation failed");
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const submissionData = {
        task_name: formData.task_name.trim(),
        assigned_to: parseInt(formData.assigned_to),
        deadline: formData.deadline,
        description: formData.description?.trim(),
        assigned_by: parseInt(localStorage.getItem("user_id")),
        user_client: 1,
        roles: 3,
        task_status: formData.status,
      };
      console.log("Submission data:", submissionData);

      // Call the onSubmit function with the correct structure
      const response = await onSubmit(null, "create", submissionData);
      console.log("Submit response:", response);

      if (response) {
        onClose();
        setFormData({
          task_name: "",
          description: "",
          deadline: "",
          assigned_to: "",
          status: "not_started",
        });
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to add task", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const isFieldDisabled = () => {
    console.log("comparing", formData.assigned_to, userEmail);

    if (formData.assigned_to === userEmail) return false;
    else if (formData.assigned_to !== ""){
      // setIsStatusDropdownOpen(false);
      return true;
    } 
    else return false;
  };

  return (
    <>
    {/* <ToastContainer style={{ fontSize: "12px" }} /> */}
    <div className="modal-overlay z-50">
      <div className="modal-center">
<div className="modal-content bg-white rounded-lg shadow-xl p-6 min-w-[450px] max-w-[450px] min-h-[20em] max-h-[45em] relative overflow-y-auto scrollable-content ">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Task</h2>
          <p className="text-gray-600 text-sm mb-6">
            Add tasks with descriptions and deadlines to keep your goals on
            track.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Dropdown */}
            <div className={`${isFieldDisabled() ? "opacity-70" : ""}`}>
              <label className={`block text-sm font-medium text-gray-700 mb-1`}>
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center w-full rounded-md py-2 text-left text-sm text-gray-700 bg-white focus:outline-none"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  disabled={isFieldDisabled()}
                >
                  <div className="flex items-center gap-2">
                    {formData.status === "not_started" && (
                      <span className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></span>
                    )}
                    {formData.status === "in_progress" && (
                      <span className="w-4 h-4 rounded-full bg-[#FDB022]"></span>
                    )}
                    {formData.status === "completed" && (
                      <span className="w-4 h-4 rounded-full bg-[#12B76A]"></span>
                    )}
                    <span>
                      {formData.status === "not_started" && "Not Started"}
                      {formData.status === "in_progress" && "In Progress"}
                      {formData.status === "completed" && "Completed"}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1">
                    {[
                      {
                        id: "not_started",
                        label: "Not Started",
                        icon: (
                          <span className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></span>
                        ),
                      },
                      {
                        id: "in_progress",
                        label: "In Progress",
                        icon: (
                          <span className="w-4 h-4 rounded-full bg-[#FDB022]"></span>
                        ),
                      },
                      ...(formData.assigned_to !== userEmail
                        ? [
                            {
                              id: "completed",
                              label: "Completed",
                              icon: (
                                <span className="w-4 h-4 rounded-full bg-[#12B76A]"></span>
                              ),
                            },
                          ]
                        : []),
                    ].map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => handleStatusChange(status.id)}
                      >
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select 'completed' status to move the task to completed section
              </p>
            </div>

            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                type="text"
                name="task_name"
                placeholder="Enter task name"
                required
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs outline-none"
                value={formData.task_name}
                onChange={handleFormChange}
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Add details about the task..."
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs outline-none"
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="deadline"
                required
                min={getTodayDate()}
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs outline-none"
                value={formData.deadline}
                onChange={handleFormChange}
              />
            </div>

            {/* Assign To Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs outline-none"
              >
                <option value="">Select User</option>
                {users?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username === userEmail
                      ? "Assign to self"
                      : user.username}
                    {/* {user.username} */}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 px-4 py-2.5 text-white rounded-md ${
                  !isFormValid
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-[#007eef] hover:bg-blue-600"
                }`}
              >
                Add Task
              </button>
            </div>
          </form>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddTaskModal;
