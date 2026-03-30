import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { History as HistoryIcon, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const History = () => {
  const { user, token } = useContext(AuthContext);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('history.confirmDelete'))) return;

    try {
      const response = await fetch(`${API_BASE}/api/user/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setAnalyses(prev => prev.filter(a => a.id !== id));
        showToast(t('history.deleted'), 'success');
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const filtered = analyses.filter(a =>
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-blue-400" />
            {t('history.title')}
          </h1>
          <p className="text-gray-400 mt-1">{t('history.subtitle')}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search analyses..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* Analyses List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
            <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('history.noHistory')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((analysis) => (
              <div key={analysis.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
                {/* Summary Row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{analysis.name || 'Untitled'}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{t('history.date')}: {new Date(analysis.date).toLocaleDateString()}</span>
                      {analysis.result?.funding && (
                        <span>{t('history.funding')}: ₹{Number(analysis.funding).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                      (analysis.result?.score || 0) > 70 ? 'bg-emerald-900/40 text-emerald-400' :
                      (analysis.result?.score || 0) > 40 ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-red-900/40 text-red-400'
                    }`}>
                      {analysis.result?.score || 0}%
                    </div>
                    {expandedId === analysis.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {expandedId === analysis.id && (
                  <div className="border-t border-gray-700 p-5 animate-fade-in-up">
                    <div className="space-y-4">
                      {analysis.result?.analysis && (
                        <div>
                          <h4 className="text-sm font-bold text-blue-400 mb-1">AI Verdict</h4>
                          <p className="text-gray-300 text-sm">{analysis.result.analysis}</p>
                        </div>
                      )}

                      {analysis.result?.recommendations && (
                        <div>
                          <h4 className="text-sm font-bold text-blue-400 mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {analysis.result.recommendations.map((rec, i) => (
                              <li key={i} className="text-gray-400 text-sm flex gap-2">
                                <span className="text-blue-500">•</span>
                                {typeof rec === 'object' ? `${rec.title}: ${rec.tip || rec.content}` : rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(analysis.id); }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('history.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
