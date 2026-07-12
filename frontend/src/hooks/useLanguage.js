import { useState, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const LANG_KEY = 'pm_lang';
const LANG_ORDER = ['ko', 'en', 'ja', 'zh'];

const LOCALE_MAP = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'ko';
  });

  const setLang = useCallback((newLang) => {
    localStorage.setItem(LANG_KEY, newLang);
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    const idx = LANG_ORDER.indexOf(lang);
    const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    setLang(next);
  }, [lang, setLang]);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.ko[key] || translations.en[key] || key;
  }, [lang]);

  const locale = LOCALE_MAP[lang] || 'ko-KR';

  return { lang, locale, setLang, toggleLang, t, availableLangs: LANG_ORDER };
}
