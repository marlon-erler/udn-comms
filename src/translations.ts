const englishTranslations = {
  // general
  set: "Set",
  back: "Back",
  undoChanges: "Undo changes",
  close: "Close",

  // overview
  overview: "Overview",

  personal: "You",
  connection: "Connection",
  chats: "Chats",

  yourName: "Your Name",
  namePlaceholder: "Jane Doe",

  encryptionUnavailableTitle: "Encryption is not available",
  encryptionUnavailableMessage:
    "Obtain this app via HTTPS or continue without encryption",

  serverAddress: "Server Address",
  serverAddressPlaceholder: "wss://192.168.0.69:3000",

  connectToServer: "Connect",
  disconnect: "Disonnect",

  mailbox: "Mailbox",
  requestMailbox: "Enable",
  deleteMailbox: "Disable",
  mailboxExplanation:
    "When you're disconnected, messages will be kept on the server temporarily",

  newChatPrimaryChannel: "Primary channel",
  newChatNamePlaceholder: "my-channel",
  addChat: "Add",
  removeChat: "Remove chat",

  // messages
  showChatOptions: "show chat options",
  configureChatTitle: "Configure Chat",
  
  primaryChannel: "Primary channel",
  primaryChannelPlaceholder: "my-channel",

  secondaryChannel: "Secondary channel",
  secondaryChannelPlaceholder: "Add secondary channel",
  addSecondaryChannel: "Add secondary channel",
  removeSecondaryChannel: "Remove secondary channel",

  encryptionKey: "Encryption key",
  encryptionKeyPlaceholder: "n10d2482dg283hg",

  noChatSelected: "No chat selected",

  composerPlaceholder: "Type a message...",
  sendMessage: "Send",

  decryptMessage: "Decrypt message",
  copyMessage: "Copy message",
  deleteMessage: "Delete message",
};

const allTranslations: { [key: string]: typeof englishTranslations } = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
