const englishTranslations = {
  // general
  set: "Set",
  save: "Save",
  back: "Back",
  undoChanges: "Undo changes",
  close: "Close",
  discard: "Discard",

  zoomOut: "zoom out",
  zoomIn: "zoom in",

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
  disconnect: "Disconnect",

  mailbox: "Mailbox",
  requestMailbox: "Enable",
  deleteMailbox: "Disable",
  mailboxExplanation:
    "When you're disconnected, messages will be kept on the server temporarily",

  outbox: "Outbox",
  outboxText: (count: number) => {
    switch (count) {
      case 0:
        return "All items sent";
      case 1:
        return "1 item in outbox";
      default:
        return `${count} items in outbox`;
    }
  },

  primaryChannel: "Primary channel",
  primaryChannelPlaceholder: "my-channel",
  addChat: "Add",

  // chat
  showChatOptions: "show chat options",
  configureChatTitle: "Configure Chat",

  secondaryChannel: "Secondary channel",
  secondaryChannelPlaceholder: "Add secondary channel",
  addSecondaryChannel: "Add secondary channel",
  removeSecondaryChannel: "Remove secondary channel",

  encryptionKey: "Encryption key",
  encryptionKeyPlaceholder: "n10d2482dg283hg",
  showKey: "Show key",

  clearObjects: "Delete all objects",
  clearChatMessages: "Clear chat messages",
  removeChat: "Remove chat",

  messageInOutbox: "Pending",

  noChatSelected: "No chat selected",

  composerPlaceholder: "Type a message...",
  sendMessage: "Send",

  // messages
  resendMessage: "Resend message",
  decryptMessage: "Decrypt message",
  copyMessage: "Copy message",
  deleteMessage: "Delete message",

  // objects
  showObjects: "show objects",
  createObject: "create object",
  untitledObject: "Untitled Object",

  viewAll: "All",
  viewNotes: "Notes",

  noObjects: "No objects",
  noNotes: "No notes",

  objectTitle: "Object title",
  objectTitlePlaceholder: "My object",

  objectVersion: "Object version",
  note: "Note",
  noteContentPlaceholder: "Take a note...",
  category: "Category",
  priority: "Priority",
  priorityPlaceholder: "2",
  categoryPlaceholder: "Define a category",
  date: "Date",
  time: "Time",

  resendObjects: "Resend all objects",
  deleteObject: "Delete object",
};

const allTranslations: { [key: string]: typeof englishTranslations } = {
  en: englishTranslations,
  es: {
    // general
    set: "Guardar",
    save: "Guardar",
    back: "Atrás",
    undoChanges: "Deshacer",
    close: "Cerrar",
    discard: "Descartar",

    zoomOut: "alejar",
    zoomIn: "acercar",

    // overview
    overview: "Resumen",

    connection: "Conexión",
    chats: "Chats",

    yourName: "Tu nombre",
    namePlaceholder: "Juan Pérez",

    encryptionUnavailableTitle: "Cifrado no disponible",
    encryptionUnavailableMessage:
      "Obtén esta aplicación a traves de HTTPS o continúa sin cifrado",

    serverAddress: "Dirección del servidor",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",

    connectToServer: "Conectar",
    disconnect: "Desconectar",

    mailbox: "Buzón",
    requestMailbox: "Activar",
    deleteMailbox: "Desactivar",
    mailboxExplanation:
      "Si estás sin conexión, los mensajes se guardarán temporalmente en el servidor",

    outbox: "Bandeja de salida",
    outboxText: (count: number) => {
      switch (count) {
        case 0:
          return "Todos los elementos enviados";
        case 1:
          return "1 elemento en bandeja de salida";
        default:
          return `${count} elementos en bandeja de salida`;
      }
    },

    primaryChannel: "Canal principal",
    primaryChannelPlaceholder: "mi-canal",
    addChat: "Añadir",

    // chat
    showChatOptions: "Mostrar opciones del chat",
    configureChatTitle: "Configurar chat",

    secondaryChannel: "Canal secundario",
    secondaryChannelPlaceholder: "Añadir canal secundario",
    addSecondaryChannel: "Añadir canal secundario",
    removeSecondaryChannel: "Eliminar canal secundario",

    encryptionKey: "Clave de cifrado",
    encryptionKeyPlaceholder: "n10d2482dg283hg",
    showKey: "Mostrar clave",

    clearObjects: "Eliminar todos los objetos",
    clearChatMessages: "Eliminar todos los mensajes",
    removeChat: "Eliminar chat",

    messageInOutbox: "Pendiente",

    noChatSelected: "Selecciona un chat",

    composerPlaceholder: "Escribe un mensaje...",
    sendMessage: "Enviar",

    // messages
    resendMessage: "Reenviar mensaje",
    decryptMessage: "Descifrar mensaje",
    copyMessage: "Copiar mensaje",
    deleteMessage: "Eliminar este mensaje",

    // objects
    showObjects: "mostrar objetos",
    createObject: "añadir nuevo objeto",
    untitledObject: "Sin Título",

    viewAll: "Todos",
    viewNotes: "Notas",

    noObjects: "Sin objetos",
    noNotes: "Sin notas",

    objectTitle: "Título",
    objectTitlePlaceholder: "Mi objeto",

    objectVersion: "Version del objeto",
    note: "Nota",
    noteContentPlaceholder: "Toma nota...",

    resendObjects: "Reenviar todos objetos",
    deleteObject: "Eliminar objeto",
  },
  de: {
    // general
    set: "OK",
    save: "Sichern",
    back: "Zurück",
    undoChanges: "Änderungen verwerfen",
    close: "Schließen",
    discard: "Verwerfen",

    zoomOut: "verkleinern",
    zoomIn: "vergrößern",

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

    outbox: "Ausgang",
    outboxText: (count: number) => {
      switch (count) {
        case 0:
          return "Alle Nachrichten gesendet";
        case 1:
          return "Eine Nachricht ausstehend";
        default:
          return `${count} Nachrichten ausstehend`;
      }
    },

    primaryChannel: "Hauptkanal",
    primaryChannelPlaceholder: "mein-kanal",
    addChat: "Hinzufügen",

    // chat
    showChatOptions: "Chatoptionen einblenden",
    configureChatTitle: "Chat konfigurieren",

    secondaryChannel: "Zweitkanal",
    secondaryChannelPlaceholder: "Zweitkanal hinzufügen",
    addSecondaryChannel: "Zweitkanal hinzufügen",
    removeSecondaryChannel: "Zweitkanal entfernen",

    encryptionKey: "Schlüssel",
    encryptionKeyPlaceholder: "n10d2482dg283hg",
    showKey: "Schlüssel anzeigen",

    clearObjects: "Alle Objekte löschen",
    clearChatMessages: "Nachrichtenverlauf leeren",
    removeChat: "Chat löschen",

    messageInOutbox: "Ausstehend",

    noChatSelected: "Kein Chat ausgewählt",

    composerPlaceholder: "Neue Nachricht...",
    sendMessage: "Senden",

    // messages
    resendMessage: "Erneut senden",
    decryptMessage: "Nachricht entschlüsseln",
    copyMessage: "Nachricht kopieren",
    deleteMessage: "Nachricht löschen",

    // objects
    showObjects: "Objekte anzeigen",
    createObject: "Neues Objekt erstellen",
    untitledObject: "Unbenannt",

    viewAll: "Alle",
    viewNotes: "Notizen",

    noObjects: "Keine Objekte",
    noNotes: "Keine Notizen",

    objectTitle: "Titel",
    objectTitlePlaceholder: "Mein Objekt",

    objectVersion: "Version des Objekts",
    note: "Notiz",
    noteContentPlaceholder: "Notiz eingeben...",

    resendObjects: "Objekte erneut senden",
    deleteObject: "Objekt löschen",
  },
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
