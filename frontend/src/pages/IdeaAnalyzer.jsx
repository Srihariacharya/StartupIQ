import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Sparkles, Info, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf'; 

const IdeaAnalyzer = () => {
  const location = useLocation();
  const incomingData = location.state || {};

  const [formData, setFormData] = useState({
    startupName: incomingData.name || '', 
    industry: incomingData.industry || '',
    description: incomingData.solution || incomingData.description || '', 
    funding: 40,
    teamSize: 'Solo Founder',
    marketSize: 'Regional',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, funding: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
        const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData);
        setResult(response.data);
    } catch (err) {
        console.error(err);
        setError("CORS or Connection Error. Ensure Backend is running on port 5000.");
    } finally {
        setLoading(false);
    }
  };

  // --- 📄 PDF GENERATOR ---
  const downloadReport = () => {
    console.log("Starting PDF generation...");
    if (!result) {
        alert("No results to download. Please analyze an idea first.");
        return;
    }

    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // --- Helper: Safely Wrap Text ---
        const addWrappedText = (text, y, fontSize = 12, color = [60, 60, 60]) => {
          doc.setFontSize(fontSize);
          doc.setTextColor(...color);
          const safeText = String(text || "N/A"); // Safety check
          const lines = doc.splitTextToSize(safeText, contentWidth);
          doc.text(lines, margin, y);
          return y + (lines.length * (fontSize / 2)) + 6; 
        };

        // ================= PAGE 1 =================
        doc.setFillColor(41, 128, 185); 
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.text("Startup Feasibility Report", margin, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 32);

        let yPos = 60;

        // Section 1: Concept
        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185);
        doc.text("1. Startup Concept", margin, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${formData.startupName || "My Startup"}`, margin, yPos);
        yPos += 8;
        doc.text(`Industry: ${formData.industry || "General"}`, margin, yPos);
        yPos += 12;
        
        yPos = addWrappedText(formData.description, yPos, 12, [60, 60, 60]);
        yPos += 10;

        // Section 2: Business Context
        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185);
        doc.text("2. Business Context", margin, yPos);
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Initial Funding: ${formData.funding || 0} Lakhs`, margin, yPos);
        yPos += 8;
        doc.text(`Team Size: ${formData.teamSize || "N/A"}`, margin, yPos);
        yPos += 8;
        doc.text(`Target Market: ${formData.marketSize || "N/A"}`, margin, yPos);
        yPos += 15;

        // Section 3: AI Verdict
        doc.setDrawColor(200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;

        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185);
        doc.text("3. AI Feasibility Analysis", margin, yPos);
        yPos += 15;

        // Score Box
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
        
        doc.setFontSize(22);
        const score = result.score || 0;
        if (score > 70) doc.setTextColor(39, 174, 96); 
        else if (score > 40) doc.setTextColor(243, 156, 18); 
        else doc.setTextColor(192, 57, 43); 
        
        doc.text(`Success Probability: ${score}%`, margin + 10, yPos + 15);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("(Based on historical data & AI analysis)", margin + 10, yPos + 25);
        
        yPos += 45;
        
        // Analysis Text
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("AI Verdict:", margin, yPos);
        yPos += 8;
        yPos = addWrappedText(result.analysis, yPos, 11, [60, 60, 60]);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("StartupIQ - AI Analysis Engine", margin, 280);

        // ================= PAGE 2 =================
        doc.addPage();
        doc.setFillColor(240, 240, 240);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setFontSize(18);
        doc.setTextColor(50);
        doc.text("Strategic Recommendations", margin, 20);

        yPos = 50;

        // Handle recommendations array safely
        const recs = result.recommendations || [];
        if (recs.length > 0) {
            recs.forEach((rec) => {
                doc.setFillColor(41, 128, 185);
                doc.circle(margin + 2, yPos - 1, 1.5, 'F');
                
                let text = "";
                if (typeof rec === 'object') {
                    // Handle object format {title: "...", content: "..."}
                    text = `${rec.title || "Insight"}: ${rec.tip || rec.content || ""}`;
                } else {
                    // Handle simple string format
                    text = String(rec);
                }

                yPos = addWrappedText(text, yPos, 12, [60, 60, 60]);
                yPos += 5;
            });
        } else {
            doc.text("No specific recommendations generated.", margin, yPos);
        }

        console.log("Saving PDF...");
        doc.save(`${formData.startupName || "Startup"}_Feasibility_Report.pdf`);

    } catch (err) {
        console.error("PDF GENERATION ERROR:", err);
        alert("Error generating PDF. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-white">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center md:text-left">
        <div className="inline-block bg-blue-900/50 text-blue-300 border border-blue-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3">
           Gemini VC Analyst
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Startup Success Predictor</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Let AI analyze your business model, funding, and market fit to predict your success odds.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        
        {/* INPUT FORM */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Tell Us About Your Startup
            </h2>

            <div className="space-y-6">
                {/* Name and Industry */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Startup Name *</label>
                    <input 
                      type="text" 
                      name="startupName" 
                      value={formData.startupName} 
                      placeholder="e.g., SecureVault" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none transition-all" 
                      onChange={handleChange} 
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Industry Sector *</label>
                    <select 
                      name="industry" 
                      value={formData.industry}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                      onChange={handleChange}
                    >
                        <option value="">Select sector...</option>
                        <option value="AI">Artificial Intelligence</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Edtech">Edtech</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="AgriTech">AgriTech</option>
                        <option value="SAAS">SAAS</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Solution Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description}
                      placeholder="Describe your solution..." 
                      rows="3" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none" 
                      onChange={handleChange}
                    ></textarea>
                </div>

              {/* Funding Input - Exact Amount */}
              <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                     Initial Funding (in Rupees)
                  </label>
    
                <div className="relative">
                   {/* Rupee Symbol Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold">₹</span>
                  </div>

                  <input 
                      type="number" 
                      name="funding"
                      value={formData.funding}
                      onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
    
                {/* Helper text to show them what they typed */}
                <p className="text-xs text-gray-400 mt-2">
                     You entered: <span className="text-blue-400 font-bold">₹{Number(formData.funding).toLocaleString('en-IN')}</span>
                </p>
              </div>

                {/* Team & Market */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Team Size</label>
                        <select 
                          name="teamSize" 
                          value={formData.teamSize}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Solo Founder</option>
                            <option>2-5 Employees</option>
                            <option>5-10 Employees</option>
                            <option>10+ Employees</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Target Market Size</label>
                        <select 
                          name="marketSize" 
                          value={formData.marketSize}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none" 
                          onChange={handleChange}
                        >
                            <option>Regional</option>
                            <option>National (India)</option>
                            <option>Global</option>
                        </select>
                    </div>
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Analyzing..." : <><Sparkles size={20} /> Analyze My Idea</>}
                </button>

                {error && <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded border border-red-900">{error}</p>}
            </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
            <div className="bg-gray-800 text-white rounded-2xl shadow-2xl p-8 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Score Circle & Source Badge */}
                    <div className="text-center">
                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-gray-900 ${result.score > 70 ? 'border-emerald-500 text-emerald-400 shadow-emerald-900/40' : result.score > 40 ? 'border-yellow-500 text-yellow-400 shadow-yellow-900/40' : 'border-red-500 text-red-400 shadow-red-900/40'}`}>
                            {result.score}%
                        </div>
                        <p className="mt-2 text-gray-400 font-semibold tracking-wider uppercase text-sm mb-4">Probability</p>
                        
                        {/* Source Badge */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                Analysis Source
                            </span>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                                result.source?.includes('Dataset') 
                                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' 
                                : 'bg-blue-900/20 border-blue-500/50 text-blue-400'
                            }`}>
                                {result.source || "Hybrid AI Engine"}
                            </span>
                        </div>
                    </div>

                    {/* Text Analysis */}
                    <div className="flex-1 w-full">
                        <h3 className="text-2xl font-bold mb-2 text-white">AI Verdict</h3>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{result.analysis}</p>
                        
                        <div className="bg-gray-700/50 p-5 rounded-lg border-l-4 border-blue-500 mb-6">
                            <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <Info size={18}/> Strategic Advice
                            </h4>
                            <ul className="space-y-4">
                                {result.recommendations && result.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">
                                        {typeof rec === 'object' ? (
                                            <>
                                              <strong className="text-blue-300 block mb-1">
                                                {rec.title || "Strategic Insight"}:
                                              </strong>
                                              <span className="text-gray-300">{rec.tip || rec.content}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-300 flex gap-2">
                                                <span className="text-blue-500">•</span> {rec}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* 👇 NEW DOWNLOAD BUTTON 👇 */}
                        <div className="flex justify-start">
                            <button 
                                onClick={downloadReport}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                            >
                                <FileText size={18}/> Download Feasibility Report (PDF) <Download size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default IdeaAnalyzer;