const englishTranslations = {
  general: {
    closeButton: "close",
  },

  regional: {
    weekdays: {
      full: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      abbreviated: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ],
    },
  },

  homePage: {
    appName: "Comms",

    ///

    overviewHeadline: "Overview",

    serverAddress: "Server address",
    connectAudioLabel: "connect to server",
    disconnectAudioLabel: "disconnect from server",
    manageConnectionsAudioLabel: "manage connections",

    mailboxHeadline: "Server Mailbox",
    mailboxDisabled: "Mailbox disabled. You will miss out on messages sent while you're away",
    mailboxEnabled: "Mailbox enabled. If you disconnect, the server will keep your messages temporarily",

    outboxHeadline: "Outbox",
    outboxAllItemsSent: "All items sent",

    yourNameLabel: "Your name",
    setNameButton: "Set",

    firstDayOfWeekLabel: "First day of week",

    scrollToChatButton: "Chats",

    ///

    backToOverviewAudioLabel: "go back to overview",
    chatsHeadline: "Chats",

    addChatAudioLabel: "name of new chat",
    addChatPlaceholder: "Add chat",
    addChatButton: "Add chat",
  },

  settings: {
    settingsHeadline: "Settings",

    ///
  },
};

const allTranslations: { [language: string]: typeof englishTranslations } = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translations = allTranslations[language] || allTranslations.en;
