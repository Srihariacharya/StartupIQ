import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 backdrop-blur-sm">
            ✨ AI-Powered Startup Validation
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
          Turn Your Startup Idea <br />
          Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Validated Business</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-4 max-w-2xl text-xl text-gray-400 mb-10 animate-fade-in-up delay-200">
          Overcome founder's bias with AI-driven market analysis, risk assessment, 
          and success prediction. Make data-backed decisions from day one.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
          <Link 
            to="/analyzer" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Start Your Analysis ➔
          </Link>
          
          <Link 
            to="/ideas" 
            className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Generate Ideas 💡
          </Link>
        </div>

        {/* Stats Grid (The cards at the bottom of the video) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in-up delay-300">
          {[
            { label: "Success Rate Increase", value: "2.5x", icon: "📈", color: "text-green-400" },
            { label: "Founders Helped", value: "10K+", icon: "👥", color: "text-blue-400" },
            { label: "Ideas Validated", value: "50K+", icon: "💡", color: "text-yellow-400" },
            { label: "Risk Factors Identified", value: "100K+", icon: "🛡️", color: "text-purple-400" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:border-gray-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;