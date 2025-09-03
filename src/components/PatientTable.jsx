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
    if (risk <= 2) return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
    if (risk === 3) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    if (risk === 4) return "bg-orange-500/20 text-orange-500 border-orange-500/30";
    return "bg-red-500/20 text-red-500 border-red-500/30";
  };

  const getBpColor = (bp) => {
    if (bp < 120) return "text-cyan-500";
    if (bp < 140) return "text-yellow-500";
    return "text-red-500";
  };

  const getBooleanText = (value) => (value ? "Yes" : "No");
  const getBooleanColor = (value) => (value ? "text-red-500" : "text-emerald-500");

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-600 font-medium">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500 font-semibold mb-2">Error loading patient data</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <p className="text-slate-400 text-xs mt-2">Make sure your FastAPI server is running on port 8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
          Patient Health Dashboard
        </h2>
      </div>

      {/* Scrollable container */}
      <div className="overflow-auto flex-grow rounded-2xl border border-white/20">
  <table className="w-full text-sm min-w-max border-collapse">
    <thead>
      <tr className="bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 backdrop-blur-md sticky top-0 z-10">
        {[
          "Age/Sex", "Location", "Insurance", "Income", "Employment",
          "Hospital Visits", "Conditions", "BP", "HbA1c", "BMI",
          "ER Visits", "Readmissions", "Mental Health", "Risk Score"
        ].map((head, i, arr) => (
          <th
            key={head}
            className={`px-3 py-4 text-left font-bold text-emerald-600 border-b ${
              i !== arr.length - 1 ? "border-r " : ""
            }border-emerald-400/30`}
          >
            {head}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {patients.map((patient, index) => (
        <tr
          key={patient.id}
          className={`transition-all duration-300 ${
            index % 2 === 0 ? "bg-white/5 hover:bg-emerald-500/10" : "hover:bg-cyan-500/10"
          }`}
        >
          <td className="px-3 py-4 text-slate-900 font-semibold bg-white/40   left-0 border-b border-cyan-400/20 border-r">
            {patient.age}/{patient.sex}
          </td>
          <td className="px-3 py-4 text-slate-700 text-xs border-b border-cyan-400/20 border-r">
            {patient.state} ({patient.urbanicity})
          </td>
          <td className="px-3 py-4 text-slate-700 text-xs border-b border-cyan-400/20 border-r ">
            {patient.insurance_type}
          </td>
          <td className="px-3 py-4 text-slate-700 text-xs border-b border-cyan-400/20 border-r ">
            {patient.income_bracket}
          </td>
          <td className="px-3 py-4 text-slate-700 text-xs border-b border-cyan-400/20 border-r ">
            {patient.employment_status}
          </td>
          <td className="px-3 py-4 text-slate-700 text-center border-b border-cyan-400/20 border-r ">
            {patient.hospital_visits_past_year}
            <div className="text-xs text-gray-500">{patient.days_since_last_visit}d ago</div>
          </td>
          <td className="px-3 py-4 text-xs border-b border-cyan-400/20 border-r ">
            <div className={getBooleanColor(patient.has_diabetes)}>D: {getBooleanText(patient.has_diabetes)}</div>
            <div className={getBooleanColor(patient.has_hypertension)}>H: {getBooleanText(patient.has_hypertension)}</div>
            <div className={getBooleanColor(patient.has_heart_disease)}>HD: {getBooleanText(patient.has_heart_disease)}</div>
          </td>
          <td className="px-3 py-4 border-b border-cyan-400/20 border-r ">
            <span className={`font-semibold ${getBpColor(patient.blood_pressure_systolic)}`}>
              {patient.blood_pressure_systolic}
            </span>
          </td>
          <td className="px-3 py-4 border-b border-cyan-400/20 border-r ">
            <span className={`font-semibold ${patient.hba1c_level > 6.5 ? 'text-red-500' : 'text-emerald-500'}`}>
              {patient.hba1c_level}
            </span>
          </td>
          <td className="px-3 py-4 border-b border-cyan-400/20 border-r ">
            <span className={`font-semibold ${patient.bmi > 30 ? 'text-red-500' : patient.bmi > 25 ? 'text-yellow-500' : 'text-emerald-500'}`}>
              {patient.bmi}
            </span>
          </td>
          <td className="px-3 py-4 text-center border-b border-cyan-400/20 border-r">
            {patient.emergency_room_visits}
            <div className="text-xs text-gray-500">Missed: {patient.missed_appointments}</div>
          </td>
          <td className="px-3 py-4 text-center border-b border-cyan-400/20 border-r ">
            {patient.readmissions_30d}
            <div className="text-xs text-gray-500">Care Gaps: {patient.care_gaps_count}</div>
          </td>
          <td className="px-3 py-4 text-xs border-b border-cyan-400/20 border-r ">
            {patient.mental_health_condition ? 'Yes' : 'No'}
            {patient.depression_screen_score > 0 && (
              <div className="text-gray-500">Score: {patient.depression_screen_score}</div>
            )}
          </td>
          <td className="px-3 py-4 border-b border-cyan-400/20">
            <span className={`px-3 py-2 rounded-xl text-sm font-bold border ${getRiskColor(
              Math.min(5, Math.max(1,
                Math.floor(
                  (patient.has_diabetes + patient.has_hypertension + patient.has_heart_disease) +
                  (patient.emergency_room_visits / 2) +
                  (patient.readmissions_30d * 2) +
                  (patient.hba1c_level > 7 ? 1 : 0) +
                  (patient.blood_pressure_systolic > 140 ? 1 : 0)
                )
              ))
            )}`}>
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