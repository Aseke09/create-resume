// import i18n from 'i18next';
export type SupportedLanguage = 'en' | 'ru' | 'kz';

export interface LocalizedString {
  [lang: string]: string;
  en: string;
  ru: string;
  kz: string;
}

type LangKey = keyof LocalizedString;         

export function normalizeLang(raw: string): LangKey {
  if (raw.startsWith("ru")) return "ru";
  if (raw.startsWith("kk") || raw.startsWith("kz")) return "kz";
  return "en";
}

export const getLocalizedString = (
  localized: LocalizedString,
  lang: keyof LocalizedString
): string => {
  if (!localized || typeof localized !== 'object') return '';
  return localized[lang] ?? '';
};
