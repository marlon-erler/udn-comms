const englishTranslations = {
  // general
  set: "Set",
  save: "Save",
  search: "Search",
  reset: "Reset",
  back: "Back",
  undoChanges: "Undo changes",
  close: "Close",
  discard: "Discard",
  rename: "Rename",

  // settings
  settings: "Settings",
  showSettings: "Show settings",

  zoomOut: "Zoom Out",
  zoomIn: "Zoom In",

  repairApp: "Repair App",
  clearAddresses: "Clear previous connections",
  clearCategories: "Clear suggestions for object categories",
  clearStatuses: "Clear suggestions for object statuses",

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
  previousConnections: "Previous connections",

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
  objectsInTotal: "Objects in total: ",

  showObjects: "show objects",
  createObject: "create object",
  untitledObject: "Untitled Object",

  filterObjects: "Filter Objects",
  searchByTitle: "Search by title",
  searchByTitlePlaceholder: "My Object",
  searchTitleText: (term: string, resultCount: number) =>
    term == ""
      ? `Objects in total: ${resultCount}`
      : `Objects containing "${term}": ${resultCount}`,

  viewAll: "All",
  viewNotes: "Notes",
  viewKanban: "Kanban",
  viewStatus: "Status",

  noObjects: "No objects",

  objectTitle: "Object title",
  objectTitlePlaceholder: "My object",

  objectVersion: "Object version",
  note: "Note",
  noteContentPlaceholder: "Take a note...",
  category: "Category",
  categoryPlaceholder: "Define a category",
  priority: "Priority",
  priorityPlaceholder: "2",
  status: "Status",
  statusPlaceholder: "Pending",
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
    search: "Buscar",
    reset: "Restablecer",
    back: "Atrás",
    undoChanges: "Deshacer",
    close: "Cerrar",
    discard: "Descartar",
    rename: "Renombrar",

    // settings
    settings: "Configuración",
    showSettings: "Mostrar configuración",

    zoomOut: "Alejar",
    zoomIn: "Acercar",

    repairApp: "Reparar Aplicación",
    clearAddresses: "Borrar conexiones previas",
    clearCategories: "Borrar sugerencias para categorías de objetos",
    clearStatuses: "Borrar sugerencias para estados de objetos",

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
    previousConnections: "Conexiones anteriores",

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
    objectsInTotal: "Objetos en total: ",

    showObjects: "mostrar objetos",
    createObject: "añadir nuevo objeto",
    untitledObject: "Sin Título",

    filterObjects: "Filtrar objetos",
    searchByTitle: "Buscar por título",
    searchByTitlePlaceholder: "Mi Objeto",
    searchTitleText: (term: string, resultCount: number) =>
      term == ""
        ? `Objetos en total: ${resultCount}`
        : `Resultados por "${term}": ${resultCount}`,

    viewAll: "Todos",
    viewNotes: "Notas",
    viewKanban: "Kanban",
    viewStatus: "Estado",

    noObjects: "Sin objetos",

    objectTitle: "Título",
    objectTitlePlaceholder: "Mi objeto",

    objectVersion: "Version del objeto",
    note: "Nota",
    noteContentPlaceholder: "Toma nota...",
    category: "Categoría",
    categoryPlaceholder: "Define una categoría",
    priority: "Prioridad",
    priorityPlaceholder: "2",
    status: "Estado",
    statusPlaceholder: "Pendiente",
    date: "Fecha",
    time: "Hora",

    resendObjects: "Reenviar todos los objetos",
    deleteObject: "Eliminar objeto",
  },
  de: {
    // general
    set: "OK",
    save: "Sichern",
    search: "Suchen",
    reset: "Zurücksetzen",
    back: "Zurück",
    undoChanges: "Änderungen verwerfen",
    close: "Schließen",
    discard: "Verwerfen",
    rename: "Umbenennen",

    // settings
    settings: "Einstellungen",
    showSettings: "Einstellungen anzeigen",

    zoomOut: "Verkleinern",
    zoomIn: "Vergrößern",

    repairApp: "App reparieren",
    clearAddresses: "Vorherige Verbindungen löschen",
    clearCategories: "Vorschläge für Objektkategorien löschen",
    clearStatuses: "Vorschläge für Objektstaten löschen",

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
    previousConnections: "Vorherige Verbindungen",

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
    objectsInTotal: "Objekte insgesamt: ",

    showObjects: "Objekte anzeigen",
    createObject: "Neues Objekt erstellen",
    untitledObject: "Unbenannt",

    filterObjects: "Objekte filtern",
    searchByTitle: "Nach Titel suchen",
    searchByTitlePlaceholder: "Mein Objekt",
    searchTitleText: (term: string, resultCount: number) =>
      term == ""
        ? `Objekte insgesamt: ${resultCount}`
        : `Ergebnisse für "${term}": ${resultCount}`,

    viewAll: "Alle",
    viewNotes: "Notizen",
    viewKanban: "Kanban",
    viewStatus: "Status",

    noObjects: "Keine Objekte",

    objectTitle: "Titel",
    objectTitlePlaceholder: "Mein Objekt",

    objectVersion: "Version des Objekts",
    note: "Notiz",
    noteContentPlaceholder: "Notiz eingeben...",
    category: "Kategorie",
    categoryPlaceholder: "Kategorie eingeben...",
    priority: "Priorität",
    priorityPlaceholder: "2",
    status: "Status",
    statusPlaceholder: "Ausstehend",
    date: "Datum",
    time: "Uhrzeit",

    resendObjects: "Objekte erneut senden",
    deleteObject: "Objekt löschen",
  },
};

const language = navigator.language.substring(0, 2);
export const translation: typeof englishTranslations =
  allTranslations[language] ?? allTranslations.en;
