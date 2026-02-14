import React, { useState } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingUp, Users, Calculator, Activity, Sparkles } from 'lucide-react';

const ValuationTool = () => {
  const [industry, setIndustry] = useState('');
  const [revenue, setRevenue] = useState('');
  const [growth, setGrowth] = useState('');
  const [users, setUsers] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);

  // NEW: Function to ask AI for numbers
  const autoEstimate = async () => {
    if (!industry) return alert("Please enter an Industry first (e.g. EdTech)");
    setEstimating(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/estimate_metrics', { industry });
      setRevenue(res.data.revenue);
      setGrowth(res.data.growth);
      setUsers(res.data.users);
    } catch (err) {
      alert("Could not estimate. Please enter manually.");
    }
    setEstimating(false);
  };

  const calculateValuation = async () => {
    if (!revenue || !growth) return alert("Please enter Revenue and Growth metrics.");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/predict_valuation', {
        revenue: Number(revenue),
        growth: Number(growth),
        users: Number(users || 0)
      });
      setResult(res.data);
    } catch (err) {
      alert("Error calculating. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
            💰 AI Valuation Estimator
          </h1>
          <p className="text-gray-400 text-lg">
            Don't have data? Let AI estimate your potential Year 1 metrics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Input Form */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-green-500" /> Startup Metrics
            </h3>
            
            {/* NEW: INDUSTRY AUTO-FILL SECTION */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-600">
                <label className="block text-xs text-blue-300 font-bold uppercase mb-2">I am building a...</label>
                <div className="flex gap-2">
                    <input type="text" placeholder="e.g. Fintech App" 
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white text-sm focus:border-blue-500 outline-none"
                        value={industry} onChange={e => setIndustry(e.target.value)}
                    />
                    <button onClick={autoEstimate} disabled={estimating}
                        className="bg-blue-600 hover:bg-blue-500 px-3 rounded text-white flex items-center gap-1 text-sm font-bold transition-all disabled:opacity-50">
                        {estimating ? "..." : <><Sparkles size={14}/> Auto-Fill</>}
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    * AI will estimate typical Year 1 numbers for this industry.
                </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Revenue (₹ Lakhs)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input type="number" 
                    className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-green-500 outline-none transition-all"
                    value={revenue} onChange={e => setRevenue(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Annual Growth Rate (%)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input type="number"
                    className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-green-500 outline-none transition-all"
                    value={growth} onChange={e => setGrowth(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Active Users (Thousands)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input type="number"
                    className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-green-500 outline-none transition-all"
                    value={users} onChange={e => setUsers(e.target.value)}
                  />
                </div>
              </div>

              <button onClick={calculateValuation} disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold shadow-lg shadow-green-900/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                {loading ? "Calculating..." : <><Calculator size={20} /> Predict Valuation</>}
              </button>
            </div>
          </div>

          {/* Result Section (Same as before) */}
          <div className="flex justify-center pt-8">
            {result ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-full h-80 w-80 flex flex-col items-center justify-center border-4 border-green-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500">
                <p className="text-gray-400 font-medium mb-2">Estimated Value</p>
                <h2 className="text-4xl font-black text-white mb-2">{result.valuation}</h2>
                <span className="bg-green-900/50 text-green-400 text-xs px-3 py-1 rounded-full border border-green-700">
                   {result.algorithm}
                </span>
                <p className="text-gray-500 text-xs mt-6 text-center max-w-[200px]">
                  {result.details}
                </p>
              </div>
            ) : (
              <div className="h-80 w-80 flex flex-col items-center justify-center border-4 border-dashed border-gray-700 rounded-full opacity-50">
                <IndianRupee size={64} className="text-gray-600 mb-4" />
                <p className="text-gray-500">Enter metrics (or use Auto-Fill) to predict</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ValuationTool;