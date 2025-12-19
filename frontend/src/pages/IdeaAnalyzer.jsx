import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

const IdeaAnalyzer = () => {
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    description: '',
    funding: 40,
    teamSize: 'Solo Founder',
    marketSize: 'Regional',
    businessModel: 'Subscription',
    locationCritical: 'No - Fully online/remote',
    competitors: ''
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
        const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData);
        setResult(response.data);
    } catch (err) {
        console.error(err);
        setError("Could not connect to the server. Ensure Backend is running on port 5000.");
    } finally {
        setLoading(false);
    }
  };

  return (
    // Updated to match project Dark Theme (bg-gray-900)
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-white">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center md:text-left">
        <div className="inline-block bg-blue-900/50 text-blue-300 border border-blue-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3">
          🤖 Success Predictor
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Startup Success Analyzer</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Get data-driven insights on your startup’s probability of success.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        
        {/* INPUT FORM - Dark Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Tell Us About Your Startup
            </h2>

            <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Startup Name *</label>
                    <input 
                      type="text" 
                      name="startupName" 
                      placeholder="e.g., SecureVault" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      onChange={handleChange} 
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Industry Sector *</label>
                    <select 
                      name="industry" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                      onChange={handleChange}
                    >
                        <option value="">Select sector...</option>
                        <option value="AI">Artificial Intelligence</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Edtech">Edtech</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Solution Description</label>
                    <textarea 
                      name="description" 
                      placeholder="Describe your solution..." 
                      rows="3" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none" 
                      onChange={handleChange}
                    ></textarea>
                </div>

                {/* Funding Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-300">Initial Funding</label>
                        <span className="text-blue-400 font-bold">₹{formData.funding}.0L</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
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
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Solo Founder</option>
                            <option>2-5 Employees</option>
                            <option>5-10 Employees</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Target Market Size</label>
                        <select 
                          name="marketSize" 
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Regional</option>
                            <option>National (India)</option>
                            <option>Global</option>
                        </select>
                    </div>
                </div>

                {/* Button */}
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

        {/* RESULTS SECTION - Adjusted for Dark Mode */}
        {result && (
            <div className="bg-gray-800 text-white rounded-2xl shadow-2xl p-8 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Score Circle */}
                    <div className="text-center">
                        <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-gray-900">
                            {result.score}%
                        </div>
                        <p className="mt-2 text-emerald-400 font-semibold tracking-wider uppercase text-sm">Success Probability</p>
                    </div>

                    {/* Text Analysis */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-white">Analysis Report</h3>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{result.analysis}</p>
                        
                        <div className="bg-gray-700/50 p-5 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-bold text-yellow-500 mb-3 flex items-center gap-2"><AlertCircle size={18}/> Recommendations</h4>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></span> 
                                        {rec}
                                    </li>
                                ))}
                            </ul>
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