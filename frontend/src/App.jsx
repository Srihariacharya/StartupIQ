import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure you have a CSS file, or delete this line

function App() {
  const [funding, setFunding] = useState(0);
  const [teamSize, setTeamSize] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 1. Prepare the data
      const payload = {
        funding: funding,
        teamSize: teamSize
      };

      // 2. Send to Backend (Make sure Flask is running!)
      const response = await axios.post("http://127.0.0.1:5000/api/analyze", payload);

      // 3. Store the result
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to Backend. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>🚀 StartupIQ Feasibility Analyzer</h1>
      
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "20px" }}>
        <h3>Enter Startup Details:</h3>
        
        <label>
          Initial Funding ($):
          <input 
            type="number" 
            value={funding} 
            onChange={(e) => setFunding(e.target.value)} 
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
        <br /><br />

        <label>
          Team Size:
          <input 
            type="number" 
            value={teamSize} 
            onChange={(e) => setTeamSize(e.target.value)} 
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
        <br /><br />

        <button 
          onClick={handleAnalyze} 
          style={{ padding: "10px 20px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Idea"}
        </button>
      </div>

      {/* --- RESULTS SECTION --- */}
      {error && <p style={{ color: "red" }}>{error}</p>}

     {result && (
        <div style={{ 
            marginTop: "20px", 
            padding: "20px", 
            background: "#1e1e1e", // Dark background to match theme
            color: "#ffffff",      // White text for readability
            borderRadius: "8px",
            border: "1px solid #333"
        }}>
          <h2 style={{ color: "#4caf50" }}>Success Probability: {result.success_probability}%</h2>
          
          <h4 style={{ color: "#ff9800", marginTop: "15px" }}>⚠️ Identified Risks:</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {result.risks.map((risk, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>{risk}</li>
            ))}
          </ul>

          <h4 style={{ color: "#2196f3", marginTop: "15px" }}>💡 Recommendations:</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {result.recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;