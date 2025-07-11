"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/axiosMiddleware";
import AnalyseHeader7 from "../../AnalyseHeader7";
import Section from "./section";

const AnalyseEmployment = ({ isBoxOpen }) => {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedCorp, setSelectedCorp] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [togglestatus, setToggleStatus] = useState("Organization");
  return (
    <>
      <AnalyseHeader7
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        setToggleStatus={setToggleStatus}
      />
      <Section
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        dateRange={dateRange}
        selectedLocation={selectedLocation}
        isBoxOpen={isBoxOpen}
        togglestatus={togglestatus}
      />
    </>
  );
};

export default AnalyseEmployment;
