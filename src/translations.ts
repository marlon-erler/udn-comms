const englishTranslations = {
  // settings
  settings: "Settings",

  // messages
  messages: "Messages"
};

const translations = {
  en: englishTranslations,
};

export function getText(key: keyof typeof englishTranslations): string {
  const language = navigator.language.substring(0, 2);
  if (translations[language]) {
    return translations[language][key];
  }
  return translations.en[key];
}
