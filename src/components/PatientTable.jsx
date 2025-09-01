import React, { useState, useEffect } from 'react';

export default function PatientTable() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from FastAPI
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/patients');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patient data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getRiskColor = (risk) => {
    if (risk <= 2) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (risk === 3) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (risk === 4) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getBpColor = (bp) => {
    if (bp < 120) return "text-cyan-400";
    if (bp < 140) return "text-yellow-400";
    return "text-red-400";
  };

  const getStateColor = (state) => {
    if (state === 'Critical' || state === 'High') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (state === 'Monitoring' || state === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getBooleanText = (value) => {
    return value ? "Yes" : "No";
  };

  const getBooleanColor = (value) => {
    return value ? "text-red-400" : "text-emerald-400";
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="bg-gradient-to-r from-purple-500 to-pink-500">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-300 mb-2">Error loading patient data</p>
          <p className="text-slate-400 text-sm">{error}</p>
          <p className="text-slate-500 text-xs mt-2">Make sure your FastAPI server is running on port 8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-purple-500">Patient Health Dashboard</h2>
      </div>
      
      {/* Scrollable container for the table */}
      <div className="overflow-auto flex-grow rounded-2xl border border-white/10">
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 sticky top-0 z-10">
              <th className="px-3 py-4 text-left font-bold text-purple-400 sticky left-0 bg-slate-700/95 z-20">Age/Sex</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Location</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Insurance</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Income</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Employment</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Hospital Visits</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Conditions</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">BP</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">HbA1c</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">BMI</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">ER Visits</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Readmissions</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Mental Health</th>
              <th className="px-3 py-4 text-left font-bold text-purple-400">Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id} className={`border-b border-white/10 hover:bg-gradient-to-r hover:from-white/5 hover:to-blue-500/5 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>
                <td className="px-3 py-4 text-white font-semibold sticky left-0 bg-black/30 z-10 backdrop-blur-sm">
                  {patient.age}/{patient.sex}
                </td>
                <td className="px-3 py-4 text-slate-200 text-xs">
                  {patient.state} ({patient.urbanicity})
                </td>
                <td className="px-3 py-4 text-slate-200 text-xs">{patient.insurance_type}</td>
                <td className="px-3 py-4 text-slate-200 text-xs">{patient.income_bracket}</td>
                <td className="px-3 py-4 text-slate-200 text-xs">{patient.employment_status}</td>
                <td className="px-3 py-4 text-slate-200 text-center">
                  {patient.hospital_visits_past_year}
                  <div className="text-xs text-gray-400">{patient.days_since_last_visit}d ago</div>
                </td>
                <td className="px-3 py-4 text-slate-200 text-xs">
                  <div className={getBooleanColor(patient.has_diabetes)}>D: {getBooleanText(patient.has_diabetes)}</div>
                  <div className={getBooleanColor(patient.has_hypertension)}>H: {getBooleanText(patient.has_hypertension)}</div>
                  <div className={getBooleanColor(patient.has_heart_disease)}>HD: {getBooleanText(patient.has_heart_disease)}</div>
                </td>
                <td className="px-3 py-4">
                  <span className={`font-semibold ${getBpColor(patient.blood_pressure_systolic)}`}>
                    {patient.blood_pressure_systolic}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <span className={`font-semibold ${patient.hba1c_level > 6.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {patient.hba1c_level}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <span className={`font-semibold ${patient.bmi > 30 ? 'text-red-400' : patient.bmi > 25 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {patient.bmi}
                  </span>
                </td>
                <td className="px-3 py-4 text-slate-200 text-center">
                  {patient.emergency_room_visits}
                  <div className="text-xs text-gray-400">Missed: {patient.missed_appointments}</div>
                </td>
                <td className="px-3 py-4 text-slate-200 text-center">
                  {patient.readmissions_30d}
                  <div className="text-xs text-gray-400">Care Gaps: {patient.care_gaps_count}</div>
                </td>
                <td className="px-3 py-4 text-slate-200 text-xs">
                  {patient.mental_health_condition ? 'Yes' : 'No'}
                  {patient.depression_screen_score > 0 && (
                    <div className="text-gray-400">Score: {patient.depression_screen_score}</div>
                  )}
                </td>
                <td className="px-3 py-4">
                  {/* Calculate a simple risk score based on multiple factors */}
                  <span className={`px-3 py-2 rounded-xl text-sm font-bold border ${getRiskColor(
                    Math.min(5, Math.max(1, 
                      Math.floor(
                        (patient.has_diabetes + patient.has_hypertension + patient.has_heart_disease) +
                        (patient.emergency_room_visits / 2) +
                        (patient.readmissions_30d * 2) +
                        (patient.hba1c_level > 7 ? 1 : 0) +
                        (patient.blood_pressure_systolic > 140 ? 1 : 0)
                      )
                    )
                  ))}`}>
                    {Math.min(5, Math.max(1, 
                      Math.floor(
                        (patient.has_diabetes + patient.has_hypertension + patient.has_heart_disease) +
                        (patient.emergency_room_visits / 2) +
                        (patient.readmissions_30d * 2) +
                        (patient.hba1c_level > 7 ? 1 : 0) +
                        (patient.blood_pressure_systolic > 140 ? 1 : 0)
                      )
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}