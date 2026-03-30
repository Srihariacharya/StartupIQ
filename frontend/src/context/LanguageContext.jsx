import React, { createContext, useState, useContext, useCallback } from 'react';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import kn from '../locales/kn.json';

const translations = { en, hi, kn };

const languageNames = {
  en: 'English',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ'
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('startupiq_lang') || 'en';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('startupiq_lang', lang);
  }, []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    // Fallback to English if translation not found
    if (value === undefined) {
      let fallback = translations['en'];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      return fallback || key;
    }
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languageNames, availableLanguages: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
