import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col justify-center items-center px-4 text-center">
      
      {/* Hero Badge */}
      <div className="mb-6 animate-fade-in-up">
        <span className="bg-blue-900 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-700">
          ✨ AI-Powered Startup Validation
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up delay-100">
        Turn Your Startup Idea <br />
        Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Validated Business</span>
      </h1>

      {/* Subheadline */}
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 animate-fade-in-up delay-200">
        Overcome founder's bias with AI-driven market analysis, risk assessment, 
        and success prediction. Make data-backed decisions from day one.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
        <Link 
          to="/analyzer" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          Start Your Analysis ➔
        </Link>
        
        <Link 
          to="/ideas" 
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 border border-gray-700 flex items-center justify-center gap-2"
        >
          Generate Ideas 💡
        </Link>
      </div>

      {/* Trust Badges / Stats (Optional visual flair) */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-500 animate-fade-in-up delay-500">
        <div>
          <h4 className="text-3xl font-bold text-white">2.5x</h4>
          <p className="text-sm">Success Rate Increase</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-white">10k+</h4>
          <p className="text-sm">Founders Helped</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-white">50k+</h4>
          <p className="text-sm">Ideas Validated</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-white">100k+</h4>
          <p className="text-sm">Risk Factors Identified</p>
        </div>
      </div>

    </div>
  );
};

export default Home;