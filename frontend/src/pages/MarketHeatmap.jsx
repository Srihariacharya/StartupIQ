import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MarketHeatmap = () => {
  const data = {
    labels: ['FinTech', 'AI & ML', 'HealthTech', 'EdTech', 'CleanTech', 'E-commerce', 'AgriTech'],
    datasets: [
      {
        label: 'Success Rate (%)',
        data: [72, 78, 68, 65, 63, 61, 57],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(245, 158, 11, 0.8)', // Yellow
          'rgba(139, 92, 246, 0.8)', // Purple
          'rgba(6, 182, 212, 0.8)',  // Cyan
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      title: { display: true, text: 'Startup Success Rates by Sector', color: 'white', font: { size: 18 } },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100, 
        grid: { color: '#374151' }, // Dark grid lines
        ticks: { color: '#9ca3af' } // Gray text
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Market Opportunity Heatmap
          </h1>
          <p className="text-gray-400">
            Analyze historical trends to find high-potential sectors.
          </p>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
          <Bar data={data} options={options} />
        </div>
        
        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-green-400 mb-2">🚀 High Opportunity</h3>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">AI & FinTech</span> are showing the highest success rates (70%+) due to heavy investment flows.
            </p>
          </div>
          <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">⚖️ Moderate Growth</h3>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">HealthTech & EdTech</span> offer stable growth but require longer runways for profitability.
            </p>
          </div>
          <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-red-400 mb-2">⚔️ High Competition</h3>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">E-commerce</span> is saturated. Success depends heavily on branding and niche selection.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketHeatmap;