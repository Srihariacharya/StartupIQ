import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const IdeaGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!keywords) return alert("Please enter some keywords (e.g. AI, Health, Students)");

    setLoading(true);
    setIdeas([]); 

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/generate_idea', { 
        topic: keywords 
      });
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating ideas. Make sure backend is running on port 5000.");
    }
    setLoading(false);
  };

  const handleAnalyze = (idea) => {
    navigate('/analyze', { 
      state: { 
        name: idea.name, 
        solution: idea.solution,
        industry: keywords 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
          💡 AI Startup Idea Generator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Stuck? Enter an industry or technology, and Gemini will invent 3 startup concepts for you.
        </p>

        {/* Search Input */}
        <div className="flex gap-4 max-w-2xl mx-auto mb-10">
          <input 
            type="text" 
            placeholder="Enter keywords (e.g. 'Blockchain for Farmers')" 
            className="flex-grow p-4 rounded bg-gray-800 border border-gray-600 text-white focus:border-orange-500 outline-none"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 px-8 py-4 rounded font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            {loading ? "Inventing..." : "Generate Ideas"}
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-all shadow-xl flex flex-col">
              <div className="text-4xl mb-4">🚀</div>
              
              {/* Data Display */}
              <h3 className="text-xl font-bold text-white mb-2">{idea.name}</h3>
              
              <div className="flex-grow space-y-3 mb-6">
                <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wide">The Problem</span>
                    <p className="text-gray-400 text-sm leading-snug">{idea.problem}</p>
                </div>
                <div>
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wide">The Solution</span>
                    <p className="text-gray-300 text-sm leading-snug">{idea.solution}</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="bg-gray-900 p-3 rounded text-xs text-gray-300 border border-gray-700 mb-4">
                    <span className="font-bold text-orange-400">Audience:</span> {idea.audience}
                </div>

                {/* FIX 3: The Button to Analyze */}
                <button 
                  onClick={() => handleAnalyze(idea)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold text-sm transition-colors shadow-lg shadow-blue-900/20"
                >
                  Analyze This Idea →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {ideas.length === 0 && !loading && (
          <div className="text-center text-gray-600 py-10">
            Enter a topic above to see the magic happen! ✨
          </div>
        )}

      </div>
    </div>
  );
};

export default IdeaGenerator;