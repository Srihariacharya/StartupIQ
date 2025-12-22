import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigation Hook
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, Zap, Database, Shield, CreditCard, Coffee, 
  Smartphone, BookOpen, ArrowRight, Rocket 
} from 'lucide-react';

// --- CONFIGURATION ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF2'];

// --- MOCK DATABASE (Initial Default State) ---
const DEFAULT_IDEAS = [
  { id: 1, title: "AI Compliance Auditor", subtitle: "Automated GDPR & legal checks", competition: "High", avgFunding: "₹20Cr", successRate: 78, icon: <Database className="w-6 h-6 text-blue-600" /> },
  { id: 2, title: "Generative Video Ads", subtitle: "AI-created marketing content", competition: "Medium", avgFunding: "₹15Cr", successRate: 82, icon: <Zap className="w-6 h-6 text-purple-600" /> },
  { id: 3, title: "CyberSecurity Mesh", subtitle: "Distributed cloud security layer", competition: "High", avgFunding: "₹28Cr", successRate: 75, icon: <Shield className="w-6 h-6 text-indigo-600" /> },
  { id: 4, title: "EdTech Career Coach", subtitle: "AI path planning for students", competition: "Low", avgFunding: "₹5Cr", successRate: 88, icon: <BookOpen className="w-6 h-6 text-pink-500" /> }
];

const MarketHeatmap = () => {
  const [industry, setIndustry] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // 2. Initialize Navigation

  // Helper: Get color for competition badge
  const getCompetitionColor = (level) => {
    if (level === 'High') return 'bg-red-900/50 text-red-200 border border-red-700';
    if (level === 'Medium') return 'bg-yellow-900/50 text-yellow-200 border border-yellow-700';
    return 'bg-green-900/50 text-green-200 border border-green-700';
  };

  const analyzeMarket = async () => {
    if (!industry) return alert("Please enter an industry!");
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/analyze_market', { industry });
      setData(res.data);
    } catch (err) {
      console.warn("Backend error, defaulting to mock data.");
      setData({
        summary: `Analysis for ${industry} shows strong growth potential.`,
        growth_trend: [{year: '2021', market_size: 10}, {year: '2025', market_size: 50}],
        sentiment_distribution: [{name: 'Pos', value: 70}, {name: 'Neg', value: 30}],
        trending_startups_heatmap: DEFAULT_IDEAS.map(i => ({
             name: i.title, subtitle: i.subtitle, competition: i.competition, avgFunding: i.avgFunding, successRate: i.successRate
        }))
      });
    }
    setLoading(false);
  };

  // 3. New Function to handle the "Analyze" click
  const handleAnalyze = (trend) => {
    navigate('/analyze', { 
      state: { 
        name: trend.name || trend.title, 
        description: trend.subtitle,
        industry: industry || 'Technology' 
      } 
    });
  };

  // Logic: Determine which list to show (API data or Default)
  const cardsToShow = data?.trending_startups_heatmap 
    ? data.trending_startups_heatmap 
    : DEFAULT_IDEAS;

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

        {/* 1. TRENDING STARTUP IDEAS */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 justify-center">
               🔥 {data ? `Trending in ${industry}` : "Trending Startup Opportunities"}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {cardsToShow.map((trend, index) => (
                <div key={index} className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                  
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-3 mb-2">
                      {trend.icon || <Rocket className="w-6 h-6 text-orange-500" />}
                      <h3 className="text-xl font-bold text-slate-900">{trend.title || trend.name}</h3>
                    </div>
                    <p className="text-slate-500 mb-4">{trend.subtitle}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCompetitionColor(trend.competition)}`}>
                        Comp: {trend.competition}
                      </span>
                      <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Funding: <strong>{trend.avgFunding}</strong></span>
                    </div>
                  </div>

                  {/* Right: Success Metrics & Button */}
                  <div className="flex items-center gap-4 mt-4 md:mt-0 border-l border-slate-100 pl-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-3xl font-bold text-slate-800">{trend.successRate}%</div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Success Rate</div>
                    </div>

                    {/* 4. THE ACTION BUTTON */}
                    <button 
                      onClick={() => handleAnalyze(trend)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-md transition-colors group flex items-center gap-2"
                      title="Analyze this idea"
                    >
                      <span className="font-bold text-sm">Analyze</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* 2. CHARTS SECTION (Visible After Analysis) */}
        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Executive Summary */}
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-blue-500/30 shadow-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-2">📊 Executive Summary</h3>
              <p className="text-gray-300 text-lg leading-relaxed">"{data.summary}"</p>
            </div>

            {/* Charts Section */}
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

          </div>
        )}
      </div>
    </div>
  );
};

export default MarketHeatmap;