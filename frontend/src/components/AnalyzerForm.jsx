import React, { useState } from 'react';

const AnalyzerForm = ({ onAnalyze, isLoading }) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    funding: 10000,
    teamSize: 1,
    sector: '',
    marketSize: 'National',
    competition: 'Medium',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData); // Send data to parent component
  };

  // Reusable styling for all inputs and selects
  const inputClasses = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors";

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Enter Startup Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sector Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Industry Sector</label>
          <input
            type="text"
            name="sector"
            placeholder="e.g., FinTech, AgriTech, Food"
            value={formData.sector}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Funding Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Initial Funding ($)</label>
          <input
            type="number"
            name="funding"
            value={formData.funding}
            onChange={handleChange}
            className={inputClasses}
            min="0"
            required
          />
        </div>

        {/* Team Size Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Team Size</label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className={inputClasses}
            min="1"
            required
          />
        </div>

        {/* Dropdowns for Market & Competition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Market Size</label>
            <select
              name="marketSize"
              value={formData.marketSize}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Local">Local</option>
              <option value="Regional">Regional</option>
              <option value="National">National</option>
              <option value="Global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Competition</label>
            <select
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Idea 🚀'}
        </button>
      </form>
    </div>
  );
};

export default AnalyzerForm;