import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, isRTL } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  rtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  rtl: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('vsa-lang');
    return (saved as Lang) || 'fr';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('vsa-lang', newLang);
  };

  const rtl = isRTL(lang);

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'darija' ? 'ar' : lang;
  }, [lang, rtl]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, rtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
