import React, { useState, useEffect } from "react";
import { FiFile } from "react-icons/fi";
import ImageUpload from "../../../shared/components/ImageUpload";
import { useFileUpload } from "./useTaskManagement";

const EditTaskModal = ({ isOpen, onClose, onSubmit, task = {} }) => {
  const [formData, setFormData] = useState({
    taskName: "",
    status: "not_started",
    assignedOn: "",
    dueDate: "",
    description: "",
    comments: "",
    assigned_to: "",
    file: null,
  });

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const { uploadFile } = useFileUpload();

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.task_name || "",
        status: task.task_status || "not_started",
        description: task.description || "",
        assignedOn: new Date(task.created_at).toISOString().split("T")[0] || "",
        dueDate: task.deadline || "",
        comments: task.comments_assignee || "",
        file: task.file_data || null,
      });
    }
  }, [task]);

  if (!isOpen) return null;

const handleInputChange = (e) => {
  const { name, value } = e.target;

  let cleanValue = value;

  // Only sanitize non-date fields
  if (name !== "dueDate" &&  name !== "assignedOn") {
    cleanValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
  }
    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));


 
};

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
    setIsStatusDropdownOpen(false);
  };

  const handleFileUpload = async (file) => {
    try {
      const file_data = await uploadFile(file);
      console.log('file uploaded', file_data);
      
      setFormData(prev => ({
        ...prev,
        file: file_data
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setShowUpdateConfirm(false);
  };

  const handleUpdateClick = () => {
    setShowDeleteConfirm(false);
    setShowUpdateConfirm(true);
  };

  const handleAction = (action) => {
    if (action === 'delete') {
      onSubmit({ ...formData, action: 'delete' });
      // setShowDeleteConfirm(false);
    } else if (action === 'update') {
      onSubmit({ ...formData, action: 'update' });
      // setShowUpdateConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] max-h-[95vh] p-6 rounded-lg shadow-xl overflow-auto table-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Tasks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
              className="w-full p-2 border-b rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <hr className="my-6" />

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <button
                type="button"
                className="flex items-center w-full rounded-md py-2 text-left text-sm text-gray-700 bg-white focus:outline-none"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
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
                    {
                      id: "completed",
                      label: "Completed",
                      icon: (
                        <span className="w-4 h-4 rounded-full bg-[#12B76A]"></span>
                      ),
                    },
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

          {/* Dates */}
          <div className="">
            <div className="grid grid-cols-3 gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 pt-2">
                Assigned on
              </label>
              <input
                type="date"
                name="assignedOn"
                value={formData.assignedOn}
                onChange={handleInputChange}
                className="w-full p-2 border-b rounded-md focus:ring-2 focus:ring-blue-500"
                disabled
              />
              <div></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 pt-3">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border-b rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <div></div>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-3 gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="col-span-2 w-full p-2 border-b rounded-md focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
            <div></div>
          </div>

          <hr className="my-6" />

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Add details about the task..."
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none focus:outline-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <h5 className="text-sm my-3">Upload supporting documentation:</h5>
            <div className="relative text-black rounded-md flex items-center">
              {task.file_data?.url ? (
                <div className="flex items-center space-x-2 px-8 py-4 border border-gray-300 rounded-md w-full">
                  <FiFile className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-blue-500 truncate w-64">
                      {task.file_data.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {(task.file_data.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <ImageUpload onFileSelect={handleFileUpload} />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={handleDeleteClick}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete Task
              </button>
              <button
                onClick={handleUpdateClick}
                className="flex-1 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                Update
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="space-y-2">
                <p className="text-center text-sm text-gray-600">
                  Click on delete to proceed
                </p>
                <button
                  onClick={() => handleAction('delete')}
                  type="button"
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}

            {showUpdateConfirm && (
              <div className="space-y-2">
                <p className="text-center text-sm text-gray-600">
                  Click on update to proceed
                </p>
                <button
                  onClick={() => handleAction('update')}
                  type="button"
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
