const englishTranslations = {
  // general
  set: "Set",
  back: "Back",
  undoChanges: "Undo changes",
  close: "Close",

  // overview
  overview: "Overview",

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

  primaryChannel: "Primary channel",
  primaryChannelPlaceholder: "my-channel",
  addChat: "Add",

  // messages
  showChatOptions: "show chat options",
  toggleChatTools: "toggle chat tools",
  configureChatTitle: "Configure Chat",

  secondaryChannel: "Secondary channel",
  secondaryChannelPlaceholder: "Add secondary channel",
  addSecondaryChannel: "Add secondary channel",
  removeSecondaryChannel: "Remove secondary channel",

  encryptionKey: "Encryption key",
  encryptionKeyPlaceholder: "n10d2482dg283hg",
  showKey: "Show key",

  removeChat: "Remove chat",
  clearChatMessages: "Clear chat messages",

  messageInOutbox: "Pending",

  noChatSelected: "No chat selected",

  composerPlaceholder: "Type a message...",
  sendMessage: "Send",

  resendMessage: "Resend message",
  decryptMessage: "Decrypt message",
  copyMessage: "Copy message",
  deleteMessage: "Delete message",
};

const allTranslations: { [key: string]: typeof englishTranslations } = {
  en: englishTranslations,
  es: {
    // general
    set: "Guardar",
    back: "Atrás",
    undoChanges: "Deshacer",
    close: "Cerrar",

    // overview
    overview: "Resumen",

    connection: "Conexion",
    chats: "Chats",

    yourName: "Tu nombre",
    namePlaceholder: "Juan Pérez",

    encryptionUnavailableTitle: "Cifrado no disponible",
    encryptionUnavailableMessage:
      "Obtén esta aplicación a traves de HTTPS o continúa sin cifrado",

    serverAddress: "Direccion del servidor",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",

    connectToServer: "Conectar",
    disconnect: "Desconectar",

    mailbox: "Buzón",
    requestMailbox: "Activar",
    deleteMailbox: "Desactivar",
    mailboxExplanation:
      "Si estás sin conexión, los mensajes se guardarán temporalmente en el servidor",

    primaryChannel: "Canal principal",
    primaryChannelPlaceholder: "mi-canal",
    addChat: "Añadir",

    // messages
    showChatOptions: "Mostrar opciones del chat",
    configureChatTitle: "Configurar chat",

    secondaryChannel: "Canal segundario",
    secondaryChannelPlaceholder: "Añadir canal segundario",
    addSecondaryChannel: "Añadir canal segundario",
    removeSecondaryChannel: "Eliminar canal segundario",

    encryptionKey: "Clave de cifrado",
    encryptionKeyPlaceholder: "n10d2482dg283hg",
    showKey: "Mostrar clave",

    removeChat: "Eliminar chat",
    clearChatMessages: "Eliminar todos mensajes",

    noChatSelected: "Selecciona un chat",

    messageInOutbox: "Pendiente",

    composerPlaceholder: "Escribe un mensaje...",
    sendMessage: "Enviar",

    resendMessage: "Enviar de nuevo",
    decryptMessage: "Descifrar mensaje",
    copyMessage: "Copiar mensaje",
    deleteMessage: "Eliminar este mensaje",
  },
  de: {
    // general
    set: "OK",
    back: "Zurück",
    undoChanges: "Änderungen verwerfen",
    close: "Schließen",

    // overview
    overview: "Übersicht",

    connection: "Verbindung",
    chats: "Chats",

    yourName: "Dein Name",
    namePlaceholder: "Max Mustermann",

    encryptionUnavailableTitle: "Verschlüsselung nicht möglich",
    encryptionUnavailableMessage:
      "Lade diese app über HTTPS, um Nachrichten zu verschlüsseln",

    serverAddress: "Serveradresse",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",

    connectToServer: "Verbinden",
    disconnect: "Trennen",

    mailbox: "Briefkasten",
    requestMailbox: "Aktivieren",
    deleteMailbox: "Deaktivieren",
    mailboxExplanation:
      "Wenn du offline bist, werden Nachrichten auf dem Server gelagert",

    primaryChannel: "Hauptkanal",
    primaryChannelPlaceholder: "mein-kanal",
    addChat: "Hinzufügen",

    // messages
    showChatOptions: "Chatoptionen einblenden",
    configureChatTitle: "Chat konfigurieren",

    secondaryChannel: "Zweitkanal",
    secondaryChannelPlaceholder: "Zweitkanal hinzufügen",
    addSecondaryChannel: "Zweitkanal hinzufügen",
    removeSecondaryChannel: "Zweitkanal entfernen",

    encryptionKey: "Schlüssel",
    encryptionKeyPlaceholder: "n10d2482dg283hg",
    showKey: "Schlüssel anzeigen",

    removeChat: "Chat löschen",
    clearChatMessages: "Nachrichtenverlauf leeren",

    noChatSelected: "Kein Chat ausgewählt",

    messageInOutbox: "Ausstehend",

    composerPlaceholder: "Neue Nachricht...",
    sendMessage: "Senden",

    resendMessage: "Erneut senden",
    decryptMessage: "Nachricht entschlüsseln",
    copyMessage: "Nachricht kopieren",
    deleteMessage: "Nachricht löschen",
  },
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
