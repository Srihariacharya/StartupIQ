import React, { useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, Zap, Database, Shield, CreditCard, Coffee, 
  Smartphone, BookOpen, ArrowRight 
} from 'lucide-react';

// --- CONFIGURATION ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF2'];

// --- MOCK DATABASE (For Startup Ideas) ---
// This ensures the cards change based on your search (Logic from previous step)
const IDEA_DATABASE = {
  'ai': [
    { id: 1, title: "AI Compliance Auditor", subtitle: "Automated GDPR & legal checks", competition: "High", avgFunding: "₹20Cr", companies: "1,240", successRate: 78, icon: <Database className="w-6 h-6 text-blue-600" /> },
    { id: 2, title: "Generative Video Ads", subtitle: "AI-created marketing content", competition: "Medium", avgFunding: "₹15Cr", companies: "450", successRate: 82, icon: <Zap className="w-6 h-6 text-purple-600" /> }
  ],
  'fintech': [
    { id: 3, title: "DeFi Micro-Lending", subtitle: "Crypto-backed small loans", competition: "High", avgFunding: "₹25Cr", companies: "2,100", successRate: 72, icon: <CreditCard className="w-6 h-6 text-emerald-600" /> },
    { id: 4, title: "Carbon Credit Exchange", subtitle: "Marketplace for offsets", competition: "Low", avgFunding: "₹12Cr", companies: "320", successRate: 65, icon: <TrendingUp className="w-6 h-6 text-green-600" /> }
  ],
  'food': [
    { id: 5, title: "Cloud Kitchen Aggregator", subtitle: "Logistics for ghost kitchens", competition: "Medium", avgFunding: "₹8Cr", companies: "1,820", successRate: 69, icon: <Coffee className="w-6 h-6 text-orange-600" /> }
  ],
  'edtech': [
    { id: 7, title: "VR History Classrooms", subtitle: "Immersive historical events", competition: "Low", avgFunding: "₹5Cr", companies: "210", successRate: 88, icon: <BookOpen className="w-6 h-6 text-blue-400" /> },
    { id: 8, title: "AI Career Counselor", subtitle: "Skill gap analysis for grads", competition: "Medium", avgFunding: "₹10Cr", companies: "890", successRate: 74, icon: <Smartphone className="w-6 h-6 text-indigo-600" /> }
  ],
  'default': [
    { id: 1, title: "AI & Machine Learning", subtitle: "Enterprise AI solutions", competition: "High", avgFunding: "₹20Cr", companies: "1,240", successRate: 78, icon: <Database className="w-6 h-6 text-blue-600" /> },
    { id: 2, title: "CyberSecurity", subtitle: "Cloud security suites", competition: "Medium", avgFunding: "₹28Cr", companies: "980", successRate: 75, icon: <Shield className="w-6 h-6 text-indigo-600" /> }
  ]
};

const MarketHeatmap = () => {
  const [industry, setIndustry] = useState('');
  const [data, setData] = useState(null);
  const [currentIdeas, setCurrentIdeas] = useState([]); // State for the Cards
  const [loading, setLoading] = useState(false);

  // Helper: Get color for competition badge
  const getCompetitionColor = (level) => {
    if (level === 'High') return 'bg-red-900/50 text-red-200 border border-red-700';
    if (level === 'Medium') return 'bg-yellow-900/50 text-yellow-200 border border-yellow-700';
    return 'bg-green-900/50 text-green-200 border border-green-700';
  };

  const analyzeMarket = async () => {
    if (!industry) return alert("Please enter an industry!");
    setLoading(true);

    // 1. DETERMINE WHICH CARDS TO SHOW (Frontend Logic)
    const lowerTerm = industry.toLowerCase();
    let selectedIdeas = IDEA_DATABASE['default'];
    if (lowerTerm.includes('ai')) selectedIdeas = IDEA_DATABASE['ai'];
    else if (lowerTerm.includes('fin')) selectedIdeas = IDEA_DATABASE['fintech'];
    else if (lowerTerm.includes('food')) selectedIdeas = IDEA_DATABASE['food'];
    else if (lowerTerm.includes('ed')) selectedIdeas = IDEA_DATABASE['edtech'];
    
    setCurrentIdeas(selectedIdeas);

    // 2. FETCH CHART DATA (Backend Logic)
    try {
      // Attempt to call your API
      const res = await axios.post('http://127.0.0.1:5000/api/analyze_market', { industry });
      setData(res.data);
    } catch (err) {
      console.warn("Backend not found, using Mock Data for UI demo.");
      // Fallback Mock Data so the charts still render for you right now
      setData({
        summary: `Market analysis for ${industry} indicates a bullish trend with high investor interest.`,
        growth_trend: [
          { year: '2021', market_size: 10 },
          { year: '2022', market_size: 15 },
          { year: '2023', market_size: 25 },
          { year: '2024', market_size: 32 },
          { year: '2025', market_size: 45 },
        ],
        sentiment_distribution: [
          { name: 'Positive', value: 65 },
          { name: 'Neutral', value: 20 },
          { name: 'Negative', value: 15 },
        ]
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          📈 Market Intelligence Heatmap
        </h1>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Visualize growth, sentiment, and trending startups in real-time.
        </p>

        {/* SEARCH BAR */}
        <div className="flex gap-4 max-w-2xl mx-auto mb-16">
          <input 
            type="text" 
            placeholder="Try 'EdTech', 'FinTech', or 'AI'..." 
            className="flex-grow p-4 rounded-xl bg-gray-800 border border-gray-700 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeMarket()}
          />
          <button 
            onClick={analyzeMarket}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Analyze"}
          </button>
        </div>

        {/* RESULTS DASHBOARD */}
        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* 1. EXECUTIVE SUMMARY */}
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-blue-500/30 shadow-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-2">📊 Executive Summary</h3>
              <p className="text-gray-300 text-lg leading-relaxed">"{data.summary}"</p>
            </div>

            {/* 2. CHARTS SECTION (Grid Layout) */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Growth Chart */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <TrendingUp size={20}/> 5-Year Market Growth (Billions)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.growth_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} 
                        itemStyle={{ color: '#34D399' }}
                      />
                      <Line type="monotone" dataKey="market_size" stroke="#34D399" strokeWidth={3} dot={{ r: 4, fill: '#34D399' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Chart */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-yellow-400 mb-6 flex items-center gap-2">
                  😊 Consumer Sentiment
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.sentiment_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.sentiment_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 3. TRENDING STARTUP IDEAS (Replaced Treemap with Cards) */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                 🔥 Trending Startup Opportunities
              </h2>
              
              <div className="grid gap-4">
                {currentIdeas.map((trend) => (
                  <div key={trend.id} className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                    
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-3 mb-2">
                        {trend.icon}
                        <h3 className="text-xl font-bold text-slate-900">{trend.title}</h3>
                      </div>
                      <p className="text-slate-500 mb-4">{trend.subtitle}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCompetitionColor(trend.competition)}`}>
                          Competition: {trend.competition}
                        </span>
                        <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Funding: <strong>{trend.avgFunding}</strong></span>
                      </div>
                    </div>

                    {/* Right: Success Metrics */}
                    <div className="flex items-center gap-8 mt-4 md:mt-0 border-l border-slate-100 pl-8">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-800">{trend.successRate}%</div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Success Rate</div>
                      </div>

                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-lg shadow-md transition-colors group">
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MarketHeatmap;