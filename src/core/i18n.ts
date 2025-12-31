import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  it: { translation: it },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  pt: { translation: pt },
};

// Detect the user's language
const getLanguage = () => {
    const locale = Localization.getLocales()[0];
    return locale?.languageCode ?? 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguage(), // set the language based on device
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
