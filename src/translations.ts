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
  serverAddressPlaceholder: "wss://192.168.0.69:3000",
  connectToServer: "Connect",
  primaryChannel: "Primary channel",
  leaveChannel: "Leave",
  channelPlaceholder: "my-channel",
  addSecondaryChannel: "Add secondary channel",
  removeSecondaryChannel: "Remove secondary channel",
  newSecondaryChannelPlaceholder: "Add secondary channel",
  encryptionKey: "Encryption key",
  encryptionKeyPlaceholder: "1jg028ej40d",
  showEncryptionKey: "Show encryption key",
  myName: "My Name",
  yourNamePlaceholder: "Jane Doe",

  // messages
  messages: "Messages",
  composerPlaceholder: "Type a message...",
  sendMessage: "Send",
  clearHistory: "Clear history",
  encryptionUnavailableTitle: "Encryption is not available",
  encryptionUnavailableMessage:
    "Obtain this app via HTTPS or continue without encryption",
};

const allTranslations: { [key: string]: typeof englishTranslations } = {
  en: englishTranslations,
  es: {
    // general
    setInput: "OK",
    connectionStatus: "Estado de Conexión",
    connectedTo: (server: string) => `Conectado a "${server}"`,
    disconnected: "Desconectado",

    // settings
    settings: "Configuración",
    connection: "Conexión",
    communication: "Comunicación",
    encryption: "Cifrado",
    serverAddress: "Dirección del servidor",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",
    connectToServer: "Conectar",
    primaryChannel: "Canal principal",
    leaveChannel: "Salir",
    channelPlaceholder: "mi-canal",
    addSecondaryChannel: "Añadir canal segundario",
    removeSecondaryChannel: "Eliminar canal segundario",
    newSecondaryChannelPlaceholder: "Añadir canal segundario",
    encryptionKey: "Clave de cifrada",
    encryptionKeyPlaceholder: "1jg028ej40d",
    showEncryptionKey: "Mostrar clave de cifrado",
    myName: "Mi nombre",
    yourNamePlaceholder: "Juan Pérez",

    // messages
    messages: "Mensajes",
    composerPlaceholder: "Escribe un mensaje...",
    sendMessage: "Enviar",
    clearHistory: "Borrar historial",
    encryptionUnavailableTitle: "Cifrada no disponible",
    encryptionUnavailableMessage:
      "Obtén esta página por HTTPS para cifrar mensajes o continúa sin cifrado",
  },
  de: {
    // general
    setInput: "OK",
    connectionStatus: "Verbindungsstatus",
    connectedTo: (server: string) => `Verbunden mit "${server}"`,
    disconnected: "Verbindung getrennt",

    // settings
    settings: "Einstellungen",
    connection: "Verbindung",
    communication: "Kommunikation",
    encryption: "Verschlüsselung",
    serverAddress: "Serveraddresse",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",
    connectToServer: "Verbinden",
    primaryChannel: "Hauptkanal",
    leaveChannel: "Verlassen",
    channelPlaceholder: "mein-kanal",
    addSecondaryChannel: "Zweitkanal hinzufügen",
    removeSecondaryChannel: "Zweitkanal entfernen",
    newSecondaryChannelPlaceholder: "Zweitkanal hinzufügen",
    encryptionKey: "Schlüssel",
    encryptionKeyPlaceholder: "1jg028ej40d",
    showEncryptionKey: "Schlüssel anzeigen",
    myName: "Mein Name",
    yourNamePlaceholder: "Max Mustermann",

    // messages
    messages: "Nachrichten",
    composerPlaceholder: "Neue Nachricht...",
    sendMessage: "Senden",
    clearHistory: "Nachrichtenverlauf leeren",
    encryptionUnavailableTitle: "Verschlüsselung nicht möglich",
    encryptionUnavailableMessage:
      "Um Nachrichten zu verschlüsseln, lade diese Seite über HTTPS.",
  },
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
