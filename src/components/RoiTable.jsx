import React from 'react';
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

export default function ROICalculator() {
  // Sample patient data with risk tiers
  const patients = [
    { id: 1, name: "John Smith", riskTier: 5 },
    { id: 2, name: "Alex Johnson", riskTier: 2 },
    { id: 3, name: "Sarah Wilson", riskTier: 4 },
    { id: 4, name: "Michael Brown", riskTier: 3 },
    { id: 5, name: "Emma Davis", riskTier: 1 }
  ];

  // Base cost data
  const costData = [
    { category: "Initial Consultation", early: 250, late: 250 },
    { category: "Diagnostic Tests", early: 800, late: 1200 },
    { category: "Preventive Medication", early: 180, late: 450 },
    { category: "Regular Monitoring", early: 400, late: 800 },
    { category: "Emergency Interventions", early: 0, late: 3500 },
    { category: "Hospitalization", early: 0, late: 12000 },
    { category: "Surgical Procedures", early: 0, late: 25000 },
    { category: "Rehabilitation & Recovery", early: 500, late: 2800 }
  ];

  // Calculate totals
  const baseEarlyTotal = costData.reduce((sum, item) => sum + item.early, 0);
  const baseLateTotal = costData.reduce((sum, item) => sum + item.late, 0);

  const patientCosts = patients.map(patient => {
    const riskMultiplier = 0.4 + (patient.riskTier * 0.3);
    const earlyTotal = Math.round(baseEarlyTotal * riskMultiplier);
    const lateTotal = Math.round(baseLateTotal * riskMultiplier);
    const savings = lateTotal - earlyTotal;
    const savingsPercentage = ((savings / lateTotal) * 100).toFixed(1);

    return { ...patient, earlyTotal, lateTotal, savings, savingsPercentage };
  });

  const hospitalEarlyTotal = patientCosts.reduce((sum, p) => sum + p.earlyTotal, 0);
  const hospitalLateTotal = patientCosts.reduce((sum, p) => sum + p.lateTotal, 0);
  const hospitalSavings = hospitalLateTotal - hospitalEarlyTotal;
  const hospitalSavingsPercentage = ((hospitalSavings / hospitalLateTotal) * 100).toFixed(1);

  return (
    <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-10 shadow-2xl mt-10 mb-10">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
            ROI Analysis
          </h2>
          <p className="text-slate-700">Early vs Late Treatment Cost Comparison</p>
        </div>
      </div>

      {/* Patient Savings Table */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden mb-10 shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-cyan-100">
              {["Patient Name", "Risk Tier", "Early Cost ($)", "Late Cost ($)", "Savings ($)", "Savings (%)"].map((head, i, arr) => (
                <th
                  key={head}
                  className={`px-6 py-4 text-left text-base font-semibold text-slate-800 border-b border-emerald-300 ${
                    i !== arr.length - 1 ? "border-r border-emerald-200/50" : ""
                  }`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patientCosts.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-emerald-50 transition-colors"
              >
                <td className="px-6 py-4 text-slate-800 font-medium border-b border-r border-slate-200/50">{patient.name}</td>
                <td className="px-6 py-4 border-b border-r border-slate-200/50">
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${
                    patient.riskTier <= 2 ? "bg-emerald-100 text-emerald-700 border-emerald-300" :
                    patient.riskTier === 3 ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                    patient.riskTier === 4 ? "bg-orange-100 text-orange-700 border-orange-300" :
                    "bg-red-100 text-red-700 border-red-300"
                  }`}>
                    {patient.riskTier}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-800 font-semibold border-b border-r border-slate-200/50">
                  ${patient.earlyTotal.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-red-600 font-semibold border-b border-r border-slate-200/50">
                  ${patient.lateTotal.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-emerald-600 font-semibold border-b border-r border-slate-200/50">
                  ${patient.savings.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-emerald-600 font-semibold border-b border-slate-200/50">
                  {patient.savingsPercentage}%
                </td>
              </tr>
            ))}
            {/* Hospital Total */}
            <tr className="bg-gradient-to-r from-emerald-50 to-cyan-50 font-bold text-lg">
              <td className="px-6 py-5 text-slate-800 border-r border-slate-200/50" colSpan={2}>HOSPITAL TOTAL</td>
              <td className="px-6 py-5 text-slate-800 border-r border-slate-200/50">${hospitalEarlyTotal.toLocaleString()}</td>
              <td className="px-6 py-5 text-red-600 border-r border-slate-200/50">${hospitalLateTotal.toLocaleString()}</td>
              <td className="px-6 py-5 text-emerald-600 border-r border-slate-200/50">${hospitalSavings.toLocaleString()}</td>
              <td className="px-6 py-5 text-emerald-600">{hospitalSavingsPercentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-100 border border-emerald-200 rounded-2xl p-6 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-800">Total Savings</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">${hospitalSavings.toLocaleString()}</p>
          <p className="text-slate-600 mt-2">Hospital-wide with early intervention</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 border border-cyan-200 rounded-2xl p-6 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-7 h-7 text-cyan-600" />
            <h3 className="text-lg font-semibold text-slate-800">Cost Reduction</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-600">{hospitalSavingsPercentage}%</p>
          <p className="text-slate-600 mt-2">Reduction in treatment costs</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-emerald-100 border border-blue-200 rounded-2xl p-6 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-7 h-7 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">Risk Reduction</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">75%</p>
          <p className="text-slate-600 mt-2">Lower complication rates</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-cyan-100 border border-emerald-200 rounded-2xl p-6 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-800">Avg. Savings</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            ${Math.round(hospitalSavings / patients.length).toLocaleString()}
          </p>
          <p className="text-slate-600 mt-2">Per patient with early intervention</p>
        </div>
      </div>
    </div>
  );
}