import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, Zap, Database, Shield,
  BookOpen, ArrowRight, Rocket
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF2'];

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
  const navigate = useNavigate();

  // --- NEW: SMART DATA CLEANER ---
  const processSentimentData = (raw_data) => {
    if (!raw_data || !Array.isArray(raw_data)) return [];

    return raw_data.map(item => {
      const nameKey = Object.keys(item).find(k => ['name', 'sentiment', 'label', 'category'].includes(k.toLowerCase())) || 'name';
      const valueKey = Object.keys(item).find(k => ['value', 'percentage', 'count', 'amount', 'share'].includes(k.toLowerCase())) || 'value';

      return {
        name: item[nameKey] || 'Unknown',
        value: Number(item[valueKey]) || 0
      };
    });
  };

  const getCompetitionColor = (level) => {
    if (level === 'High') return 'bg-red-900/50 text-red-200 border border-red-700';
    if (level === 'Medium') return 'bg-yellow-900/50 text-yellow-200 border border-yellow-700';
    return 'bg-green-900/50 text-green-200 border border-green-700';
  };

  const analyzeMarket = async () => {
    if (!industry) return alert("Please enter an industry!");
    setLoading(true);

    try {
      console.log("📡 Sending Request for:", industry);
      const res = await axios.post(`${API_BASE}/api/analyze_market`, { industry });
      console.log("✅ Data Received:", res.data);
      setData(res.data);
    } catch (err) {
      console.warn("❌ Backend Failed. Using Mock Data.", err);
      setData({
        summary: `Analysis for ${industry} (MOCK DATA - Backend Connection Failed).`,
        growth_trend: [
          { year: '2021', market_size: 10 }, { year: '2022', market_size: 20 },
          { year: '2023', market_size: 35 }, { year: '2024', market_size: 50 },
          { year: '2025', market_size: 80 }
        ],
        sentiment_distribution: [
          { name: 'Positive', value: 65 },
          { name: 'Neutral', value: 25 },
          { name: 'Negative', value: 10 }
        ],
        trending_startups_heatmap: DEFAULT_IDEAS.map(i => ({
          name: i.title, subtitle: i.subtitle, competition: i.competition, avgFunding: i.avgFunding, successRate: i.successRate
        }))
      });
    }
    setLoading(false);
  };

  const handleAnalyze = (trend) => {
    navigate('/analyze', {
      state: {
        name: trend.name || trend.title,
        description: trend.subtitle,
        industry: industry || 'Technology'
      }
    });
  };

  const cardsToShow = data?.trending_startups_heatmap || DEFAULT_IDEAS;

  // Clean the data before rendering
  const cleanSentimentData = data ? processSentimentData(data.sentiment_distribution) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          📈 Market Intelligence Heatmap
        </h1>

        {/* SEARCH BAR */}
        <div className="flex gap-4 max-w-2xl mx-auto mb-16">
          <input
            type="text"
            placeholder="Try 'EdTech', 'FinTech', or 'AI'..."
            className="flex-grow p-4 rounded-xl bg-gray-800 border border-gray-700 text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeMarket()}
          />
          <button
            onClick={analyzeMarket}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Analyze"}
          </button>
        </div>

        {/* 1. TRENDING IDEAS LIST */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 justify-center">
            🔥 {data ? `Trending in ${industry}` : "Trending Startup Opportunities"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {cardsToShow.map((trend, index) => (
              <div key={index} className="bg-white rounded-xl p-6 flex items-center justify-between shadow-lg">
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-6 h-6 text-orange-500" />
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
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{trend.successRate}%</div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CHARTS SECTION */}
        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Executive Summary */}
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-blue-500/30 shadow-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-2">📊 Executive Summary</h3>
              <p className="text-gray-300 text-lg leading-relaxed">"{data.summary}"</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Growth Chart */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2 self-start">
                  <TrendingUp size={20} /> 5-Year Market Growth
                </h3>
                <div className="w-full flex justify-center overflow-x-auto">
                  <LineChart width={400} height={300} data={data.growth_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} />
                    <Line type="monotone" dataKey="market_size" stroke="#34D399" strokeWidth={3} dot={{ r: 4, fill: '#34D399' }} />
                  </LineChart>
                </div>
              </div>

              {/* Sentiment Chart */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-yellow-400 mb-6 flex items-center gap-2 self-start">
                  😊 Consumer Sentiment
                </h3>

                {/* Fixed Dimensions + Smart Data Cleaning */}
                <div className="w-full flex justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={cleanSentimentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      label
                    >
                      {cleanSentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
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