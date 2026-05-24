import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: translations.en },
      'pt-BR': { common: translations['pt-BR'] },
      'zh-CN': { common: translations['zh-CN'] },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
