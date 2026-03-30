import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useUsageLimit } from '../hooks/useUsageLimit';
import LimitModal from '../components/LimitModal';
import { Swords, Search, Shield, AlertTriangle, Target } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const CompetitorAnalysis = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { checkAndIncrementUsage, showLimitModal, closeLimitModal } = useUsageLimit();

  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    description: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.startupName || !formData.description) {
      showToast('Please fill in startup name and description', 'error');
      return;
    }

    if (!checkAndIncrementUsage()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/api/competitors`, formData);
      setResult(response.data);
      showToast('Competitor analysis complete!', 'success');
    } catch (err) {
      showToast('Failed to analyze competitors. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const threatColors = {
    High: 'text-red-400 bg-red-900/30 border-red-500/30',
    Medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30',
    Low: 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30',
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block bg-red-900/50 text-red-300 border border-red-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3">
            AI Competitive Intelligence
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3 justify-center md:justify-start">
            <Swords className="w-9 h-9 text-red-400" />
            {t('competitors.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t('competitors.subtitle')}</p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('competitors.startupName')} *</label>
                <input
                  type="text"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleChange}
                  placeholder="e.g., FreshKart"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">{t('competitors.industry')} *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                >
                  <option value="">Select sector...</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Edtech">Edtech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="SAAS">SAAS</option>
                  <option value="Food & Delivery">Food & Delivery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{t('competitors.description')} *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe what your startup does..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('competitors.analyzing')}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  {t('competitors.analyzeBtn')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && result.competitors && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-red-400" />
              {t('competitors.results')}
            </h2>

            {/* Summary */}
            {result.summary && (
              <p className="text-gray-400 text-sm mb-6 p-4 bg-gray-700/50 rounded-xl border-l-4 border-red-500">{result.summary}</p>
            )}

            {/* Competitor Cards */}
            <div className="space-y-4">
              {result.competitors.map((comp, i) => (
                <div key={i} className="bg-gray-700/40 rounded-xl p-5 border border-gray-600 hover:border-gray-500 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                    <span className={`inline-block mt-2 md:mt-0 text-xs font-bold px-3 py-1 rounded-full border ${threatColors[comp.threatLevel] || threatColors['Medium']}`}>
                      {t('competitors.threatLevel')}: {comp.threatLevel}
                    </span>
                  </div>

                  {comp.marketPosition && (
                    <p className="text-gray-400 text-sm mb-3">{comp.marketPosition}</p>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {t('competitors.strengths')}
                      </h4>
                      <ul className="space-y-1">
                        {(Array.isArray(comp.strengths) ? comp.strengths : [comp.strengths]).map((s, j) => (
                          <li key={j} className="text-gray-300 text-sm flex gap-2">
                            <span className="text-emerald-500">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t('competitors.weaknesses')}
                      </h4>
                      <ul className="space-y-1">
                        {(Array.isArray(comp.weaknesses) ? comp.weaknesses : [comp.weaknesses]).map((w, j) => (
                          <li key={j} className="text-gray-300 text-sm flex gap-2">
                            <span className="text-red-500">−</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <LimitModal isOpen={showLimitModal} onClose={closeLimitModal} />
    </div>
  );
};

export default CompetitorAnalysis;
