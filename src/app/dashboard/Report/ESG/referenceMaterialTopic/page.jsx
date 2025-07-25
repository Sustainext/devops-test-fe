"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import Section1 from './sections/section1'
import {
  setConclusion,
} from "../../../../../lib/redux/features/ESGSlice/screen15Slice";

const ReferenceMaterialTopic =forwardRef(({ onSubmitSuccess,reportType,hasChanges }, ref) => {
    const orgName =
    typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  const reportid =
    typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  const apiCalledRef = useRef(false);
  const [activeSection, setActiveSection] = useState("section16");
  const section16Ref = useRef(null);
  const [data, setData] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const [initialData, setInitialData] = useState({});
  
  const conclusion = useSelector((state) => state.screen15Slice.conclusion);
  
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    submitForm,
  }));

  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };

  const currentData={
    conclusion
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data = {
      conclusion: {
        page: "screen_fifteen",
        label: "Conclusion",
        subLabel: "Add a conclusion to the report",
        type: "richTextarea",
        content: conclusion,
        field: "conclusion",
        isSkipped: false,
      },
    };

    const url = `${process.env.BACKEND_API_URL}/esg_report/select_materials_topic/${reportid}/`;
    try {
      const response = await axiosInstance.put(url, data);

      if (response.status === 200) {
        if (type == "last") {
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
        }

        if (onSubmitSuccess) {
          onSubmitSuccess(true); // Notify the parent of successful submission
        }
        LoaderClose();
        return true;
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
        return false;
      }
    } catch (error) {
      LoaderClose();
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
      return false; // Indicate failure
    }
  };

  const loadFormData = async () => {
    LoaderOpen();
    dispatch(setConclusion(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/select_materials_topic/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        const flatData = {};
  Object.keys(response.data).forEach((key) => {
    flatData[key] = response.data[key]?.content || "";
  });

  setInitialData(flatData);
        setData(response.data);
        dispatch(setConclusion(response.data.conclusion?.content || ""));
        }

      LoaderClose();
    } catch (error) {
      console.error("API call failed:", error);
      LoaderClose();
    }
  };

  useEffect(() => {
    // Ensure API is only called once
    if (!apiCalledRef.current && reportid) {
      apiCalledRef.current = true; // Set the flag to true to prevent future calls
      loadFormData(); // Call the API only once
    }
  }, [reportid]);

    return (
        <div>
            <div className="mx-2 p-2">
        <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
          16. Management of Material Topic
        </h3>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
            <Section1 section16Ref={section16Ref} orgName={orgName} data={data} />
            {/* <Section2
              section16Ref={section16Ref}
              orgName={orgName}
              data={data}
            /> */}
          </div>
          {/* page sidebar */}

          <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  md:top-[19rem]
  md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
            <p className="text-[11px] text-[#727272] mb-2 uppercase">
            16. Management of Material Topic
            </p>
           
          </div>
        </div>
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
    )
})

export default ReferenceMaterialTopic