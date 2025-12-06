import React, { useState } from 'react';

const AnalyzerForm = ({ onAnalyze, isLoading }) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    funding: 10000,
    teamSize: 1,
    sector: 'FinTech',
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

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Startup Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sector Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry Sector</label>
          <input
            type="text"
            name="sector"
            placeholder="e.g., FinTech, AgriTech, Food"
            value={formData.sector}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Funding Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Funding ($)</label>
          <input
            type="number"
            name="funding"
            value={formData.funding}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="0"
          />
        </div>

        {/* Team Size Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="1"
          />
        </div>

        {/* Dropdowns for Market & Competition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Size</label>
            <select
              name="marketSize"
              value={formData.marketSize}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="Local">Local</option>
              <option value="Regional">Regional</option>
              <option value="National">National</option>
              <option value="Global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Competition</label>
            <select
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Idea 🚀'}
        </button>
      </form>
    </div>
  );
};

export default AnalyzerForm;