const englishTranslations = {
  general: {
    closeButtonAudioLabel: "close",
    deleteItemButtonAudioLabel: "delete item",
    
    setButton: "Set",
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
      abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
  },

  homePage: {
    appName: "Comms",

    ///

    overviewHeadline: "Overview",

    serverAddress: "Server address",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",
    connectAudioLabel: "connect to server",
    disconnectAudioLabel: "disconnect from server",
    manageConnectionsAudioLabel: "manage connections",

    mailboxHeadline: "Server Mailbox",
    mailboxDisabled:
      "Mailbox disabled. You will miss out on messages sent while you're away",
    mailboxEnabled:
      "Mailbox enabled. If you disconnect, the server will keep your messages temporarily",

    outboxHeadline: "Outbox",
    outboxAllItemsSent: "All items sent",

    yourNameLabel: "Your name",
    yourNamePlaceholder: "Jane Doe",
    setNameButtonAudioLabel: "set name",

    firstDayOfWeekLabel: "First day of week",

    scrollToChatButton: "Chats",

    ///

    backToOverviewAudioLabel: "go back to overview",
    chatsHeadline: "Chats",

    addChatAudioLabel: "name of new chat",
    addChatPlaceholder: "Add chat",
    addChatButton: "Add chat",
  },

  connectionModal: {
    connectionModalHeadline: "Manage Connections",

    ///

    connectButtonAudioLabel: "connect",
  },

  chatPage: {
    closeChatAudioLabe: "close chat",
    chatSettingsAudioLabel: "chat settings",

    pages: {
      settings: "Settings",
      messages: "Messages",
      allObjects: "All objects",
      kanban: "Kanban",
      calendar: "Calendar",
      progress: "Progress",
    },

    settings: {
      settingsHeadline: "Settings",

      primaryChannelLabel: "Primary channel",
      setPrimaryChannelButtonAudioLabel: "set primary channel",

      newSecondaryChannelPlaceholder: "Add secondary channel",
      newSecondaryChannelAudioLabel: "name of new secondary channel",
      addSecondaryChannelButtonAudioLabel: "add secondary channel",
    }
  },
};

const allTranslations: { [language: string]: typeof englishTranslations } = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translations = allTranslations[language] || allTranslations.en;
