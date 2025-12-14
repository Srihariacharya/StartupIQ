import React, { useState } from 'react';
import axios from 'axios';

const PitchDeckGenerator = () => {
  const [idea, setIdea] = useState('');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGenerate = async () => {
    if (!idea) return alert("Please enter your startup idea!");
    setLoading(true);
    setSlides([]);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/generate_pitch', { idea });
      setSlides(res.data);
      setActiveSlide(0);
    } catch (err) {
      console.error(err);
      alert("Error generating pitch deck.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          📊 AI Pitch Deck Creator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Turn your idea into an investor-ready presentation in seconds.
        </p>

        {/* INPUT */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl mb-10 max-w-2xl mx-auto">
          <label className="text-sm text-yellow-300 font-bold block mb-2">What is your Startup?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. AI drone delivery for rural hospitals" 
              className="flex-grow p-3 rounded bg-gray-700 border border-gray-600 text-white focus:border-yellow-500 outline-none"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded font-bold transition-all shadow-lg shadow-yellow-500/30"
            >
              {loading ? "Writing Slides..." : "Generate Deck"}
            </button>
          </div>
        </div>

        {/* SLIDE VIEWER */}
        {slides.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 h-[500px]">
            
            {/* SIDEBAR (Slide List) */}
            <div className="w-full md:w-1/3 bg-gray-800 rounded-lg border border-gray-700 overflow-y-auto p-4 space-y-2">
              <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Slides Overview</h3>
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-full text-left p-3 rounded text-sm font-bold transition-all ${
                    activeSlide === index 
                      ? 'bg-yellow-600 text-black shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}. {slide.title}
                </button>
              ))}
            </div>

            {/* MAIN SLIDE DISPLAY */}
            <div className="w-full md:w-2/3 bg-white text-black rounded-lg shadow-2xl p-10 flex flex-col justify-center relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <h2 className="text-4xl font-extrabold mb-6 text-gray-900 border-b-4 border-yellow-500 inline-block pb-2">
                {slides[activeSlide].title}
              </h2>
              
              <ul className="space-y-4">
                {slides[activeSlide].content.map((point, i) => (
                  <li key={i} className="flex items-start text-lg text-gray-700">
                    <span className="text-yellow-600 mr-3 text-2xl">•</span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8 flex justify-between text-gray-400 text-sm font-bold">
                <span>StartupIQ AI</span>
                <span>Slide {activeSlide + 1} of {slides.length}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PitchDeckGenerator;