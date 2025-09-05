import React, { useState } from "react";
import { DemoBackgroundPaths } from "../components/AnalysisHero";
import CSVUploadComponent from "../components/Upload";
import PatientTable from "../components/PatientTable";
import RoiTable from "../components/RoiTable";
import { Eye, EyeOff } from "lucide-react"; 
import { ParallaxFooter } from "@/components/Footer";
import ScrollToTop from "@/components/ui/scrolltotop";
import { generatePDF } from "../utils/pdfGenerator"; // ✅ import utility

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

  const handleGeneratePDF = () => {
    generatePDF(predictions, roiData);
  };

  return (
    <div>
      <ScrollToTop />
      <DemoBackgroundPaths />
      <CSVUploadComponent onAnalysis={handleAnalysis} />

      {predictions.length > 0 && (
        <>
          <PatientTable patients={predictions} />

          <div className="flex justify-center my-6 gap-4">
            {/* ROI Toggle Button */}
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

            {/* Generate PDF Button */}
            {(predictions.length > 0 || roiData.length > 0) && (
              <button
                onClick={handleGeneratePDF}
                className="flex items-center gap-2 px-6 py-3 rounded-[1.15rem] text-lg font-semibold 
                           bg-gradient-to-r from-green-500 to-indigo-500 
                           text-white transition-all duration-300 
                           hover:scale-105 border border-white/20
                           shadow-lg"
              >
                📄 Generate PDF
              </button>
            )}
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