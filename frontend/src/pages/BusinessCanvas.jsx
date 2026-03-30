import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useUsageLimit } from '../hooks/useUsageLimit';
import LimitModal from '../components/LimitModal';
import jsPDF from 'jspdf';
import { LayoutGrid, Sparkles, Download } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const canvasBlocks = [
  { key: 'keyPartners', icon: '🤝', color: 'blue' },
  { key: 'keyActivities', icon: '⚡', color: 'purple' },
  { key: 'keyResources', icon: '🔑', color: 'emerald' },
  { key: 'valuePropositions', icon: '💎', color: 'pink' },
  { key: 'customerRelationships', icon: '❤️', color: 'red' },
  { key: 'channels', icon: '📣', color: 'orange' },
  { key: 'customerSegments', icon: '👥', color: 'cyan' },
  { key: 'costStructure', icon: '💸', color: 'yellow' },
  { key: 'revenueStreams', icon: '💰', color: 'green' },
];

const BusinessCanvas = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { checkAndIncrementUsage, showLimitModal, closeLimitModal } = useUsageLimit();

  const [formData, setFormData] = useState({ startupName: '', description: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.startupName || !formData.description) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!checkAndIncrementUsage()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/api/canvas`, formData);
      setResult(response.data);
      showToast('Business Canvas generated!', 'success');
    } catch (err) {
      showToast('Failed to generate canvas. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!result) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;

      // Header
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('Business Model Canvas', margin, 18);
      doc.setFontSize(12);
      doc.text(`${formData.startupName} — ${new Date().toLocaleDateString()}`, margin, 28);

      let yPos = 50;
      const contentWidth = pageWidth - margin * 2;

      canvasBlocks.forEach((block) => {
        const title = t(`canvas.${block.key}`);
        const content = result.canvas?.[block.key];

        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text(`${block.icon} ${title}`, margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        if (Array.isArray(content)) {
          content.forEach(item => {
            const lines = doc.splitTextToSize(`• ${item}`, contentWidth);
            doc.text(lines, margin + 5, yPos);
            yPos += lines.length * 5 + 2;
          });
        } else {
          const lines = doc.splitTextToSize(String(content || 'N/A'), contentWidth);
          doc.text(lines, margin + 5, yPos);
          yPos += lines.length * 5;
        }

        yPos += 8;
      });

      doc.save(`${formData.startupName}_Business_Canvas.pdf`);
      showToast('PDF downloaded!', 'success');
    } catch (err) {
      showToast('Error generating PDF', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block bg-purple-900/50 text-purple-300 border border-purple-700/50 text-xs font-bold px-3 py-1 rounded-full mb-3">
            AI Business Strategist
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3 justify-center md:justify-start">
            <LayoutGrid className="w-9 h-9 text-purple-400" />
            {t('canvas.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t('canvas.subtitle')}</p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{t('canvas.startupName')} *</label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                placeholder="e.g., EcoRide"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{t('canvas.description')} *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="Describe your startup idea in detail..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('canvas.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('canvas.generateBtn')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Result */}
        {result && result.canvas && (
          <div className="animate-fade-in-up">
            {/* Download Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadPdf}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all shadow-lg"
              >
                <Download className="w-4 h-4" />
                {t('canvas.downloadPdf')}
              </button>
            </div>

            {/* Canvas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {canvasBlocks.map((block) => (
                <div
                  key={block.key}
                  className={`bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-${block.color}-500/50 transition-all ${
                    block.key === 'costStructure' || block.key === 'revenueStreams' ? 'md:col-span-1' : ''
                  } ${block.key === 'valuePropositions' ? 'md:row-span-2' : ''}`}
                >
                  <h3 className={`text-sm font-bold text-${block.color}-400 mb-3 flex items-center gap-2`}>
                    <span className="text-lg">{block.icon}</span>
                    {t(`canvas.${block.key}`)}
                  </h3>
                  <ul className="space-y-2">
                    {(Array.isArray(result.canvas[block.key])
                      ? result.canvas[block.key]
                      : [result.canvas[block.key]]
                    ).map((item, i) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-gray-600">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
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

export default BusinessCanvas;
