import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enLogin from './locales/en/login.json';
import enSignUp from './locales/en/signup.json';
import enGeneral from './locales/en/general.json'
import enLanding from './locales/en/landing.json'
import enCreateResume from './locales/en/createResume.json'
import enProfileInfo from './locales/en/profileInfo.json'

import ruLogin from './locales/ru/login.json';
import ruSignUp from './locales/ru/signup.json';
import ruGeneral from './locales/ru/general.json'
import ruLanding from './locales/ru/landing.json'
import ruCreateResume from './locales/ru/createResume.json'
import ruProfileInfo from './locales/ru/profileInfo.json'

import kzLogin from './locales/kz/login.json';
import kzSignUp from './locales/kz/signup.json';
import kzGeneral from './locales/kz/general.json'
import kzLanding from './locales/kz/landing.json'
import kzCreateResume from './locales/kz/createResume.json'
import kzProfileInfo from './locales/kz/profileInfo.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'kz'],
    nonExplicitSupportedLngs: true,
    debug: false,
    ns: ['login', 'signup', 'general', 'landing', 'createResume', 'profileInfo'],
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    resources: {
        en: {
        login: enLogin,
        signup: enSignUp,
        general: enGeneral,
        landing: enLanding,
        createResume: enCreateResume,
        profileInfo: enProfileInfo,
      },
      ru: {
        login: ruLogin,
        signup: ruSignUp,
        general: ruGeneral,
        landing: ruLanding,
        createResume: ruCreateResume,
        profileInfo: ruProfileInfo,
      },
      kz: {
        login: kzLogin,
        signup: kzSignUp,
        general: kzGeneral,
        landing: kzLanding,
        createResume: kzCreateResume,
        profileInfo: kzProfileInfo,
      },
    },
    interpolation: {
        escapeValue: false,
    },
  });

  export default i18n;
