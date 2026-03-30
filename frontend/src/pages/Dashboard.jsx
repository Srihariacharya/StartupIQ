import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard, Brain, TrendingUp, Trophy,
  ArrowRight, Sparkles, Clock, Target, BarChart3
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, avgScore: 0, bestScore: 0 });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentAnalyses(data.recent || []);
      }
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '🧠', label: t('home.ideaValidator'), to: '/analyze', color: 'blue' },
    { icon: '💡', label: t('home.ideaGenerator'), to: '/generate', color: 'orange' },
    { icon: '💰', label: t('home.valuationTool'), to: '/valuation', color: 'emerald' },
    { icon: '⚔️', label: t('home.competitorAnalysis'), to: '/competitors', color: 'red' },
    { icon: '📋', label: t('home.businessCanvas'), to: '/canvas', color: 'purple' },
  ];

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
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-400" />
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-400 mt-1">
            {t('dashboard.welcome')} <span className="text-blue-400 font-semibold">{user?.name}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label={t('dashboard.totalAnalyses')}
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label={t('dashboard.avgScore')}
            value={`${stats.avgScore}%`}
            color="purple"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            label={t('dashboard.bestScore')}
            value={`${stats.bestScore}%`}
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Analyses */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                {t('dashboard.recentAnalyses')}
              </h2>
              <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                {t('dashboard.viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">{t('dashboard.noAnalyses')}</p>
                <Link to="/analyze" className="inline-block mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all">
                  {t('home.startAnalysis')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.slice(0, 5).map((analysis, i) => (
                  <div key={analysis.id || i} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all group">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{analysis.name || 'Untitled'}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(analysis.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                      (analysis.result?.score || 0) > 70 ? 'bg-emerald-900/40 text-emerald-400' :
                      (analysis.result?.score || 0) > 40 ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-red-900/40 text-red-400'
                    }`}>
                      {analysis.result?.score || 0}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {t('dashboard.quickActions')}
            </h2>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all group"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm font-medium flex-1">{action.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-${color}-500/50 transition-all group`}>
    <div className={`w-12 h-12 rounded-xl bg-${color}-900/50 flex items-center justify-center text-${color}-400 mb-3 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

export default Dashboard;
