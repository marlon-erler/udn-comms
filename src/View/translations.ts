const englishTranslations = {
  updater: {
    migrated: "Migrated",
  },

  general: {
    deleteItemButtonAudioLabel: "delete item",
    searchButtonAudioLabel: "search",

    abortButton: "Abort",
    cancelButton: "Cancel",
    closeButton: "Close",
    backButton: "Back",

    continueButton: "Continue",
    confirmButton: "Confirm",
    saveButton: "Save",
    setButton: "Set",

    fileVersionLabel: "Version",
    searchLabel: "Search",
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

    yourNameLabel: "Your name",
    yourNamePlaceholder: "Jane Doe",
    setNameButtonAudioLabel: "set name",

    firstDayOfWeekLabel: "First day of week",

    manageStorageButton: "Manage storage",

    transferDataButton: "Transfer Data",

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

  dataTransferModal: {
    transferDataHeadline: "Transfer Data",
    selectionDescription: "Select the data that you want to transfer.",
    dataEntryDescription: "Enter this data on the other device.",

    ///

    fromThisDeviceButton: "From this device",
    toThisDeviceButton: "To this device",

    ///

    generalHeadline: "General",
    
    connectionData: "Connection Data",
    settingsData: "Settings Data",
    
    chatsHeadline: "Chats",

    ///

    transferChannelHeadline: "Transfer Chanel",
    transferKeyHeadline: "Transfer Encryption Key",

    sendButton: "Send",

    ///

    sendingFiles: "Sending files...",
    filesSentCount: (count: number) => `Files sent: ${count}`
  },

  storage: {
    noItemSelected: "No item selected",
    notAFile: "(not a file)",
    contentEmpty: "(empty)",

    path: "Path",
    content: "Content",

    deleteItem: "Delete item",
  },

  chatPage: {
    closeChatAudioLabe: "close chat",
    chatSettingsAudioLabel: "chat settings",

    pages: {
      settings: "Settings",
      messages: "Messages",
      tasks: "Tasks",
      calendar: "Calendar",
    },

    settings: {
      settingsHeadline: "Settings",

      primaryChannelLabel: "Primary channel",
      setPrimaryChannelButtonAudioLabel: "set primary channel",

      newSecondaryChannelPlaceholder: "Add secondary channel",
      newSecondaryChannelAudioLabel: "name of new secondary channel",
      addSecondaryChannelButtonAudioLabel: "add secondary channel",

      encryptionKeyLabel: "Encryption key",
      setEncryptionKeyButtonAudioLabel: "set encryption key",
      showEncryptionKey: "Show encryption key",

      deleteChatButton: "Delete entire chat",
    },

    message: {
      messagesHeadline: "Messages",

      ///

      composerInputPlaceholder: "Type a message...",
      sendMessageButtonAudioLabel: "send message",

      ///

      showMessageInfoButtonAudioLabel: "show message info",
      messageInfoHeadline: "Message Info",

      sentBy: "Sent by",
      timeSent: "Time sent",
      channel: "Channel",
      messageContent: "Message content",

      copyMessageButton: "Copy message",
      resendMessageButton: "Resend message",
      decryptMessageButton: "Decrypt message",
      deleteMessageButton: "Delete message",
    },

    task: {
      newBoardNamePlaceholder: "Create a board",
      createBoardButtonAudioLabel: "create board",

      ///

      noBoardSelected: "No board selected",
      boardNotFound: "Board not found",

      ///

      closeBoard: "close board",
      showBoardSettingsButtonAudioLabel: "show board settigns",

      listViewButtonAudioLabel: "list view",
      kanbanViewButtonAudioLabel: "kanban view",
      statusViewButtonAudioLabel: "status grid view",

      filterTasksButtonAudioLabel: "filter tasks",
      createTaskButtonAudioLabel: "create new task",

      ///

      boardSettingsHeadline: "Board Settings",
      boardNameInputLabel: "Board name",
      deleteBoardButton: "Delete board and all tasks",

      ///

      taskSettingsHeadline: "Edit Task",

      taskNameLabel: "Title",

      taskCategoryLabel: "Category",
      taskStatusLabel: "Status",
      taskPriorityLabel: "Priority",

      taskDescriptionLabel: "Description",

      taskDateLabel: "Date",
      taskTimeLabel: "Time",

      deleteTaskButton: "Delete task",

      ///

      filterTasksHeadline: "Filter Tasks",

      ///

      renameCategoryInputPlaceholder: "Rename category,",
    },

    calendar: {
      todayButtonAudioLabel: "go to today",

      previousMonthButtonAudioLabel: "previous month",
      nextMonthButtonAudioLabel: "next month",

      yearInputAudioLabel: "year",
      monthInputAudioLabel: "month",

      yearInputPlaceholder: "2000",
      monthInputPlaceholder: "01",

      ///

      searchEventsHeadline: "Search Events",

      ///

      events: "Events",
      noEvents: "No events",
    },
  },
};

const allTranslations: { [language: string]: typeof englishTranslations } = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translations = allTranslations[language] || allTranslations.en;
