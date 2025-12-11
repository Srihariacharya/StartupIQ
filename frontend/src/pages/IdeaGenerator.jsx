import React, { useState } from 'react';
import axios from 'axios';

const IdeaGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!keywords) return alert("Please enter some keywords (e.g. AI, Health, Students)");

    setLoading(true);
    setIdeas([]); // Clear old ideas

    try {
      // Calls the backend to generate ideas
      const res = await axios.post('http://127.0.0.1:5000/api/generate_ideas', { keywords });
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating ideas. Make sure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
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
            placeholder="Enter keywords (e.g. 'Blockchain for Farmers' or 'Student Dating App')" 
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
              <div className="text-4xl mb-4">{idea.icon || '🚀'}</div>
              <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">{idea.description}</p>
              
              <div className="bg-gray-900 p-3 rounded text-xs text-gray-300 border border-gray-700">
                <span className="font-bold text-orange-400">Target Audience:</span> {idea.target_audience}
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