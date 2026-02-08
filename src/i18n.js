import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationCA from './locales/ca/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
    ca: {
        translation: translationCA
    },
    es: {
        translation: translationES
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ca', // Default language
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie']
        }
    });

export default i18n;
