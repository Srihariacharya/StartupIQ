import React, { useState } from 'react';
import axios from 'axios';

// --- CANDIDATE CARD (Updated for GitHub) ---
const CandidateCard = ({ person, mySkills }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkFit = async () => {
    if (!mySkills) return alert("Please enter YOUR skills first!");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/analyze_fit', {
        founder_skills: mySkills,
        candidate_skills: person.skills.join(', '),
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      alert("AI Error");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-all shadow-lg flex flex-col justify-between animate-fade-in">
      
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-3">
        {/* REAL GITHUB AVATAR */}
        <img 
          src={person.avatar} 
          alt={person.name} 
          className="w-16 h-16 rounded-full border-2 border-blue-500"
        />
        <div>
          <h3 className="text-xl font-bold text-white capitalize">{person.name}</h3>
          <p className="text-blue-400 text-sm font-semibold">{person.role}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Top Skills:</p>
        <div className="flex flex-wrap gap-2">
          {person.skills.map((skill, idx) => (
            <span key={idx} className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300 border border-gray-600">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        {/* Link to Real Profile */}
        <a 
          href={person.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center bg-gray-700 hover:bg-gray-600 py-2 rounded text-white text-sm font-bold border border-gray-600"
        >
          🔗 View GitHub Profile
        </a>

        {/* AI Check Button */}
        {!analysis ? (
          <button 
            onClick={checkFit} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:opacity-90 py-2 rounded text-white font-bold text-sm transition-all"
          >
            {loading ? "Analyzing..." : "⚡ Check AI Compatibility"}
          </button>
        ) : (
          <div className="bg-gray-900 p-3 rounded text-sm border border-green-500/50">
            <p className="whitespace-pre-line text-green-300 font-mono text-xs leading-relaxed">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const TalentMatchmaker = () => {
  const [searchSkill, setSearchSkill] = useState('');
  const [mySkills, setMySkills] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if(!searchSkill) return alert("Please enter a skill (e.g. Python)");
    
    setIsLoading(true);
    setResults([]); // Clear old results
    try {
      // We send 'skill' as the main search term for GitHub
      const res = await axios.post('http://127.0.0.1:5000/api/search_talent', { 
        skill: searchSkill 
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching from GitHub.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          🐙 GitHub Talent Scout
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Find <b>real developers</b> directly from the GitHub Open Source Community.
        </p>

        {/* INPUTS */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
             
             {/* 1. Your Skills */}
             <div>
               <label className="text-sm text-blue-300 font-bold block mb-2">1. Your Skills (For AI Match)</label>
               <input 
                 type="text" 
                 placeholder="e.g. Marketing, Business, Design" 
                 className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:border-blue-500 outline-none"
                 value={mySkills} 
                 onChange={e => setMySkills(e.target.value)} 
               />
             </div>
             
             {/* 2. Search GitHub */}
             <div>
               <label className="text-sm text-green-300 font-bold block mb-2">2. Search Developer Skill</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="e.g. Python, React, Java" 
                   className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:border-green-500 outline-none"
                   value={searchSkill} 
                   onChange={e => setSearchSkill(e.target.value)} 
                 />
                 <button 
                   onClick={handleSearch} 
                   disabled={isLoading}
                   className="bg-green-600 hover:bg-green-500 px-6 rounded font-bold transition-all"
                 >
                   {isLoading ? "..." : "Search"}
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {results.map((person, i) => (
            <CandidateCard key={i} person={person} mySkills={mySkills} />
          ))}
          
          {results.length === 0 && !isLoading && (
            <div className="col-span-3 text-center text-gray-500 py-10">
              Enter a technical skill (like "React" or "Python") to see real developers.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TalentMatchmaker;