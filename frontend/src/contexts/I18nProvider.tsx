'use client';

import { ReactNode, useEffect, useState } from 'react';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Restore saved language — runs after hydration, so SSR + first client render
    // both use 'en' and the DOM matches, preventing hydration errors.
    const saved = localStorage.getItem('lineskip-locale');
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    } else if (!saved) {
      // First visit: detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) {
        i18n.changeLanguage('pt-BR');
      } else if (browserLang.startsWith('zh')) {
        i18n.changeLanguage('zh-CN');
      }
    }
    setReady(true);
  }, []);

  return <>{children}</>;
}
