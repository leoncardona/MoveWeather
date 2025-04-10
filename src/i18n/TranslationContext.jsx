import { createContext, useContext, useEffect, useState } from 'react';
import { defaultLanguage, supportedLanguages, translations } from './config';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(defaultLanguage);

  const t = (key) => {
    if (!translations[lang]) return key;
    
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    
    return value;
  };

  const changeLang = (newLang) => {
    if (supportedLanguages.includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('lang', newLang);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0];
    if (supportedLanguages.includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ t, lang, changeLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
