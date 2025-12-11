import React, { useState } from 'react';
import axios from 'axios';

const IdeaAnalyzer = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!idea) return alert("Please enter a startup idea!");

    setLoading(true);
    setResult(null);

    try {
      // Make sure this endpoint matches your backend route for feasibility analysis
      const res = await axios.post('http://127.0.0.1:5000/api/analyze', { idea });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing idea. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          🚀 Startup Feasibility Analyzer
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Enter your startup idea and let AI evaluate its potential.
        </p>

        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl mb-8">
          <textarea
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none h-32"
            placeholder="e.g., An AI-powered app that connects farmers directly with consumers..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          ></textarea>
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 py-3 rounded-lg font-bold text-white transition-all shadow-lg"
          >
            {loading ? "Analyzing with Gemini AI..." : "🔍 Analyze Viability"}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Score Card */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Viability Score</h3>
                <p className="text-gray-400">Based on market, tech, and competition</p>
              </div>
              <div className="text-4xl font-bold text-green-400 border-4 border-green-400 rounded-full w-24 h-24 flex items-center justify-center">
                {result.score}/100
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-400 mb-2">✅ Strengths</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{result.strengths}</p>
              </div>
              
              <div className="bg-gray-800 p-5 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-red-400 mb-2">⚠️ Weaknesses</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{result.weaknesses}</p>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
              <h4 className="font-bold text-blue-300 mb-2">💡 Gemini's Verdict</h4>
              <p className="text-gray-200 italic">"{result.verdict}"</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaAnalyzer;