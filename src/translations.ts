import * as React from "bloatless-react";

import { currentAddress } from "./model";

const englishTranslations = {
  // general
  setInput: "Set",
  connectionStatus: "Connection status",
  connectedTo: (server: string) => `Connected to "${server}"`,
  disconnected: "Disconnected",

  // settings
  settings: "Settings",
  connection: "Connection",
  communication: "Communication",
  encryption: "Encryption",
  serverAddress: "Server Address",
  serverAddressPlaceholder: "ws://192.168.0.69:3000",
  connectToServer: "Connect",
  primaryChannel: "Primary channel",
  channelPlaceholder: "my-channel",
  addSecondaryChannel: "Add secondary channel",
  removeSecondaryChannel: "Remove secondary channel",
  newSecondaryChannelPlaceholder: "Add secondary channel",
  encryptionKey: "Encryption key",
  encryptionKeyPlaceholder: "1jg028ej40d",
  showEncryptionKey: "Show encryption key",
  yourName: "Your Name",
  yourNamePlaceholder: "Jane Doe",

  // messages
  messages: "Messages",
  composerPlaceholder: "Type a message...",
  sendMessage: "Send",
  clearHistory: "Clear history",
  encryptionUnavailableTitle: "Encryption is not available",
  encryptionUnavailableMessage:
    "Encryption is not available on insecure contexts. Obtain this app via HTTPS or continue without encryption",
};

const allTranslations = {
  en: englishTranslations,
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
