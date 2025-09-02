export default function PatientTable({ data }) {
  if (!data || !data.predictedOutcomes) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-10">
        <h2 className="text-3xl font-bold text-white mb-2">Risk Stratification Results</h2>
        <p className="text-slate-300 mb-6">Patient ID: {data.patientId}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Primary Condition</p>
            <p className="text-purple-400 font-bold text-xl">
              {data.presentRiskCondition}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Overall Risk Score</p>
            <p className="text-amber-400 font-bold text-xl">
              {data.overallRiskScore}
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30">
                <th className="px-6 py-4 text-left text-base font-semibold text-purple-300">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-purple-300">
                  Risk Score
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-purple-300">
                  Risk Tier
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-purple-300">
                  Key Factors
                </th>
              </tr>
            </thead>
            <tbody>
              {data.predictedOutcomes.map((outcome, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {outcome.condition}
                  </td>
                  <td className="px-6 py-4 text-white">{outcome.riskScore}</td>
                  <td className="px-6 py-4 text-white">{outcome.riskTier}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {outcome.keyRiskFactors.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
