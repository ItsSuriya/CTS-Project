import React from 'react';
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

export default function RoiTable({ roiData }) {

  if (!roiData || roiData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-10 mb-10">
        <div className="text-center">
          <p className="text-slate-400 text-sm">No ROI data to display. Upload a CSV file to see the analysis.</p>
        </div>
      </div>
    );
  }

  const patientCosts = roiData.flatMap(patient => {
    if (!patient.predictedCosts || patient.predictedCosts.length === 0) {
      return []; // Return an empty array to be filtered out by flatMap
    }
    return patient.predictedCosts.map(costs => {
        const earlyTotal = costs.predicted_proactive_cost || 0;
        const lateTotal = costs.predicted_reactive_cost || 0;
        const savings = costs.potential_savings || 0;
        const savingsPercentage = lateTotal > 0 ? ((savings / lateTotal) * 100).toFixed(1) : 0;

        return {
          id: `${patient.patientId}-${costs.condition}`,
          name: patient.patientId,
          condition: costs.condition || 'N/A',
          earlyTotal,
          lateTotal,
          savings,
          savingsPercentage,
          riskScore: costs.riskScore || 0,
        };
    });
  });

  // Calculate hospital totals
  const hospitalEarlyTotal = patientCosts.reduce((sum, patient) => sum + patient.earlyTotal, 0);
  const hospitalLateTotal = patientCosts.reduce((sum, patient) => sum + patient.lateTotal, 0);
  const hospitalSavings = hospitalLateTotal - hospitalEarlyTotal;
  const hospitalSavingsPercentage = hospitalLateTotal > 0 ? ((hospitalSavings / hospitalLateTotal) * 100).toFixed(1) : 0;

  const averageRiskReduction = patientCosts.length > 0
    ? (patientCosts.reduce((sum, cost) => sum + cost.riskScore, 0) / patientCosts.length) * 100
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-10 mb-10 ">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-purple-500 bg-clip-text">ROI Analysis</h2>
          <p className="text-slate-300">Early vs Late Treatment Cost Comparison</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mt-10 mb-10 shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30">
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Patient ID</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Condition</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Proactive Cost ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Reactive Cost ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Potential Savings ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Savings (%)</th>
            </tr>
          </thead>
          <tbody>
            {patientCosts.map((patient) => (
              <tr key={patient.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{patient.name}</td>
                <td className="px-6 py-4 text-white">{patient.condition}</td>
                <td className="px-6 py-4 text-white font-semibold">${patient.earlyTotal.toLocaleString()}</td>
                <td className="px-6 py-4 text-red-400 font-semibold">${patient.lateTotal.toLocaleString()}</td>
                <td className="px-6 py-4 text-green-400 font-semibold">${patient.savings.toLocaleString()}</td>
                <td className="px-6 py-4 text-green-400 font-semibold">{patient.savingsPercentage}%</td>
              </tr>
            ))}
            {/* Hospital Total Row */}
            <tr className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 font-bold text-lg">
              <td className="px-6 py-5 text-white" colSpan="2">HOSPITAL TOTAL</td>
              <td className="px-6 py-5 text-white">${hospitalEarlyTotal.toLocaleString()}</td>
              <td className="px-6 py-5 text-red-400">${hospitalLateTotal.toLocaleString()}</td>
              <td className="px-6 py-5 text-green-400">${hospitalSavings.toLocaleString()}</td>
              <td className="px-6 py-5 text-green-400">{hospitalSavingsPercentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold text-white">Total Savings</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">${hospitalSavings.toLocaleString()}</p>
          <p className="text-slate-300 mt-2">Hospital-wide with early intervention</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Cost Reduction</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{hospitalSavingsPercentage}%</p>
          <p className="text-slate-300 mt-2">Reduction in treatment costs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Risk Reduction</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{averageRiskReduction.toFixed(1)}%</p>
          <p className="text-slate-300 mt-2">Lower complication rates</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-8 h-8 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Avg. Savings</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400">${roiData.length > 0 ? Math.round(hospitalSavings / roiData.length).toLocaleString() : 0}</p>
          <p className="text-slate-300 mt-2">Per patient with early intervention</p>
        </div>
      </div>
    </div>
  );
}