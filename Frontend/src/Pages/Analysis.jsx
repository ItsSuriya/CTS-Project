import React, { useState } from "react";
import Upload from "../components/Upload";
import PatientTable from "../components/PatientTable";
import RoiTable from "../components/RoiTable";

export default function Analysis() {
  const [predictionData, setPredictionData] = useState(null);

  const handleUploadSuccess = (data) => {
    setPredictionData(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Healthcare Cost Analysis</h1>
      <Upload onUploadSuccess={handleUploadSuccess} />

      {predictionData && (
        <div className="animate-fade-in">
          <PatientTable data={predictionData.risk_stratification_result} />
          <RoiTable data={predictionData.roi_prediction_result} />
        </div>
      )}
    </div>
  );
}
