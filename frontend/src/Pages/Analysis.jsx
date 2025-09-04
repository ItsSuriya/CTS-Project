import React, { useState } from "react";
import { DemoBackgroundPaths } from "../components/AnalysisHero";
import CSVUploadComponent from "../components/Upload";
import PatientTable from "../components/PatientTable";
import RoiTable from "../components/RoiTable";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import { ParallaxFooter } from "@/components/Footer";
import ScrollToTop from "@/components/ui/scrolltotop";

const Analysis = () => {
  const [showRoiTable, setShowRoiTable] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [roiData, setRoiData] = useState([]);

  const toggleRoiTable = () => {
    setShowRoiTable(!showRoiTable);
  };

  const handleAnalysis = (analysisData) => {
    setPredictions(analysisData.predictions || []);
    setRoiData(analysisData.roiReport || []);
  };

  return (
    <div>
      <ScrollToTop />
      <DemoBackgroundPaths />
      <CSVUploadComponent onAnalysis={handleAnalysis} />

      {/* Show Patient Table if predictions exist */}
      {predictions.length > 0 && (
        <>
          <PatientTable patients={predictions} />

          {/* Show Toggle Button only after PatientTable is displayed */}
          <div className="flex justify-center my-6">
            <button
              onClick={toggleRoiTable}
              className="flex items-center gap-2 px-6 py-3 rounded-[1.15rem] text-lg font-semibold 
                         bg-gradient-to-r from-emerald-500 to-blue-500 
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
          {showRoiTable && <RoiTable roiData={roiData} />}
        </>
      )}

      <ParallaxFooter />
    </div>
  );
};

export default Analysis;