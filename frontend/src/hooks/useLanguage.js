import { useState, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const LANG_KEY = 'pm_lang';

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'ko';
  });

  const setLang = useCallback((newLang) => {
    localStorage.setItem(LANG_KEY, newLang);
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  }, [lang, setLang]);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.ko[key] || key;
  }, [lang]);

  return { lang, setLang, toggleLang, t };
}
