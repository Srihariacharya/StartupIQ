import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import MarketHeatmap from './pages/MarketHeatmap';
import IdeaGenerator from './pages/IdeaGenerator'; // (Create this next)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/heatmap" element={<MarketHeatmap />} />
          <Route path="/ideas" element={<IdeaGenerator />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;