import React from 'react';

export default function PatientTable({ patients }) {

  const getRiskTierColor = (tier) => {
    if (!tier) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    if (tier.includes("High")) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (tier.includes("Moderate")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (tier.includes("Low")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-sm">No patient data to display. Upload a CSV file to see the predictions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-purple-500">Prediction Results</h2>
      </div>
      
      <div className="overflow-auto flex-grow rounded-2xl border border-white/10">
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 sticky top-0 z-10">
              <th className="px-4 py-3 text-left font-bold text-purple-300">Patient ID</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Age</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Location</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Income</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Employment</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Hospital Visits (2yr)</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Primary Condition</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Risk Score</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Risk Tier</th>
              <th className="px-4 py-3 text-left font-bold text-purple-300">Key Risk Factors</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pred, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                <td className="px-4 py-3 text-slate-200 font-medium">{pred.patientId}</td>
                <td className="px-4 py-3 text-slate-200">{pred.age}</td>
                <td className="px-4 py-3 text-slate-200">{pred.location}</td>
                <td className="px-4 py-3 text-slate-200">{pred.income}</td>
                <td className="px-4 py-3 text-slate-200">{pred.employment}</td>
                <td className="px-4 py-3 text-slate-200">{pred.hospital_visit}</td>
                <td className="px-4 py-3 text-slate-200">{pred.primary_condition}</td>
                <td className="px-4 py-3 text-slate-200 font-semibold">{pred.risk_score}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getRiskTierColor(pred.risk_tier)}`}>
                    {pred.risk_tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs">{(pred.key_risk_factors || []).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}