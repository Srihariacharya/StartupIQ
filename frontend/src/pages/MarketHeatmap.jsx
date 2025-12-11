import React, { useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF2'];

const MarketHeatmap = () => {
  const [industry, setIndustry] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMarket = async () => {
    if (!industry) return alert("Please enter an industry!");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/analyze_market', { industry });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching market data.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          📈 Market Trends & Heatmap
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Visualize real-time growth, sentiment, and competition for any industry.
        </p>

        {/* SEARCH BAR */}
        <div className="flex gap-4 max-w-xl mx-auto mb-10">
          <input 
            type="text" 
            placeholder="Enter Industry (e.g. Electric Vehicles, EdTech)" 
            className="flex-grow p-3 rounded bg-gray-800 border border-gray-600 text-white focus:border-blue-500 outline-none"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <button 
            onClick={analyzeMarket}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-bold transition-all"
          >
            {loading ? "Analyzing..." : "Analyze Trends"}
          </button>
        </div>

        {/* CHARTS SECTION */}
        {data && (
          <div className="animate-fade-in space-y-8">
            
            {/* Summary Box */}
            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500 shadow-lg">
              <h3 className="text-xl font-bold text-blue-300 mb-2">📊 AI Market Summary</h3>
              <p className="text-gray-300 text-lg italic">"{data.summary}"</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* CHART 1: GROWTH TREND (Line Chart) */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-green-400 mb-4 text-center">🚀 Market Growth (Billions $)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.growth_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="year" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                      <Line type="monotone" dataKey="market_size" stroke="#34D399" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CHART 2: SENTIMENT (Pie Chart) */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">😊 Market Sentiment</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.sentiment_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {data.sentiment_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CHART 3: COMPETITORS (Bar Chart) - Full Width */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl md:col-span-2">
                <h3 className="text-lg font-bold text-purple-400 mb-4 text-center">🏆 Top Competitors Market Share (%)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top_competitors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Bar dataKey="market_share" fill="#8884d8" barSize={50}>
                        {data.top_competitors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
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