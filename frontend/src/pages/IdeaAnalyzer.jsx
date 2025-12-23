import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Sparkles, AlertCircle, Info } from 'lucide-react';

const IdeaAnalyzer = () => {
  const location = useLocation();
  const incomingData = location.state || {};

  const [formData, setFormData] = useState({
    startupName: incomingData.name || '', 
    industry: incomingData.industry || '',
    description: incomingData.solution || incomingData.description || '', 
    funding: 40,
    teamSize: 'Solo Founder',
    marketSize: 'Regional',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, funding: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
        // Points to the consolidated Flask API route
        const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData);
        setResult(response.data);
    } catch (err) {
        console.error(err);
        setError("CORS or Connection Error. Ensure Backend is running on port 5000.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-white">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center md:text-left">
        <div className="inline-block bg-blue-900/50 text-blue-300 border border-blue-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3">
           Gemini VC Analyst
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Startup Success Predictor</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Let AI analyze your business model, funding, and market fit to predict your success odds.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        
        {/* INPUT FORM */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Tell Us About Your Startup
            </h2>

            <div className="space-y-6">
                {/* Name and Industry */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Startup Name *</label>
                    <input 
                      type="text" 
                      name="startupName" 
                      value={formData.startupName} 
                      placeholder="e.g., SecureVault" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none transition-all" 
                      onChange={handleChange} 
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Industry Sector *</label>
                    <select 
                      name="industry" 
                      value={formData.industry}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                      onChange={handleChange}
                    >
                        <option value="">Select sector...</option>
                        <option value="AI">Artificial Intelligence</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Edtech">Edtech</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="AgriTech">AgriTech</option>
                        <option value="SAAS">SAAS</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Solution Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description}
                      placeholder="Describe your solution..." 
                      rows="3" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none" 
                      onChange={handleChange}
                    ></textarea>
                </div>

                {/* Funding */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-300">Initial Funding</label>
                        <span className="text-blue-400 font-bold">₹{formData.funding}.0L</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="1000" 
                      value={formData.funding} 
                      onChange={handleSliderChange} 
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                </div>

                {/* Team & Market */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Team Size</label>
                        <select 
                          name="teamSize" 
                          value={formData.teamSize}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Solo Founder</option>
                            <option>2-5 Employees</option>
                            <option>5-10 Employees</option>
                            <option>10+ Employees</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Target Market Size</label>
                        <select 
                          name="marketSize" 
                          value={formData.marketSize}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Regional</option>
                            <option>National (India)</option>
                            <option>Global</option>
                        </select>
                    </div>
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Analyzing..." : <><Sparkles size={20} /> Analyze My Idea</>}
                </button>

                {error && <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded border border-red-900">{error}</p>}
            </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
            <div className="bg-gray-800 text-white rounded-2xl shadow-2xl p-8 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Score Circle & Source Badge */}
                    <div className="text-center">
                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-gray-900 ${result.score > 70 ? 'border-emerald-500 text-emerald-400 shadow-emerald-900/40' : result.score > 40 ? 'border-yellow-500 text-yellow-400 shadow-yellow-900/40' : 'border-red-500 text-red-400 shadow-red-900/40'}`}>
                            {result.score}%
                        </div>
                        <p className="mt-2 text-gray-400 font-semibold tracking-wider uppercase text-sm mb-4">Probability</p>
                        
                        {/* THE NEW SOURCE BADGE */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                Analysis Source
                            </span>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                                result.source?.includes('Dataset') 
                                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' 
                                : 'bg-blue-900/20 border-blue-500/50 text-blue-400'
                            }`}>
                                {result.source || "Hybrid AI Engine"}
                            </span>
                        </div>
                    </div>

                    {/* Text Analysis */}
                    <div className="flex-1 w-full">
                        <h3 className="text-2xl font-bold mb-2 text-white">AI Verdict</h3>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{result.analysis}</p>
                        
                        <div className="bg-gray-700/50 p-5 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <Info size={18}/> Strategic Advice
                            </h4>
                            <ul className="space-y-4">
                                {result.recommendations && result.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">
                                        {/* Object vs String Guard */}
                                        {typeof rec === 'object' ? (
                                            <>
                                              <strong className="text-blue-300 block mb-1">
                                                {rec.title || "Strategic Insight"}:
                                              </strong>
                                              <span className="text-gray-300">{rec.tip || rec.content}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-300 flex gap-2">
                                                <span className="text-blue-500">•</span> {rec}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Footer Details */}
                        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                            <span>Method: Random Forest Classifier</span>
                            <span>Model Status: Active</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default IdeaAnalyzer;