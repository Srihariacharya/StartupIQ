import React, { useState } from 'react';
import axios from 'axios';

const BrandNameGenerator = () => {
  const [description, setDescription] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description) return alert("Please describe your startup!");
    setLoading(true);
    setResults([]);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/generate_brands', { description });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating names.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          ✨ AI Brand Name Generator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Find the perfect name and check domain availability instantly.
        </p>

        {/* INPUT SECTION */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl mb-10 max-w-2xl mx-auto">
          <label className="text-sm text-purple-300 font-bold block mb-2">Describe your Product or Brand</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. A platform for farmers to sell directly to consumers" 
              className="flex-grow p-3 rounded bg-gray-700 border border-gray-600 text-white focus:border-purple-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-bold transition-all shadow-lg shadow-purple-500/30"
            >
              {loading ? "Inventing..." : "Generate Names"}
            </button>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((brand, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all shadow-lg group">
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs text-gray-400 italic mb-4">"{brand.reason}"</p>
              
              <div className="space-y-2 bg-gray-900 p-3 rounded border border-gray-800">
                {Object.entries(brand.domains).map(([ext, status]) => (
                  <div key={ext} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-mono">{brand.name.toLowerCase()}{ext}</span>
                    {status === "Available" ? (
                      <span className="text-green-400 font-bold text-xs bg-green-900/30 px-2 py-1 rounded">✔ Available</span>
                    ) : (
                      <span className="text-red-400 font-bold text-xs bg-red-900/30 px-2 py-1 rounded">✖ Taken</span>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 rounded transition-all">
                Buy Domain →
              </button>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default BrandNameGenerator;