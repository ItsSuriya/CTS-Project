import React, { useState } from "react";
import { DemoBackgroundPaths } from "../components/AnalysisHero";
import CSVUploadComponent from "../components/Upload";
import PatientTable from "../components/PatientTable";
import RoiTable from "../components/RoiTable";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import { ParallaxFooter } from "@/components/Footer";

const Analysis = () => {
  const [showRoiTable, setShowRoiTable] = useState(false);

  const toggleRoiTable = () => {
    setShowRoiTable(!showRoiTable);
  };

  return (
    <div>
      <DemoBackgroundPaths />
      <CSVUploadComponent />
      <PatientTable />
      
      {/* Toggle Button */}
      <div className="flex justify-center my-6">
        <button
          onClick={toggleRoiTable}
          className="flex items-center gap-2 px-6 py-3 rounded-[1.15rem] text-lg font-semibold 
                   bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white transition-all duration-300 
                   hover:scale-105 border border-white/20
                   shadow-lg"
        >
          {showRoiTable ? (
            <>
              <EyeOff className="w-5 h-5" />
              Hide ROI Analysis
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Show ROI Analysis
            </>
          )}
        </button>
      </div>

      {/* Conditionally render ROI Table */}
      {showRoiTable && <RoiTable />}
      <ParallaxFooter />
    </div>
    
  );
};

export default Analysis;