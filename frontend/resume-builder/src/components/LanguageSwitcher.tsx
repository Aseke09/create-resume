import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const languages = [
  { code: 'en', short: 'EN' },
  { code: 'ru', short: 'RU' },
  { code: 'kz', short: 'KZ' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentCode = i18n.language.split('-')[0]
  const currentLang = languages.find((lang) => lang.code === currentCode) || languages[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
      >
        {currentLang.short}
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-20 bg-white border border-gray-200 rounded-md shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              {lang.short}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;