import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages and Context
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import IdeaAnalyzer from './pages/IdeaAnalyzer';
import IdeaGenerator from './pages/IdeaGenerator';
import TalentMatchmaker from './pages/TalentMatchmaker';
import MarketHeatmap from './pages/MarketHeatmap';
import ValuationTool from './pages/ValuationTool';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 min-h-screen">
          {/* The Navbar stays visible on all pages */}
          <Navbar />

          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Phase 2: Feasibility Analyzer */}
            <Route path="/analyze" element={<IdeaAnalyzer />} />

            {/* Phase 3: AI Idea Generator */}
            <Route path="/generate" element={<IdeaGenerator />} />

            {/* Phase 3 (Updated): GitHub Talent Scout */}
            <Route path="/talent" element={<TalentMatchmaker />} />

            {/* Phase 4: Market Trends & Heatmap */}
            <Route path="/market" element={<MarketHeatmap />} />

            {/* Phase 5. Valution result */}
            <Route path="/valuation" element={<ValuationTool />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;