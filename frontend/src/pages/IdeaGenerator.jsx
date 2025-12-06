import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IdeaGenerator = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/generate_idea', { topic });
      setIdeas(response.data);
    } catch (error) {
      console.error("Error generating ideas:", error);
      alert("Failed to generate ideas. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI Idea Generator
        </h1>
        <p className="text-gray-400 mb-10">
          Stuck? Enter a keyword (e.g., "Coffee", "Farming") and let AI brainstorm for you.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleGenerate} className="flex gap-2 max-w-lg mx-auto mb-12">
          <input 
            type="text" 
            placeholder="Describe your interest..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none text-white"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Generate ✨'}
          </button>
        </form>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all text-left">
              <h3 className="text-xl font-bold text-purple-400 mb-2">{idea.name}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-gray-500">Problem:</strong> {idea.problem}</p>
                <p><strong className="text-gray-500">Solution:</strong> {idea.solution}</p>
                <p><strong className="text-gray-500">Audience:</strong> {idea.audience}</p>
              </div>
              <button 
                onClick={() => navigate('/analyzer')}
                className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-semibold transition-colors"
              >
                Analyze This Idea ➔
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default IdeaGenerator;