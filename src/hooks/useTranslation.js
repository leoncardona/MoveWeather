import { useEffect, useState } from 'react';
import { translations, defaultLanguage, supportedLanguages } from '../i18n/config';

export const useTranslation = () => {
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

  return { t, lang, changeLang };
};
