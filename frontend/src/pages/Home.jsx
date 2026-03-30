import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FeatureCard = ({ title, desc, icon, link, color, className = "" }) => (
  <Link 
    to={link} 
    className={`group relative bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden flex flex-col ${className}`}
  >
    {/* Background Glow Effect */}
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${color}-500/20`}></div>
    
    <div className={`text-4xl mb-4 bg-${color}-900/50 w-16 h-16 flex items-center justify-center rounded-lg text-${color}-400 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed flex-grow">{desc}</p>
    
    <div className="mt-6 flex items-center text-sm font-bold text-gray-500 group-hover:text-white transition-colors">
      Launch Tool <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
    </div>
  </Link>
);

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white animate-fade-in">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-semibold animate-bounce-slow">
            {t('home.badge')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            {t('home.heroTitle1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {t('home.heroTitle2')}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            {t('home.heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/analyze" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:scale-105">
              {t('home.startAnalysis')}
            </Link>
            <Link to="/generate" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg border border-gray-700 transition-all hover:scale-105">
              {t('home.getIdeas')}
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">{t('home.sectionTitle')}</h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          
          <FeatureCard 
            title={t('home.ideaValidator')}
            desc={t('home.ideaValidatorDesc')}
            icon="🧠" 
            link="/analyze"
            color="blue"
            className="w-full sm:w-[45%] lg:w-[30%]" 
          />

          <FeatureCard 
            title={t('home.ideaGenerator')}
            desc={t('home.ideaGeneratorDesc')}
            icon="💡" 
            link="/generate"
            color="orange"
            className="w-full sm:w-[45%] lg:w-[30%]"
          />



          <FeatureCard 
            title={t('home.talentScout')}
            desc={t('home.talentScoutDesc')}
            icon="🐙" 
            link="/talent"
            color="green"
            className="w-full sm:w-[45%] lg:w-[30%]"
          />

          <FeatureCard 
            title={t('home.marketTrends')}
            desc={t('home.marketTrendsDesc')}
            icon="📈" 
            link="/market"
            color="purple"
            className="w-full sm:w-[45%] lg:w-[30%]"
          />

          {/* NEW: Competitor Analysis */}
          <FeatureCard 
            title={t('home.competitorAnalysis')}
            desc={t('home.competitorAnalysisDesc')}
            icon="⚔️" 
            link="/competitors"
            color="red"
            className="w-full sm:w-[45%] lg:w-[30%]"
          />

          {/* NEW: Business Canvas */}
          <FeatureCard 
            title={t('home.businessCanvas')}
            desc={t('home.businessCanvasDesc')}
            icon="📋" 
            link="/canvas"
            color="cyan"
            className="w-full sm:w-[45%] lg:w-[30%]"
          />

        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>{t('home.footer')}</p>
      </footer>

    </div>
  );
};

export default Home;