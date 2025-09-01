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

  // Calculate base totals
  const baseEarlyTotal = costData.reduce((sum, item) => sum + item.early, 0);
  const baseLateTotal = costData.reduce((sum, item) => sum + item.late, 0);
  const baseSavings = baseLateTotal - baseEarlyTotal;

  // Calculate patient-specific costs based on risk tier
  const patientCosts = patients.map(patient => {
    // Risk multiplier: higher risk = higher costs
    const riskMultiplier = 0.4 + (patient.riskTier * 0.3); // Range: 0.7 to 1.9
    
    const earlyTotal = Math.round(baseEarlyTotal * riskMultiplier);
    const lateTotal = Math.round(baseLateTotal * riskMultiplier);
    const savings = lateTotal - earlyTotal;
    const savingsPercentage = ((savings / lateTotal) * 100).toFixed(1);
    
    return {
      ...patient,
      earlyTotal,
      lateTotal,
      savings,
      savingsPercentage
    };
  });

  // Calculate hospital totals
  const hospitalEarlyTotal = patientCosts.reduce((sum, patient) => sum + patient.earlyTotal, 0);
  const hospitalLateTotal = patientCosts.reduce((sum, patient) => sum + patient.lateTotal, 0);
  const hospitalSavings = hospitalLateTotal - hospitalEarlyTotal;
  const hospitalSavingsPercentage = ((hospitalSavings / hospitalLateTotal) * 100).toFixed(1);

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
      
      {/* Cost Breakdown Table */}
      
      {/* Patient Savings Table */}
     
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mt-10 mb-10 shadow-xl">
        
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30">
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Patient Name</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Risk Tier</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Early Cost ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Late Cost ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Savings ($)</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-purple-400">Savings (%)</th>
            </tr>
          </thead>
          <tbody>
            {patientCosts.map((patient, index) => (
              <tr key={patient.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{patient.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-2 rounded-xl text-sm font-bold border ${
                    patient.riskTier <= 2 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    patient.riskTier === 3 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                    patient.riskTier === 4 ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                    "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}>
                    {patient.riskTier}
                  </span>
                </td>
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
          <p className="text-3xl font-bold text-purple-400">75%</p>
          <p className="text-slate-300 mt-2">Lower complication rates</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-8 h-8 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Avg. Savings</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400">${Math.round(hospitalSavings / patients.length).toLocaleString()}</p>
          <p className="text-slate-300 mt-2">Per patient with early intervention</p>
        </div>
      </div>
    </div>
  );
}