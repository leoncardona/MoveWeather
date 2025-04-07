import React from 'react';
import { useTranslation } from '../i18n/TranslationContext';

export function LanguageSwitcher() {
  const { lang, changeLang } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLang('en')}
        className={`px-2 py-1 rounded ${
          lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLang('es')}
        className={`px-2 py-1 rounded ${
          lang === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        ES
      </button>
    </div>
  );
}
