import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
import AnalyzerForm from '../components/AnalyzerForm';
import ResultsDashboard from '../components/ResultsDashboard';

const Analyzer = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Connect to your Flask Backend
      const response = await axios.post(`${API_BASE}/api/analyze`, formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the AI Engine. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Startup Feasibility Analyzer</h1>
          <p className="mt-2 text-lg text-gray-600">
            Get an AI-powered assessment of your startup idea in seconds.
          </p>
        </div>

        {/* Input Form */}
        <AnalyzerForm onAnalyze={handleAnalyze} isLoading={loading} />

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results Display */}
        <ResultsDashboard result={result} />
      </div>
    </div>
  );
};

export default Analyzer;