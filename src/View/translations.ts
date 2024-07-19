const englishTranslations = {
  general: {
    closeButton: "close",
  },

  homePage: {
    appName: "Comms",

    ///

    overviewHeadline: "Overview",

    statusHeadline: "Status",
    settingsButton: "Settings",

    ///

    chatsHeadline: "Chats",

    addChatAudioLabel: "name of new chat",
    addChatPlaceholder: "Add chat",
    addChatButton: "Add chat",
  },

  settings: {
    settingsHeadline: "Settings",
    
    ///

    
  }
};

const allTranslations: { [language: string]: typeof englishTranslations } = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translations = allTranslations[language] || allTranslations.en;
