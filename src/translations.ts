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
  disconnect: "Disonnect",
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
  mailbox: "Mailbox",
  requestMailbox: "Enable",
  deleteMailbox: "Disable",
  mailboxExplanation:
    "If you can't receive messages, they will be kept on the server temporarily",

  // messages
  messages: "Messages",
  composerPlaceholder: "Type a message...",
  sendMessage: "Send",
  clearHistory: "Clear history",
  encryptionUnavailableTitle: "Encryption is not available",
  encryptionUnavailableMessage:
    "Obtain this app via HTTPS or continue without encryption",

  decryptMessage: "Decrypt message",
  copyMessage: "Copy message",
  deleteMessage: "Delete message",
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
    disconnect: "Desconectar",
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
    mailbox: "Buzón",
    requestMailbox: "Activar",
    deleteMailbox: "Desactivar",
    mailboxExplanation:
      "Si no puedes recibir mensajes, se guardarán temporalmente en el servidor",

    // messages
    messages: "Mensajes",
    composerPlaceholder: "Escribe un mensaje...",
    sendMessage: "Enviar",
    clearHistory: "Borrar historial",
    encryptionUnavailableTitle: "Cifrado no disponible",
    encryptionUnavailableMessage:
      "Obtén esta página a través de HTTPS para cifrar o continúa sin cifrado",

    decryptMessage: "Descifrar mensaje",
    copyMessage: "Copiar mensaje",
    deleteMessage: "Eliminar mensaje",
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
    disconnect: "Trennen",
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
    mailbox: "Briefkasten",
    requestMailbox: "Aktivieren",
    deleteMailbox: "Deaktivieren",
    mailboxExplanation:
      "Nachrichten werden temporär auf dem Server gespeichert, wenn du sie nicht empfangen kannst",

    // messages
    messages: "Nachrichten",
    composerPlaceholder: "Neue Nachricht...",
    sendMessage: "Senden",
    clearHistory: "Nachrichtenverlauf leeren",
    encryptionUnavailableTitle: "Verschlüsselung nicht möglich",
    encryptionUnavailableMessage:
      "Um Nachrichten zu verschlüsseln, lade diese Seite über HTTPS.",

    decryptMessage: "Nachricht entschlüsseln",
    copyMessage: "Nachricht kopieren",
    deleteMessage: "Nachricht löschen",
  },
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
