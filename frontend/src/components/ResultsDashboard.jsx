import React from 'react';

const ResultsDashboard = ({ result }) => {
  if (!result) return null; // Don't show anything if there is no result yet

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-8 animate-fade-in">
      {/* Score Section */}
      <div className="text-center mb-8">
        <h3 className="text-gray-500 text-lg uppercase tracking-wide font-semibold">Success Probability</h3>
        <div className={`text-6xl font-extrabold my-2 ${getScoreColor(result.success_probability)}`}>
          {result.success_probability}%
        </div>
        <p className="text-gray-400 text-sm">Based on historical data analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Risks Section */}
        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
          <h4 className="flex items-center text-xl font-bold text-red-700 mb-4">
            ⚠️ Identified Risks
          </h4>
          <ul className="space-y-3">
            {result.risks.map((risk, index) => (
              <li key={index} className="flex items-start text-red-800">
                <span className="mr-2">•</span> {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations Section */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h4 className="flex items-center text-xl font-bold text-blue-700 mb-4">
            💡 Recommendations
          </h4>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <span className="mr-2">✓</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;