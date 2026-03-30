import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const SharedReport = () => {
  const { shareId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [shareId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shared/${shareId}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        setError('Report not found or link has expired.');
      }
    } catch (err) {
      setError('Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading shared report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 rounded-2xl border border-gray-700 p-12 max-w-md">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Report Unavailable</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const result = report?.result || {};

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 text-white">
      <div className="max-w-3xl mx-auto">

        {/* Shared Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <ExternalLink className="w-4 h-4" />
            Shared Report — StartupIQ
          </div>
          <h1 className="text-3xl font-bold">{report?.name || 'Startup Analysis'}</h1>
          <p className="text-gray-500 text-sm mt-2">
            Generated on {new Date(report?.date).toLocaleDateString()}
          </p>
        </div>

        {/* Score */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-6 text-center">
          <div className={`inline-flex w-28 h-28 rounded-full border-8 items-center justify-center text-3xl font-bold ${
            result.score > 70 ? 'border-emerald-500 text-emerald-400' :
            result.score > 40 ? 'border-yellow-500 text-yellow-400' :
            'border-red-500 text-red-400'
          }`}>
            {result.score || 0}%
          </div>
          <p className="text-gray-500 mt-3 text-sm uppercase tracking-wide font-bold">Success Probability</p>
        </div>

        {/* Analysis */}
        {result.analysis && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-3">AI Verdict</h3>
            <p className="text-gray-300 leading-relaxed">{result.analysis}</p>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-3">Recommendations</h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-gray-400 text-sm flex gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {typeof rec === 'object' ? `${rec.title}: ${rec.tip || rec.content}` : rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-xs">
          Powered by StartupIQ — AI-Powered Startup Feasibility Analyzer
        </div>
      </div>
    </div>
  );
};

export default SharedReport;
