//emission widget

"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { scope1Info, scope2Info, scope3Info } from "../data/scopeInfo";
import { unitTypes } from "../data/units";
import { LuTrash2 } from "react-icons/lu";
import { TbUpload } from "react-icons/tb";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import { BlobServiceClient } from "@azure/storage-blob";
import { MdClose, MdOutlineRemoveRedEye } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { BsFiletypePdf, BsFileEarmarkImage } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  setSelectedRows,
  updateSelectedRow,
  toggleSelectAll,
  setFocusedField,
  clearFocusedField,
  setActivitiesForRow,
  addActiveRequest,
  removeActiveRequest,
} from "@/lib/redux/features/emissionSlice";
import { useDispatch, useSelector } from "react-redux";
import AssignEmissionModal from "./assignEmissionModal";
import MultipleAssignEmissionModal from "./MultipleAssignEmissionModal";
import { getMonthName } from "@/app/utils/dateUtils";
// import { fetchClimatiqActivities } from "../../utils/climatiqApi.js";
import { getActivities } from "../../utils/activitiesService";
import { fetchAutopilotSuggestions } from "@/app/utils/climatiqAutopilotApi";
import CalculationInfoModal from "@/app/shared/components/CalculationInfoModal";

const EmissionWidget = React.memo(
  ({
    value = {},
    onChange,
    scope,
    year,
    countryCode,
    // activityCache,
    updateCache,
    onRemove,
    index,
    id,
    formRef,
  }) => {

    const dispatch = useDispatch();
    const rowId = scope + "_" + index;
    const [rowType, setRowType] = useState(value.rowType || "default");
    const [category, setCategory] = useState(value.Category || "");
    const [subcategory, setSubcategory] = useState(value.Subcategory || "");
    const [activity, setActivity] = useState(value.Activity || "");
    const [quantity, setQuantity] = useState(value.Quantity || "");
    const [unit, setUnit] = useState(value.Unit || "");
    const [quantity2, setQuantity2] = useState(value.Quantity2 || "");
    const [unit2, setUnit2] = useState(value.Unit2 || "");
    const [activity_id, setActivityId] = useState(value.activity_id || "");
    const [act_id, setActId] = useState(value.act_id || "");
    const [unit_type, setUnitType] = useState(value.unit_type || "");
    const [subcategories, setSubcategories] = useState([]);
    const [activities, setActivities] = useState([]);
    const [units, setUnits] = useState([]);
    const [units2, setUnits2] = useState([]);
    const [baseCategories, setBaseCategories] = useState([]);
    const [activitySearch, setActivitySearch] = useState("");
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [quantityError, setQuantityError] = useState("");
    const [quantity2Error, setQuantity2Error] = useState("");
    const [isFetchingActivities, setIsFetchingActivities] = useState(false);
    const isFetching = useRef(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const quantity1Ref = useRef(null);
    const quantity2Ref = useRef(null);
    const focusedField = useSelector((state) => state.emissions.focusedField);
    const text1 = useSelector((state) => state.header.headertext1);
    const text2 = useSelector((state) => state.header.headertext2);
    const middlename = useSelector((state) => state.header.middlename);
    const [isMobile, setIsMobile] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768); // Adjust as needed
      };

      handleResize(); // on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    const useremail =
      typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";
    const roles =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("textcustomrole")) || ""
        : "";

    const locationname = useSelector((state) => state.emissions.locationName);
    const monthName = useSelector((state) => state.emissions.monthName);


    //file log code//
    const getIPAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
      }
    };

    const LoginlogDetails = async (
      status,
      actionType,
      category,
      subcategory,
      activity,
      fileName,
      fileType
    ) => {
      const backendUrl = process.env.BACKEND_API_URL;
      const userDetailsUrl = `${backendUrl}/sustainapp/post_logs/`;

      try {
        const ipAddress = await getIPAddress();

        const data = {
          event_type: text1,
          event_details: "File",
          action_type: actionType,
          status: status,
          user_email: useremail,
          user_role: roles,
          ip_address: ipAddress,
          logs: `${text1} > ${middlename} > ${text2} > ${locationname} > ${year} > ${monthName} > ${scope} > ${
            category || "Category not selected"
          } > ${subcategory || "Subcategory not selected"} > ${
            activity || "Activity not selected"
          } > ${fileName} > ${fileType}`,
        };

        // const response = await axiosInstance.post(userDetailsUrl, data);
        console.log("log data", data);

        // return response.data;
      } catch (error) {
        console.error("Error logging login details:", error);

        return null;
      }
    };
    //file log code end//

    // Get validation errors from Redux
    const validationErrors = useSelector(
      (state) => state.emissions.validationErrors
    );
    // Access the fields object within the scope
    const scopeErrors = validationErrors?.[scope]?.fields?.[index] || {};

    // Function to get field class based on validation state
    const getFieldClass = useCallback(
      (fieldName, baseClass = "") => {
        const hasError = scopeErrors[fieldName];
        return `${baseClass} ${
          hasError ? "border-b border-red-500" : ""
        }`.trim();
      },
      [scopeErrors]
    );

    // Function to get error message for a field
    const getErrorMessage = (fieldName) => {
      // console.log("scopeErrors:", scopeErrors, scopeErrors[fieldName]);

      return scopeErrors[fieldName];
    };

    // Function for placeholder/option validation styling
    const getPlaceholderClass = useCallback(
      (fieldName) => {
        const hasError = scopeErrors[fieldName];
        return hasError ? "text-red-500" : "";
      },
      [scopeErrors]
    );

    // Effect to handle focus based on Redux state
    useEffect(() => {
      if (focusedField.rowId === rowId && focusedField.field) {
        if (focusedField.field === "quantity1" && quantity1Ref.current) {
          quantity1Ref.current.focus();
        } else if (focusedField.field === "quantity2" && quantity2Ref.current) {
          quantity2Ref.current.focus();
        }
      }
    }, [focusedField, rowId]);

    const handleFocus = (fieldName) => {
      dispatch(
        setFocusedField({
          rowId,
          field: fieldName,
        })
      );
    };

    const handleBlur = (e) => {
      const relatedTarget = e.relatedTarget;
      const isMovingWithinWidget =
        relatedTarget &&
        (relatedTarget === quantity1Ref.current ||
          relatedTarget === quantity2Ref.current);

      if (!isMovingWithinWidget) {
        dispatch(clearFocusedField());
      }
    };

    // Assign To
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isMultipleAssignModalOpen, setIsMultipleAssignModalOpen] =
      useState(false);
    const users = useSelector((state) => state.emissions.users.data);
    const [assignedUser, setAssignedUser] = useState(value.assigned_to || "");
    const { location, month } = useSelector((state) => state.emissions);
    //row selection
    const selectedRows = useSelector(
      (state) => state.emissions.selectedRows[scope]
    );

    const scopeDataFull = useSelector(
      (state) => state.emissions[`${scope}Data`]
    );
    const [isSelected, setIsSelected] = useState(false);
    const selectAll = useSelector(
      (state) => state.emissions.selectAllChecked[scope]
    );

    // Function to check if current row is selected
    const isRowSelected = useCallback(() => {
      return selectedRows?.some((row) => row.rowId === rowId);
    }, [selectedRows, rowId]);

    const updateSelectedRowIfNeeded = useCallback(
      (updatedValue) => {
        if (isRowSelected()) {
          dispatch(
            updateSelectedRow({
              scope,
              rowId,
              isSelected: true,
              rowData: updatedValue,
            })
          );
        }
      },
      [dispatch, scope, rowId, isRowSelected]
    );

    useEffect(() => {
      const filteredUser = users?.filter(
        (user) => user.id === parseInt(value.assigned_to)
      );
      setAssignedUser(filteredUser[0]?.username);
    }, [users, value.assigned_to]);

    const handleAssignClick = () => {
      // Disable form validation before opening modal
      if (category && subcategory) setIsAssignModalOpen(true);
      else toast.error("Please select category and subcategory");
    };

    const handleCloseAssignModal = () => {
      // Re-enable form validation after modal closes
      if (formRef?.current) {
        formRef.current.noValidate = false;
      }
      setIsAssignModalOpen(false);
    };

    const handleMultipleAssignClick = () => {
      // Check if all selected rows have category and subcategory
      const invalidRows = selectedRows.filter(
        (row) => !row.Emission?.Category || !row.Emission?.Subcategory
      );

      if (invalidRows.length > 0) {
        toast.error("All rows must have Category and Sub-Category selected");
        return;
      }

      setIsMultipleAssignModalOpen(true);
    };

    const handleCloseMultipleAssignModal = () => {
      setIsMultipleAssignModalOpen(false);
      // setShowAllTasks(false)
    };

    const requiresNumericValidation = (unit) =>
      [
        "Number of items",
        "Number of flights",
        "passengers",
        "Number of vehicles",
        "number of Nights",
      ].includes(unit);

    const validateQuantity = (value, unit) => {
      if (requiresNumericValidation(unit) && !/^\d+$/.test(value)) {
        return "This field must be a positive integer.";
      }
      return "";
    };
    const scopeMappings = {
      scope1: scope1Info,
      scope2: scope2Info,
      scope3: scope3Info,
    };

    const scopeData = scopeMappings[scope];

    const fetchBaseCategories = async () => {
      if (!scopeData) {
        console.error("Invalid scope provided");
        return;
      }
      const categories = scopeData.flatMap((info) =>
        info.Category.map((c) => c.name)
      );
      setBaseCategories(categories);
    };

    useEffect(() => {
      fetchBaseCategories();
    }, []);

    const fetchSubcategories = useCallback(async () => {
      const selectedCategory = scopeMappings[scope]?.find((info) =>
        info.Category.some((c) => c.name === category)
      );

      const newSubcategories = selectedCategory
        ? selectedCategory.Category.find((c) => c.name === category)
            ?.SubCategory || []
        : [];

      setSubcategories(newSubcategories);
    }, [category, scope]);

    const activityCache = useSelector(
      (state) => state.emissions.activitiesCache
    );
    const activeRequests = useSelector(
      (state) => state.emissions.activeRequests
    );

    const [isLoadingActivities, setIsLoadingActivities] = useState(false);
    const activitiesRef = useRef([]);
    // Track if activities have been loaded for this subcategory
    const [activitiesLoaded, setActivitiesLoaded] = useState(false);

    // Use a ref to track if we're already fetching activities
    const isFetchingRef = useRef(false);

    const fetchActivities = useCallback(async () => {
      // Return early if no subcategory or we're already fetching
      if (!subcategory || isFetchingRef.current || rowType === "calculated") {
        return;
      }

      try {
        // Set loading state and fetching flag
        setIsLoadingActivities(true);
        isFetchingRef.current = true;

        // Use the centralized activities service
        const result = await getActivities({
          category,
          subcategory,
          countryCode,
          year,
        });

        // Update state and refs with the result
        setActivities(result);
        activitiesRef.current = result;
        setActivitiesLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoadingActivities(false);
        isFetchingRef.current = false;
      }
    }, [subcategory, category, countryCode, year, rowType]);

    // useEffect(() => {
    //   // Only fetch activities when subcategory changes and we don't have them yet
    //   if (subcategory && !activitiesLoaded && !isLoadingActivities && !isFetchingRef.current) {
    //     // Using the ref to track fetch status instead of state to prevent re-renders
    //     isFetchingRef.current = true;

    //     // Fetch activities
    //     fetchActivities().finally(() => {
    //       isFetchingRef.current = false;
    //     });
    //   }

    //   // Only reset loaded status when subcategory actually changes
    //   return () => {
    //     if (subcategory) {
    //       setActivitiesLoaded(false);
    //     }
    //   };
    // }, [subcategory, fetchActivities]);
    useEffect(() => {
      // Only fetch activities when subcategory changes and we don't have them yet
      if (subcategory && !activitiesLoaded && !isLoadingActivities) {
        fetchActivities();
      }

      // Reset loaded status when subcategory changes
      return () => {
        if (subcategory) {
          setActivitiesLoaded(false);
        }
      };
    }, [subcategory, fetchActivities]);

    const handleSearchChange = useCallback(
      (e) => {
        const searchValue = e.target.value;
        setActivitySearch(searchValue);

        if (
          searchValue.length >= 3 &&
          !isLoadingActivities &&
          !isFetchingRef.current
        ) {
          fetchActivities();
        }
      },
      [fetchActivities, isLoadingActivities]
    );

    useEffect(() => {
      if (category) {
        fetchSubcategories();
      }
    }, [category]);

    useEffect(() => {
      const unitConfig = unitTypes.find((u) => u.unit_type === unit_type);

      if (unitConfig && unitConfig.units) {
        const unitKeys = Object.keys(unitConfig.units);
        const units1 = unitKeys.length > 0 ? unitConfig.units[unitKeys[0]] : [];
        const units2 = unitKeys.length > 1 ? unitConfig.units[unitKeys[1]] : [];

        setUnits(units1);
        setUnits2(units2);
      } else {
        setUnits([]);
        setUnits2([]);
      }
    }, [unit_type]);

    const handleCategoryChange = useCallback(
      (newCategory) => {
        const updatedValue = {
          ...value,
          Category: newCategory,
          Subcategory: "",
          Activity: "",
          Quantity: "",
          Unit: "",
        };
        setCategory(newCategory);
        onChange(updatedValue);
        updateSelectedRowIfNeeded(updatedValue);

        // Reset local state
        setSubcategory("");
        setActivity("");
        setQuantity("");
        setUnit("");
      },
      [onChange, value, updateSelectedRowIfNeeded]
    );

    const handleSubcategoryChange = useCallback(
      (newSubcategory) => {
        const updatedValue = {
          ...value,
          Subcategory: newSubcategory,
          Activity: "",
          Quantity: "",
          Unit: "",
        };
        onChange(updatedValue);
        updateSelectedRowIfNeeded(updatedValue);

        setActivity("");
        setQuantity("");
        setUnit("");
      },
      [onChange, value, updateSelectedRowIfNeeded]
    );

    const handleActivityChange = useCallback(
      (newActivity) => {
        console.log("handleActivityChange called with:", newActivity);

        // Find the selected activity object from our activities array
        const foundActivity = activities.find(
          (act) =>
            // `${act.name} - (${act.source}) - ${act.unit_type}` === newActivity
          `${act.name} - (${
                            act.source
                          }) - ${act.unit_type} - ${act.region} - ${
                            act.year
                          }${
                            act.source_lca_activity !== "unknown"
                              ? ` - ${act.source_lca_activity}`
                              : ""
                          }` === newActivity
        );

        console.log("Found activity:", foundActivity);

        // First update local state to immediately show the selected activity
        setActivity(newActivity);
        setActId(foundActivity ? foundActivity.id : "");

        // Then update the form data with all the relevant details
        const updatedValue = {
          ...value,
          Activity: newActivity,
          activity_id: foundActivity ? foundActivity.activity_id : "",
          act_id: foundActivity ? foundActivity.id : "",
          unit_type: foundActivity ? foundActivity.unit_type : "",
          factor: foundActivity ? foundActivity.factor : "",
          data_version: foundActivity
            ? foundActivity.data_version
            : "{{DATA_VERSION}}",
          Quantity: "",
          Quantity2: "",
          Unit: "",
          Unit2: "",
        };

        // setUnitType(foundActivity ? foundActivity.unit_type : "")

        // Update form state
        onChange(updatedValue);

        // Update selected row if needed
        updateSelectedRowIfNeeded(updatedValue);

        // Reset quantity and unit states
        setQuantity("");
        setQuantity2("");
        setUnit("");
        setUnit2("");
      },
      [activities, onChange, value, updateSelectedRowIfNeeded]
    );
    // mobile version
    const handleActivityChangemobile = useCallback(
      (newActivity) => {
        console.log("handleActivityChange called with:", newActivity);

        // Find the selected activity object from our activities array
        const foundActivity = activities.find(
          (act) =>
            `${act.name} - (${act.source}) - ${act.unit_type}` === newActivity
        );

        console.log("Found activity:", foundActivity);

        // First update local state to immediately show the selected activity
        setActivity(newActivity);

        // Then update the form data with all the relevant details
        const updatedValue = {
          ...value,
          Activity: newActivity,
          activity_id: foundActivity ? foundActivity.activity_id : "",
          unit_type: foundActivity ? foundActivity.unit_type : "",
          factor: foundActivity ? foundActivity.factor : "",
          data_version: foundActivity
            ? foundActivity.data_version
            : "{{DATA_VERSION}}",
          Quantity: "",
          Quantity2: "",
          Unit: "",
          Unit2: "",
        };

        // Update form state
        onChange(updatedValue);

        // Update selected row if needed
        updateSelectedRowIfNeeded(updatedValue);

        // Reset quantity and unit states
        setQuantity("");
        setQuantity2("");
        setUnit("");
        setUnit2("");
      },
      [activities, onChange, value, updateSelectedRowIfNeeded]
    );
    // bug causing
    useEffect(() => {
      if (
        activities.length > 0 &&
        value.Activity &&
        !value.factor &&
        rowType !== "assigned"
      ) {
        const foundActivity = activities.find(
          (act) =>
            `${act.name} - (${act.source}) - ${act.unit_type}` ===
            value.Activity
        );

        if (foundActivity) {
          const updatedValue = {
            ...value,
            factor: foundActivity.factor || foundActivity.co2_factor || "0",
          };
          onChange(updatedValue);
        }
      }
    }, [activities, value.Activity]);

    const debouncedHandleQuantityChange = useCallback(
      debounce((nextValue) => {
        setQuantity(nextValue);
        onChange({
          ...value,
          Quantity: nextValue,
        });
      }, 500),
      [onChange]
    );

    const debouncedHandleQuantity2Change = useCallback(
      debounce((nextValue) => {
        setQuantity2(nextValue);
        onChange({
          ...value,
          Quantity2: nextValue,
        });
      }, 500),
      [onChange]
    );

    const handleQuantityChange = useCallback(
      (e) => {
        const value = e.target.value;
        setQuantity(value);
        debouncedHandleQuantityChange(value);
        const error = validateQuantity(value, unit);
        setQuantityError(error);
        if (error) {
          toast.error(error);
        }
      },
      [unit]
    );

    const handleQuantity2Change = useCallback(
      (e) => {
        const value = e.target.value;
        setQuantity2(value);
        debouncedHandleQuantity2Change(value);
        const error = validateQuantity(value, unit2);
        setQuantity2Error(error);
        if (error) {
          toast.error(error);
        }
      },
      [unit2]
    );

    const handleUnitChange = useCallback(
      (newValue) => {
        setUnit(newValue);
        onChange({
          ...value,
          Unit: newValue,
        });
      },
      [
        category,
        subcategory,
        activity,
        quantity,
        activity_id,
        unit_type,
        onChange,
      ]
    );

    const handleUnit2Change = useCallback(
      (newValue) => {
        setUnit2(newValue);
        onChange({
          ...value,
          Unit2: newValue,
        });
      },
      [
        category,
        subcategory,
        activity,
        quantity,
        activity_id,
        unit_type,
        onChange,
      ]
    );

    useEffect(() => {
      if (unit && requiresNumericValidation(unit)) {
        const newQuantity = Math.floor(Number(quantity));
        if (newQuantity !== Number(quantity)) {
          setQuantity(newQuantity);
          const error = validateQuantity(newQuantity, unit);
          setQuantityError(error);
          debouncedHandleQuantityChange(newQuantity);
          toast.error("This field cannot have decimal value");
        }
      }
    }, [unit, quantity]);

    useEffect(() => {
      if (unit2 && requiresNumericValidation(unit2)) {
        const newQuantity2 = Math.floor(Number(quantity2));
        if (newQuantity2.toString() !== quantity2) {
          setQuantity2(newQuantity2);
          debouncedHandleQuantityChange(newQuantity);
          const error = validateQuantity(newQuantity2, unit2);
          setQuantity2Error(error);
          toast.error("This field cannot have decimal value");
        }
      }
    }, [unit2, quantity2]);

    const toggleDropdown = useCallback(() => {
      setIsDropdownActive(!isDropdownActive);
      if (isDropdownActive) {
        setActivitySearch("");
      }
    }, [isDropdownActive]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          inputRef.current &&
          !inputRef.current.contains(event.target)
        ) {
          setIsDropdownActive(false);
          setActivitySearch("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    //file uplod code///
    const [fileName, setFileName] = useState(value.file?.name ?? "");
    const [showModal, setShowModal] = useState(false);
    const [previewData, setPreviewData] = useState(value.file?.url ?? "");
    const [fileType, setFileType] = useState(value.file?.type ?? "");
    const [fileSize, setFileSize] = useState(value.file?.size ?? 0);
    const [uploadDateTime, setUploadDateTime] = useState(
      value.file?.uploadDateTime ?? ""
    );
    const [uploadedBy, setUploadedBy] = useState(value.file?.uploadedBy ?? "");
    const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
    const [selectSize, setSelectSize] = useState(9); // default to desktop size

    useEffect(() => {
      const handleResize = () => {
        // You can adjust the breakpoint as needed
        if (window.innerWidth < 768) {
          setSelectSize(0); // for mobile, hide dropdown
        } else {
          setSelectSize(9); // for desktop
        }
      };

      handleResize(); // set initial value
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setLoggedInUserEmail(storedEmail);
      }
    });

    const uploadFileToAzure = async (file, newFileName) => {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer]);

      const accountName = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT;
      const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER;
      const sasToken = process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN;

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobName = newFileName || file.name;
      const blobClient = containerClient.getBlockBlobClient(blobName);

      try {
        const uploadOptions = {
          blobHTTPHeaders: {
            blobContentType: file.type,
          },
        };

        await blobClient.uploadData(blob, uploadOptions);
        const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
        return url;
      } catch (error) {
        LoginlogDetails("Failed", "Deleted");
        console.error("Error uploading file:", error.message);
        return null;
      }
    };

    const handleChange = async (event) => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const newFileName = selectedFile.name;
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
        const uploadDateTime = new Date().toLocaleString();

        console.log("Selected file details:", {
          newFileName,
          fileType,
          fileSize,
          uploadDateTime,
        });

        setFileName(newFileName); // Set the file name

        const uploadUrl = await uploadFileToAzure(selectedFile, newFileName);

        if (uploadUrl) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewData(reader.result); // For preview
          };
          reader.readAsDataURL(selectedFile);

          // Update only the file data, keeping the rest of the row state
          onChange({
            ...value,
            file: {
              value: uploadUrl,
              name: newFileName,
              url: uploadUrl,
              type: fileType,
              size: fileSize,
              uploadDateTime,
              uploadedBy: loggedInUserEmail,
            },
          });
          setFileType(fileType);

          setTimeout(() => {
            LoginlogDetails(
              "Success",
              "Uploaded",
              value.Category,
              value.Subcategory,
              value.Activity,
              newFileName,
              fileType
            );
          }, 500);

          console.log("File uploaded successfully:", uploadUrl);
        } else {
          console.error("File upload failed");
        }
      }
    };

    const handlePreview = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleDelete = () => {
      try {
        const resetValue = {
          type: "file",
          value: "",
          name: "",
          url: "",
          type: "",
          size: "",
          uploadDateTime: "",
        };

        setFileName("");
        setPreviewData(null);
        onChange(resetValue);
        setShowModal(false);

        setTimeout(() => {
          LoginlogDetails("Success", "Deleted");
        }, 500);
      } catch (error) {
        console.error("Error deleting file:", error.message);
        // Call LoginlogDetails with a "Failed" status for deletion
        setTimeout(() => {
          LoginlogDetails("Failed", "Deleted");
        }, 500);
      }
    };

    const handleClickonRemove = () => {
      onRemove(index);
    };

    useEffect(() => {
      // Check if this row is in the selectedRows array for this scope
      setIsSelected(selectedRows.some((row) => row.rowId === rowId));
    }, [selectedRows, rowId]);

    const handleRowSelection = (event) => {
      const checked = event.target.checked;
      setIsSelected(checked);
      dispatch(
        setSelectedRows({
          scope,
          rowId,
          isSelected: checked,
          rowData: value,
        })
      );
    };

    const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      console.log("Select all isChecked:", isChecked, scope);

      dispatch(toggleSelectAll({ scope, isChecked }));
    };

    useEffect(() => {
      if (
        value.assigned_to &&
        value.assigned_to !== "" &&
        rowType === "default" &&
        !["calculated", "approved"].includes(rowType) // Add this check
      ) {
        setRowType("assigned");
      }
    }, [value.assigned_to]);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const openInfoModal = () => {
      setIsInfoModalOpen(true);
    };
    const closeInfoModal = () => {
      setIsInfoModalOpen(false);
    };

    // Updated getActivityPlaceholder function to work with existing fetchActivities
    const getActivityPlaceholder = useCallback(() => {
      if (rowType === "calculated") {
        return activity;
      } else if (rowType !== "calculated" && activity) {
        return activity;
      } else if (isLoadingActivities || isFetchingRef.current) {
        return "Fetching activities...";
      } else if (
        activitiesRef.current.length === 0 &&
        subcategory &&
        activitiesLoaded
      ) {
        // Only show "No relevant activities found" when:
        // 1. We have no activities
        // 2. A subcategory is selected
        // 3. We've already attempted to load activities (activitiesLoaded is true)
        return "No relevant activities found";
      } else if (activitiesRef.current.length > 0 && !activity) {
        return "Select Activity";
      } else {
        return "Select Activity";
      }
    }, [isLoadingActivities]);

    // Update this memo to be more strict in its filtering
    const filteredActivities = useMemo(() => {
      if (!activitySearch || activitySearch.length < 3) {
        return activities;
      }

      const searchText = activitySearch.toLowerCase().trim();

      // Log to debug
      console.log(
        `Filtering ${activities.length} activities with search: "${searchText}"`
      );

      const filtered = activities.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(searchText);
        const sourceMatch = item.source?.toLowerCase().includes(searchText);
        return nameMatch || sourceMatch;
      });

      console.log(`Found ${filtered.length} matches`);
      return filtered;
    }, [activities, activitySearch]);

    //visible activities
    const [visibleActivities, setVisibleActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [itemsPerPage] = useState(100);

    useEffect(() => {
      // Reset pagination when search changes or filteredActivities changes
      setCurrentPage(1);

      // Clear previous visibleActivities completely
      setVisibleActivities([]);

      // Show initial batch
      const initialItems = filteredActivities.slice(0, itemsPerPage);
      setVisibleActivities(initialItems);

      // Update hasMore flag
      setHasMore(filteredActivities.length > itemsPerPage);

      console.log(
        `Search: "${activitySearch}" - Filtered items: ${filteredActivities.length}, Visible items: ${initialItems.length}`
      );
    }, [filteredActivities, itemsPerPage, activitySearch]);

    // Function to handle scroll and load more items
    const handleDropdownScroll = useCallback(
      (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // If we're near the bottom (within 50px) and there are more items to load
        if (scrollHeight - scrollTop - clientHeight < 50 && hasMore) {
          // Calculate next page
          const nextPage = currentPage + 1;
          const startIndex = currentPage * itemsPerPage;
          const endIndex = Math.min(
            startIndex + itemsPerPage,
            filteredActivities.length
          );

          // Check if we've already loaded all items or if there are no more items to load
          if (
            startIndex >= filteredActivities.length ||
            startIndex >= endIndex
          ) {
            setHasMore(false);
            return;
          }

          // Get next batch of items
          const newItems = filteredActivities.slice(startIndex, endIndex);

          // Update state
          setVisibleActivities((prevItems) => {
            // Create a Set of existing IDs to avoid duplicates
            const existingIds = new Set(
              prevItems.map(
                (item) =>
                  item.id ||
                  item.activity_id ||
                  `${item.name}-${item.source}-${item.unit_type}`
              )
            );

            // Only add items that aren't already in the list
            const uniqueNewItems = newItems.filter((item) => {
              const itemId =
                item.id ||
                item.activity_id ||
                `${item.name}-${item.source}-${item.unit_type}`;
              return !existingIds.has(itemId);
            });

            return [...prevItems, ...uniqueNewItems];
          });

          setCurrentPage(nextPage);

          // Check if we've loaded all items
          if (endIndex >= filteredActivities.length) {
            setHasMore(false);
          }
        }
      },
      [filteredActivities, currentPage, hasMore, itemsPerPage]
    );

    const renderFirstColumn = () => {
      switch (rowType) {
        case "calculated":
          return (
            <td className="py-2 text-center w-[1vw]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 xl:mx-auto md:mx-auto 2xl:mx-auto lg:mx-auto 3xl:mx-auto 4k:mx-auto 2k:mx-auto mx-2"></div>
            </td>
          );
        case "assigned":
          return (
            <td className="py-2 text-center w-[1vw]">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mx-auto"></div>
            </td>
          );
        case "approved":
          return (
            <td className="py-2 text-center w-[1vw]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFA701] mx-auto"></div>
            </td>
          );
        default:
          return (
            <td className="py-2 text-center w-[1vw]">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleRowSelection}
                className="w-4 h-4 mt-2 border-gray-600 green-checkbox"
              />
            </td>
          );
      }
    };

    return (
      <div
        className={`w-full ${
          !id.startsWith("root_0") &&
          "xl:ml-1 md:ml-1 lg:ml-1 3xl:ml-1 4k:ml-1 2k:ml-1 ml-0"
        }`}
      >
        {id.startsWith("root_0") && (
          <div className="mb-2">
            <button
              type="button"
              className=" border text-[12px] py-1.5 px-3 rounded-md text-[#007eef] font-semibold leading-tight border-[#007eef] disabled:text-slate-300 disabled:border-slate-300 cursor-pointer"
              disabled={!selectedRows?.length}
              onClick={handleMultipleAssignClick}
            >
              Assign Tasks ({selectedRows.length})
            </button>
          </div>
        )}

        <table
          className={`min-w-full w-full ${
            scopeErrors["Category"] ||
            scopeErrors["Subcategory"] ||
            scopeErrors["Activity"] ||
            scopeErrors["Quantity"] ||
            scopeErrors["Unit"]
              ? "mb-2"
              : ""
          }`}
        >
          {id.startsWith("root_0") && (
            <thead className="bg-gray-50">
              <tr>
                <th className="h-[44px] border-b border-gray-300">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-2 green-checkbox-minus"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className=" h-[44px] pl-2 border-b border-gray-300 text-[12px] text-left text-[#667085]">
                  Category
                </th>
                <th className=" h-[44px]  border-b border-gray-300 text-[12px] text-left text-[#667085]">
                  Sub-Category
                </th>
                <th className=" h-[44px]  border-b border-gray-300 text-[12px] text-left text-[#667085]">
                  Activity
                </th>
                <th className="h-[44px]  border-b border-gray-300 text-[12px] text-right text-[#667085]">
                  Quantity
                </th>
                <th className=" h-[44px]  border-b border-gray-300 text-[12px] text-center text-[#667085]">
                  Assignee
                </th>
                <th className=" h-[44px]  border-b border-gray-300 text-[12px] text-left text-[#667085]">
                  Actions
                </th>
              </tr>
            </thead>
          )}
          <tbody className="bg-white">
            <tr className={`border-b border-gray-200`}>
              {/* Checkbox */}
              {renderFirstColumn()}

              {/* Category Dropdown */}
              <td
                className={`py-2 px-1 pl-2 w-[25vw] xl:w-[15vw] lg:w-[15vw] 2xl:w-[15vw] 4k:w-[15vw] 2k:w-[15vw] md:w-[15vw] relative ${
                  scopeErrors["Category"] ? "" : ""
                }`}
              >
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={getFieldClass(
                    "Category",
                    `text-[12px] focus:outline-none w-[57vw] xl:w-full lg:w-full 2xl:w-full 4k:w-full 2k:w-full md:w-full  py-1 ${
                      category && rowType === "default"
                        ? "border-b border-zinc-800"
                        : ""
                    }`
                  )}
                  disabled={["assigned", "calculated", "approved"].includes(
                    rowType
                  )}
                >
                  <option className={getPlaceholderClass("Category")}>
                    Select Category
                  </option>
                  {baseCategories.map((categoryName, index) => (
                    <option key={index} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
                {scopeErrors["Category"] && (
                  <div className="text-[12px] text-red-500 absolute left-3 -bottom-[18px]">
                    {getErrorMessage("Category")}
                  </div>
                )}
              </td>

              {/* Sub-Category Dropdown */}
              <td className="py-2 px-1 w-[25vw] xl:w-[15vw] lg:w-[15vw] 2xl:w-[15vw] 4k:w-[15vw] 2k:w-[15vw] md:w-[15vw] relative">
                <select
                  value={subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className={getFieldClass(
                    "Subcategory",
                    `text-[12px] focus:outline-none w-[57vw] xl:w-full lg:w-full 2xl:w-full 4k:w-full 2k:w-full md:w-full py-1 ${
                      subcategory && rowType === "default"
                        ? "border-b border-zinc-800"
                        : ""
                    }`
                  )}
                  disabled={["assigned", "calculated", "approved"].includes(
                    rowType
                  )}
                >
                  <option className="emissionscopc">Select Sub-Category</option>
                  {subcategories.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                {scopeErrors["Subcategory"] && (
                  <div className="text-[12px] text-red-500 absolute left-2 -bottom-[18px]">
                    {getErrorMessage("Subcategory")}
                  </div>
                )}
              </td>

              {/* Activity Dropdown */}
              <td className="py-2  w-[55vw] xl:w-[15vw] lg:w-[15vw] 2xl:w-[15vw] 4k:w-[15vw] 2k:w-[15vw] md:w-[15vw]">
                <div
                  className={`relative ${
                    activity &&
                    activity !== "No relevant activities found" &&
                    rowType === "default"
                      ? "border-b border-zinc-800"
                      : ""
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    title={value.Activity?value.Activity:''}
                    placeholder={getActivityPlaceholder()}
                    value={activitySearch}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (isMobile) {
                        setIsActivityModalOpen(true);
                      } else {
                        toggleDropdown();
                      }
                    }}
                    className={getFieldClass(
                      "Activity",
                      "text-[12px] focus:outline-none xl:w-full md:w-full lg:w-full 2xl:w-full 4k:w-full 2k:w-full 3xl:w-full w-[55vw] py-1"
                    )}
                    disabled={["assigned", "calculated", "approved"].includes(
                      value.rowType
                    )}
                  />
                  {scopeErrors["Activity"] && (
                    <div className="text-[12px] text-red-500  xl:absolute md:absolute lg:absolute 2xl:absolute 4k:absolute 2k:absolute relative left-0 -bottom-[28px]">
                      {getErrorMessage("Activity")}
                    </div>
                  )}
                  {isDropdownActive && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 top-8 z-[100] w-full bg-white rounded-lg border border-gray-300 shadow-lg max-h-64 overflow-y-auto min-w-[210px] xl:min-w-[810px] md:min-w-[810px] lg:min-w-[810px] 2xl:min-w-[810px] 4k:min-w-[810px] 2k:min-w-[810px] 3xl:min-w-[810px] mb-6"
                      onScroll={handleDropdownScroll}
                    >
                      <div
                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setActivity("");
                          toggleDropdown();
                          setActivitySearch("");
                        }}
                      >
                        <span className="text-[12px]">
                          {rowType === "calculated"
                            ? activity
                            : "Select Activity"}
                        </span>
                      </div>

                      {isLoadingActivities ? (
                        <div className="p-2 text-center text-[12px] text-gray-500">
                          Loading activities...
                        </div>
                      ) : visibleActivities.length === 0 ? (
                        <div className="p-2 text-center text-[12px] text-gray-500">
                          No matching activities found
                        </div>
                      ) : (
                        // Map from visibleActivities
                        visibleActivities.map((item, index) => {
                          const displayText = `${item.name} - (${
                            item.source
                          }) - ${item.unit_type} - ${item.region} - ${
                            item.year
                          }${
                            item.source_lca_activity !== "unknown"
                              ? ` - ${item.source_lca_activity}`
                              : ""
                          }`;

                          // For the dropdown selection value
                          const value = `${item.name} - (${item.source}) - ${item.unit_type}`;

                          // Check if this item's ID matches the currently selected activity's ID
                          const isSelected = item.id === act_id;
                          console.log(
                            "isSelected:, item id, act_id",
                            isSelected,
                            item.id,
                            act_id
                          );

                          return (
                            <div
                              key={item.id || item.activity_id || index}
                              className={`p-2 cursor-pointer text-[12px] truncate ${
                                isSelected
                                  ? "bg-blue-100 font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                handleActivityChange(displayText);
                                toggleDropdown();
                                setActivitySearch("");
                              }}
                            >
                              {displayText}
                            </div>
                          );
                        })
                      )}

                      {hasMore && (
                        <div className="p-2 text-center text-[12px] text-gray-500 border-t">
                          Scroll down to load more...
                        </div>
                      )}
                    </div>
                  )}
                  {/* mobile version */}
                  {isActivityModalOpen && isMobile && (
                    <div className="fixed inset-0 z-50 bg-white overflow-y-auto px-4 py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                          Select Activity
                        </h2>
                        <button onClick={() => setIsActivityModalOpen(false)}>
                          <MdClose size={24} />
                        </button>
                      </div>

                      <input
                        type="text"
                        title={value.Activity?value.Activity:''}
                        value={activitySearch}
                        onChange={handleSearchChange}
                        placeholder="Search activities..."
                        className="w-full border rounded px-2 py-1 mb-4"
                      />

                      <div
                        className="max-h-[80vh] overflow-y-auto border rounded"
                        onScroll={handleDropdownScroll}
                      >
                        {isLoadingActivities ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Loading...
                          </p>
                        ) : filteredActivities.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No matching activities
                          </p>
                        ) : (
                          visibleActivities.map((item, index) => {
                            // const displayText = `${item.name} - (${item.source}) - ${item.unit_type}`;
                            const displayText = `${item.name} - (${
                              item.source
                            }) - ${item.unit_type} - ${item.region} - ${
                              item.year
                            }${
                              item.source_lca_activity !== "unknown"
                                ? ` - ${item.source_lca_activity}`
                                : ""
                            }`;
                            const value = `${item.name} - (${item.source}) - ${item.unit_type}`;
                            return (
                              <div
                                key={item.id || index}
                                className="p-2 border-b text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleActivityChange(value);
                                  setIsActivityModalOpen(false);
                                  setActivitySearch("");
                                }}
                              >
                                {displayText}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {hasMore && (
                        <p className="text-center text-xs text-gray-400 mt-4">
                          Scroll to load more...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* Quantity Input */}
              <td className="w-[35vw] xl:w-[24vw] lg:w-[24vw] 2xl:w-[24vw] 4k:w-[24vw] 2k:w-[24vw] md:w-[24vw]">
                {" "}
                {/* Set a fixed width for the parent container */}
                <div className="grid grid-flow-col-dense">
                  {unit_type.includes("Over") ? (
                    <>
                      <div className="flex justify-end relative w-full">
                        {" "}
                        {/* Ensure the flex container takes full width */}
                        <input
                          ref={quantity1Ref}
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          onFocus={() => handleFocus("quantity1")}
                          onBlur={handleBlur}
                          step="1"
                          min="0"
                          placeholder={
                            scopeErrors["Quantity"]
                              ? "Enter Value *"
                              : "Enter Value"
                          }
                          className={getFieldClass(
                            "Quantity",
                            "text-[12px] focus:outline-none w-[15.5vw] xl:w-[5vw] lg:w-[5vw] 2xl:w-[5vw] 4k:w-[5vw] 2k:w-[5vw] md:w-[5vw]  text-right pe-1 focus:border-b focus:border-blue-300" // Adjust input width
                          )}
                          disabled={["assigned", "approved"].includes(
                            value.rowType
                          )}
                          style={{
                            "::placeholder": {
                              color: scopeErrors["Quantity"]
                                ? "#EF4444"
                                : "inherit",
                            },
                          }}
                        />
                        {scopeErrors["Quantity"] && (
                          <div className="text-[12px] text-red-500 absolute left-[2rem] -bottom-6">
                            {getErrorMessage("Quantity")}
                          </div>
                        )}
                        <select
                          value={unit}
                          onChange={(e) => handleUnitChange(e.target.value)}
                          className={`text-[12px] w-[100px] text-center rounded-md py-1 shadow ${
                            unit
                              ? "bg-white text-blue-500 "
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          disabled={["assigned", "approved"].includes(rowType)}
                        >
                          <option value="">Unit</option>
                          {units.map((unit, index) => (
                            <option key={index} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                        {scopeErrors["Unit"] && (
                          <div className="text-[12px] text-red-500 absolute right-1 -bottom-6">
                            {getErrorMessage("Unit")}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end relative w-full">
                        {" "}
                        {/* Ensure the flex container takes full width */}
                        <input
                          ref={quantity2Ref}
                          type="number"
                          value={quantity2}
                          onChange={handleQuantity2Change}
                          onFocus={() => handleFocus("quantity2")}
                          onBlur={handleBlur}
                          placeholder="Enter Value"
                          className={getFieldClass(
                            "Quantity2",
                            "text-[12px] focus:outline-none  w-[15.5vw] xl:w-[5vw] lg:w-[5vw] 2xl:w-[5vw] 4k:w-[5vw] 2k:w-[5vw] md:w-[5vw]  text-right pe-1 focus:border-b focus:border-blue-300" // Adjust input width
                          )}
                          step="1"
                          min="0"
                          disabled={["assigned", "approved"].includes(rowType)}
                          style={{
                            "::placeholder": {
                              color: scopeErrors["Quantity"]
                                ? "#EF4444"
                                : "inherit",
                            },
                          }}
                        />
                        {scopeErrors["Quantity2"] && (
                          <div className="text-[12px] text-red-500 absolute left-[2rem] -bottom-6">
                            {getErrorMessage("Quantity2")}
                          </div>
                        )}
                        <select
                          value={unit2}
                          onChange={(e) => handleUnit2Change(e.target.value)}
                          className={` text-[12px] w-[100px] text-center rounded-md py-1 shadow ${
                            unit2
                              ? "bg-white text-blue-500 "
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          disabled={["assigned", "approved"].includes(rowType)}
                        >
                          <option value="">Unit</option>
                          {units2.map((unit, index) => (
                            <option key={index} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                        {scopeErrors["Unit2"] && (
                          <div className="text-[12px] text-red-500 absolute right-1 -bottom-6">
                            {getErrorMessage("Unit2")}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-end relative w-full">
                      {" "}
                      {/* Ensure the flex container takes full width */}
                      <input
                        ref={quantity1Ref}
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        onFocus={() => handleFocus("quantity1")}
                        onBlur={handleBlur}
                        step="1"
                        min="0"
                        placeholder="Enter Value"
                        className={getFieldClass(
                          "Quantity",
                          "text-[12px] focus:outline-none  w-[57vw] xl:w-[10vw] lg:w-[10vw] 2xl:w-[10vw] 4k:w-[10vw] 2k:w-[10vw] md:w-[10vw]  text-right pe-1 focus:border-b focus:border-blue-300"
                        )}
                        disabled={["assigned", "approved"].includes(
                          value.rowType
                        )}
                        style={{
                          "::placeholder": {
                            color: scopeErrors["Quantity"]
                              ? "#EF4444"
                              : "inherit",
                          },
                        }}
                      />
                      {scopeErrors["Quantity"] && (
                        <div className="text-[12px] text-red-500 absolute left-[3rem] -bottom-7">
                          {getErrorMessage("Quantity")}
                        </div>
                      )}
                      <select
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        className={` text-[12px] w-[100px] text-center rounded-md py-1 shadow ${
                          unit
                            ? "bg-white text-blue-500 "
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={["assigned", "approved"].includes(rowType)}
                        style={{
                          border: {
                            color: scopeErrors["Unit"] ? "#EF4444" : "inherit",
                          },
                        }}
                      >
                        <option value="">Unit</option>
                        {units.map((unit, index) => (
                          <option key={index} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      {scopeErrors["Unit"] && (
                        <div className="text-[12px] text-red-500 absolute right-2 -bottom-7">
                          {getErrorMessage("Unit")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* Assignee Button */}
              <td className="py-2 text-center w-[5vw]">
                <button
                  type="button"
                  className={`${
                    assignedUser
                      ? "bg-white text-blue-500 pl-1 truncate overflow-hidden shadow-md border border-gray-300 hover:shadow-lg"
                      : "bg-blue-500 text-white hover:bg-blue-600 "
                  }  text-[12px] w-[112px] py-1 rounded-md shadow disabled:opacity-80`}
                  onClick={handleAssignClick}
                  disabled={
                    rowType === "calculated" ||
                    rowType === "approved" ||
                    rowType === "assigned"
                  }
                >
                  {assignedUser ? `${assignedUser}` : "Assign to"}
                </button>
              </td>

              {/* Actions - Delete & Upload */}
              <td className="py-3 w-[5vw]">
                <div className=" flex justify-left">
                  <div className="pt-1">
                    <label className="">
                      <LuTrash2
                        className={`text-gray-500 ${
                          rowType === "approved"
                            ? "cursor-not-allowed"
                            : "hover:text-red-500 cursor-pointer"
                        }`}
                        onClick={handleClickonRemove}
                      />
                    </label>
                  </div>
                  <div className="pt-1">
                    <input
                      type="file"
                      id={id + scope}
                      onChange={handleChange}
                      style={{ display: "none" }}
                      disabled={
                        rowType === "assigned" ||
                        rowType === "approved" ||
                        rowType === "calculated"
                      }
                    />

                    {fileName ? (
                      <label className="cursor-pointer relative">
                        {fileType.includes(
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ) ? (
                          <RiFileExcel2Line
                            className="text-green-500 ml-2"
                            onClick={handlePreview}
                            data-tooltip-id={fileName}
                            data-tooltip-content={fileName}
                          />
                        ) : fileType.includes("application/pdf") ? (
                          <BsFiletypePdf
                            className="text-red-500 ml-2"
                            onClick={handlePreview}
                            data-tooltip-id={fileName}
                            data-tooltip-content={fileName}
                          />
                        ) : fileType.includes("image") ? (
                          <BsFileEarmarkImage
                            className="text-blue-500 ml-2"
                            onClick={handlePreview}
                            data-tooltip-id={fileName}
                            data-tooltip-content={fileName}
                          />
                        ) : (
                          <RiFileExcel2Line
                            className="text-blue-500 ml-2"
                            onClick={handlePreview}
                            data-tooltip-id={fileName}
                            data-tooltip-content={fileName}
                          />
                        )}
                        <ReactTooltip
                          id={fileName}
                          place="top"
                          effect="solid"
                          style={{
                            backgroundColor: "#000",
                            color: "white",
                            fontSize: "10px",
                            boxShadow: 3,
                            borderRadius: "8px",
                          }}
                        />
                      </label>
                    ) : (
                      <label htmlFor={id + scope} className="cursor-pointer">
                        <TbUpload className="text-gray-500 hover:text-blue-500 ml-2" />
                      </label>
                    )}

                    {/* Preview Modal */}
                    {showModal && previewData && (
                      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-1 rounded-lg w-[96%] h-[94%] mt-6 xl:w-[60%] lg:w-[60%] md:w-[60%] 2xl:w-[60%] 4k:w-[60%] 2k:w-[60%]">
                          <div className="flex justify-between mt-4 mb-4">
                            <div>
                              <h5 className="mb-4 ml-2 font-semibold truncate w-[200px] overflow-hidden whitespace-nowrap">
                                {fileName}
                              </h5>
                            </div>
                            <div className="flex">
                              <div
                                className="mb-4"
                                onClick={() => handleDelete(id, scope)}
                              >
                                <button
                                  type="button"
                                  className="px-2 py-1 mr-2 w-[120px] mt-1 flex items-center justify-center border border-red-500 text-red-600 text-[13px] rounded hover:bg-red-600 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                                  disabled={rowType === "approved"}
                                >
                                  <LuTrash2 className="me-2" /> Delete File
                                </button>
                              </div>
                              <div>
                                <button
                                  className="px-4 py-2 text-xl rounded"
                                  onClick={handleCloseModal}
                                >
                                  <MdClose />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="block  xl:flex lg:flex d:flex  2xl:flex  4k:flex  2k:flex ">
                            <div className="relative w-[112vw] xl:w-[744px] lg:w-[744px] 2xl:w-[744px] 4k:w-[744px] 2k:w-[744px] h-[136vw] xl:h-[545px] lg:h-[545px] 2xl:h-[545px] 4k:h-[545px] 2k:h-[545px]">
                              {fileType.startsWith("image") ? (
                                <img
                                  src={previewData}
                                  alt="Preview"
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : fileType === "application/pdf" ? (
                                <iframe
                                  src={previewData}
                                  title="PDF Preview"
                                  className="w-full h-full"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <p>
                                    File preview not available.Please download
                                    and verify
                                  </p>
                                  <a
                                    href={previewData}
                                    download={fileName}
                                    className="mt-12 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Download File
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="w-[211px] ml-6">
                              <div className="mb-4 mt-1">
                                <h2 className="text-neutral-500 text-[15px] font-semibold leading-relaxed tracking-wide">
                                  File information
                                </h2>
                              </div>
                              <div className="mb-4">
                                <h2 className="text-neutral-500 text-[12px] font-semibold leading-relaxed tracking-wide">
                                  FILE NAME
                                </h2>
                                <h2 className="text-[14px] leading-relaxed tracking-wide">
                                  {fileName}
                                </h2>
                              </div>
                              <div className="mb-4">
                                <h2 className="text-neutral-500 text-[12px] font-semibold leading-relaxed tracking-wide">
                                  FILE SIZE
                                </h2>
                                <h2 className="text-[14px] leading-relaxed tracking-wide">
                                  {(fileSize / 1024).toFixed(2)} KB
                                </h2>
                              </div>
                              <div className="mb-4">
                                <h2 className="text-neutral-500 text-[12px] font-semibold leading-relaxed tracking-wide">
                                  FILE TYPE
                                </h2>
                                <h2 className="text-[14px] leading-relaxed tracking-wide">
                                  {fileType}
                                </h2>
                              </div>
                              <div className="mb-4">
                                <h2 className="text-neutral-500 text-[12px] font-semibold leading-relaxed tracking-wide">
                                  UPLOAD DATE & TIME
                                </h2>
                                <h2 className="text-[14px] leading-relaxed tracking-wide">
                                  {uploadDateTime}
                                </h2>
                              </div>
                              <div className="mb-4">
                                <h2 className="text-neutral-500 text-[12px] font-semibold leading-relaxed tracking-wide">
                                  UPLOADED BY
                                </h2>
                                <h2 className="text-[14px] leading-relaxed tracking-wide">
                                  {uploadedBy.replace(/^"|"$/g, "") ||
                                    "Unknown"}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {value.rowType === "calculated" && (
                    <div className="pt-1 ms-2">
                      <label className="cursor-pointer">
                        <MdOutlineRemoveRedEye
                          className="text-gray-500 hover:text-blue-500"
                          onClick={openInfoModal}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <AssignEmissionModal
          isOpen={isAssignModalOpen}
          onClose={handleCloseAssignModal}
          onChange={onChange}
          index={index}
          onRemove={onRemove}
          taskData={{
            location,
            year,
            month: getMonthName(month),
            scope,
            category: value.Category,
            subcategory: value.Subcategory,
            activity: value.Activity,
            activity_id: value.activity_id,
            act_id: value.act_id,
            factor: value.factor,
            unit_type: value.unit_type,
            quantity1: value.Quantity,
            quantity2: value.Quantity2,
            unit1: value.Unit,
            unit2: value.Unit2,
            countryCode,
            rowId: rowId,
          }}
        />
        <MultipleAssignEmissionModal
          isOpen={isMultipleAssignModalOpen}
          onClose={handleCloseMultipleAssignModal}
          onChange={onChange}
          scope={scope}
          onRemove={onRemove}
          taskData={{
            location,
            year,
            month: getMonthName(month),
            scope,
            countryCode,
          }}
        />
        <CalculationInfoModal
          isOpen={isInfoModalOpen}
          onClose={closeInfoModal}
          data={{
            // calculatedAt: value.updated_At || new Date().toISOString(),
            scope: scope,
            category: value.Category,
            subCategory: value.Subcategory,
            activity: value.Activity,
            quantity: value.Quantity,
            unit: value.Unit,
            emissionFactorName: value.activity_id,
            emissionFactorValue: value.factor,
            unique_id: value.unique_id || "0",
          }}
          rowData={value}
        />
      </div>
    );
  }
);

export default EmissionWidget;
