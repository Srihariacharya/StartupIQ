import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout
import Navbar from './components/Navbar';

// Pages - Existing
import Home from './pages/Home';
import IdeaAnalyzer from './pages/IdeaAnalyzer';
import IdeaGenerator from './pages/IdeaGenerator';
import TalentMatchmaker from './pages/TalentMatchmaker';
import MarketHeatmap from './pages/MarketHeatmap';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Pages - New Features
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import BusinessCanvas from './pages/BusinessCanvas';
import SharedReport from './pages/SharedReport';

// Components
import OnboardingTour from './components/OnboardingTour';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="bg-gray-900 min-h-screen">
                {/* The Navbar stays visible on all pages */}
                <Navbar />

                {/* Onboarding Tour for first-time visitors */}
                <OnboardingTour />

                <Routes>
                  {/* Main Landing Page */}
                  <Route path="/" element={<Home />} />

                  {/* Feasibility Analyzer */}
                  <Route path="/analyze" element={<IdeaAnalyzer />} />

                  {/* AI Idea Generator */}
                  <Route path="/generate" element={<IdeaGenerator />} />

                  {/* GitHub Talent Scout */}
                  <Route path="/talent" element={<TalentMatchmaker />} />

                  {/* Market Trends & Heatmap */}
                  <Route path="/market" element={<MarketHeatmap />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* New: Competitor Analysis */}
                  <Route path="/competitors" element={<CompetitorAnalysis />} />

                  {/* New: Business Model Canvas */}
                  <Route path="/canvas" element={<BusinessCanvas />} />

                  {/* New: Shared Report (Public) */}
                  <Route path="/shared/:shareId" element={<SharedReport />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;