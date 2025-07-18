import axiosInstance, { post } from "@/app/utils/axiosMiddleware";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useEmissions } from "@/app/dashboard/environment/Emissions/EmissionsContext";

const monthMapping = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const AssignToWidgetEmission = ({ id, scope, location, year, month, data, countryCode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const { scope1Data, scope2Data, scope3Data } = useEmissions();
  const monthStr = monthMapping[month - 1];

  const getScopeData = scope => {
    switch (scope) {
      case 'scope1': return scope1Data;
      case 'scope2': return scope2Data;
      case 'scope3': return scope3Data;
      default: return [];
    }
  };

  const rowData = useMemo(() => getScopeData(scope).find(item => item.id === parseInt(id.split('_')[1], 10)), [id, scope, scope1Data, scope2Data, scope3Data]);

  const openModal = () => setModalOpen(true);
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser('');
    setDueDate('');
    setErrors({});
  };

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axiosInstance.get('/sustainapp/user_client/');
        setUsersList(response.data);
      } catch (error) {
        console.error('Error fetching user list:', error);
        setUsersList([]);
      }
    };
    fetchUserList();
  }, []);

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
    setErrors(prev => ({ ...prev, dueDate: null }));
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setErrors(prev => ({ ...prev, user: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedUser) newErrors.user = "User is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sendData = {
      location,
      year,
      subcategory: rowData?.Subcategory,
      activity: rowData?.Activity,
      task_name: rowData?.Activity ? `${location}-${monthStr}-${rowData.Activity}` : `${location}-${monthStr}-${rowData.Subcategory}`,
      scope,
      month: monthStr,
      roles: 1,
      deadline: dueDate,
      assigned_by: parseInt(localStorage.getItem("user_id")),
      assigned_to: parseInt(selectedUser),
      user_client: 1,
      category: rowData?.Category,
      factor_id: rowData?.activity_id,
      region: countryCode,
    };

    try {
      const response = await post(`/organization_task_dashboard/`, sendData);
      if (response.status === 201) {
        toast.success("Task assigned successfully");
        closeModal();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      toast.error("Oops, something went wrong");
      closeModal();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center mt-2">
        <button
          className="text-center py-1 text-sm w-[100px] bg-[rgb(2,132,199)] text-white rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={openModal}
        >
          Assign To
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content relative bg-white rounded-md px-5 pt-5 pb-5 overflow-auto h-auto important-width">
            <div>
              <div className="mb-5">
                <h5 className="text-left text-sm">Assign user</h5>
                <p className="text-left text-sm text-gray-500">
                  Assign a user and select a due date.
                </p>
              </div>
              <div className="px-4 pt-4">
                <div className="flex justify-between">
                  <div className="mb-5 w-[13rem]">
                    <h5 className="text-left text-sm">Location</h5>
                    <p className="text-left text-sm text-gray-500">{location}</p>
                  </div>
                  <div className="mb-5 w-[5rem]">
                    <h5 className="text-left text-sm">Year</h5>
                    <p className="text-left text-sm text-gray-500">{year}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="mb-5 w-[13rem]">
                    <h5 className="text-left text-sm">Month</h5>
                    <p className="text-left text-sm text-gray-500">{monthStr}</p>
                  </div>
                  <div className="mb-5 w-[5rem]">
                    <h5 className="text-left text-sm">Scope</h5>
                    <p className="text-left text-sm text-gray-500">{scope}</p>
                  </div>
                </div>
                <div className="mb-5">
                  <h5 className="text-left text-sm">Subcategory</h5>
                  <p className="text-left text-sm text-gray-500">{rowData?.Subcategory}</p>
                </div>
                <div className="mb-5">
                  <h5 className="text-left text-sm">Activity</h5>
                  <p className="text-left text-sm text-gray-500">{rowData?.Activity || 'No activity selected'}</p>
                </div>
                <div className="mb-5">
                  <div className="mr-2">
                    <label htmlFor="user" className="block text-neutral-800 text-[13px] font-normal text-left">
                      Assign User
                    </label>
                    <div className="mt-2">
                      <select
                        className="block w-full rounded-md border-0 py-2 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        name="user"
                        value={selectedUser}
                        onChange={handleUserChange}
                      >
                        <option value="">--- Select user ---</option>
                        {usersList.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                      {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user}</p>}
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="mr-2">
                    <label htmlFor="due-date" className="block text-neutral-800 text-[13px] font-normal text-left">
                      Due Date
                    </label>
                    <div className="mt-2">
                      <input
                        id="due-date"
                        name="due-date"
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateChange}
                        placeholder="Due date"
                        className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="bg-white border border-gray-300 text-black py-1 rounded-md shadow-sm w-full text-center text-md"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#007EEF] border border-[#007EEF] text-white py-1 rounded-md shadow-sm w-full text-center text-md"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Assign
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

export default AssignToWidgetEmission;
