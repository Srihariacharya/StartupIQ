import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const OnboardingTour = () => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('startupiq_tour_seen');
    if (!hasSeen) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      icon: '🚀',
      title: t('tour.welcome'),
      content: t('tour.welcomeDesc'),
    },
    {
      icon: '🧠',
      title: t('nav.ideaAnalyzer'),
      content: t('tour.step1'),
    },
    {
      icon: '💡',
      title: t('nav.ideaGen'),
      content: t('tour.step2'),
    },
    {
      icon: '💰',
      title: t('nav.valuation'),
      content: t('tour.step3'),
    },
    {
      icon: '🐙',
      title: t('nav.talentScout'),
      content: t('tour.step4'),
    },
    {
      icon: '📈',
      title: t('nav.marketTrends'),
      content: t('tour.step5'),
    },
    {
      icon: '🎉',
      title: t('tour.finish'),
      content: '',
    },
  ];

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('startupiq_tour_seen', 'true');
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" onClick={handleClose} />

      {/* Tour Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md animate-fade-in-up">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Progress Bar */}
          <div className="h-1 bg-gray-700">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">{steps[step].icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{steps[step].title}</h3>
            {steps[step].content && (
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{steps[step].content}</p>
            )}

            {/* Step Counter */}
            <div className="flex justify-center gap-1.5 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-blue-500 w-6' : 'bg-gray-600'}`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                {t('common.skip')}
              </button>

              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('common.back')}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
                >
                  {step === steps.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Let's Go!
                    </>
                  ) : (
                    <>
                      {t('common.next')}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
