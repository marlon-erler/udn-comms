(() => {
  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  var i;
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = {
    randomUUID
  };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // node_modules/bloatless-react/index.ts
  function UUID() {
    return v4_default();
  }
  var State = class {
    _value;
    _bindings = /* @__PURE__ */ new Set();
    // init
    constructor(initialValue) {
      this._value = initialValue;
    }
    // value
    get value() {
      return this._value;
    }
    set value(newValue) {
      if (this._value == newValue) return;
      this._value = newValue;
      this.callSubscriptions();
    }
    // subscriptions
    callSubscriptions() {
      this._bindings.forEach((fn) => fn(this._value));
    }
    subscribe(fn) {
      this._bindings.add(fn);
      fn(this._value);
    }
    subscribeSilent(fn) {
      this._bindings.add(fn);
    }
    // stringify
    toString() {
      return JSON.stringify(this._value);
    }
  };
  var ListState = class extends State {
    additionHandlers = /* @__PURE__ */ new Set();
    removalHandlers = /* @__PURE__ */ new Map();
    // init
    constructor(initialItems) {
      super(new Set(initialItems));
    }
    // list
    add(...items) {
      items.forEach((item) => {
        this.value.add(item);
        this.additionHandlers.forEach((handler) => handler(item));
      });
      this.callSubscriptions();
    }
    remove(...items) {
      items.forEach((item) => {
        this.value.delete(item);
        if (!this.removalHandlers.has(item)) return;
        this.removalHandlers.get(item).forEach((handler) => handler(item));
        this.removalHandlers.delete(item);
      });
      this.callSubscriptions();
    }
    clear() {
      this.remove(...this.value.values());
    }
    // handlers
    handleAddition(handler) {
      this.additionHandlers.add(handler);
      [...this.value.values()].forEach(handler);
    }
    handleRemoval(item, handler) {
      if (!this.removalHandlers.has(item))
        this.removalHandlers.set(item, /* @__PURE__ */ new Set());
      this.removalHandlers.get(item).add(handler);
    }
    // stringification
    toString() {
      const array = [...this.value.values()];
      const json = JSON.stringify(array);
      return json;
    }
  };
  var MapState = class extends State {
    additionHandlers = /* @__PURE__ */ new Set();
    removalHandlers = /* @__PURE__ */ new Map();
    // init
    constructor(initialItems) {
      super(new Map(initialItems));
    }
    // list
    set(key, item) {
      this.remove(key);
      this.value.set(key, item);
      this.additionHandlers.forEach((handler) => handler(item));
      this.callSubscriptions();
    }
    remove(key) {
      const item = this.value.get(key);
      if (!item) return;
      this.value.delete(key);
      this.callSubscriptions();
      if (!this.removalHandlers.has(item)) return;
      this.removalHandlers.get(item).forEach((handler) => handler(item));
      this.removalHandlers.delete(item);
    }
    clear() {
      [...this.value.keys()].forEach((key) => this.remove(key));
    }
    // handlers
    handleAddition(handler) {
      this.additionHandlers.add(handler);
      [...this.value.values()].forEach(handler);
    }
    handleRemoval(item, handler) {
      if (!this.removalHandlers.has(item))
        this.removalHandlers.set(item, /* @__PURE__ */ new Set());
      this.removalHandlers.get(item).add(handler);
    }
    // stringification
    toString() {
      const array = [...this.value.entries()];
      const json = JSON.stringify(array);
      return json;
    }
  };
  function createProxyState(statesToSubscibe, fn) {
    const proxyState = new State(fn());
    statesToSubscibe.forEach(
      (state) => state.subscribe(() => proxyState.value = fn())
    );
    return proxyState;
  }
  function bulkSubscribe(statesToSubscibe, fn) {
    statesToSubscibe.forEach((state) => state.subscribeSilent(fn));
  }
  function persistState(localStorageKey, state) {
    state.subscribe(() => {
      const stringifiedValue = state.toString();
      localStorage.setItem(localStorageKey, stringifiedValue);
    });
  }
  function restoreState(localStorageKey, initialStateValue) {
    const storedString = localStorage.getItem(localStorageKey) ?? JSON.stringify(initialStateValue);
    const convertedValue = JSON.parse(storedString);
    const state = new State(convertedValue);
    persistState(localStorageKey, state);
    return state;
  }
  function restoreListState(localStorageKey, initialItems = []) {
    const storedString = localStorage.getItem(localStorageKey) ?? "";
    try {
      const array = JSON.parse(storedString);
      if (!Array.isArray(array)) throw "";
      initialItems = array;
    } catch {
    }
    const state = new ListState(initialItems);
    persistState(localStorageKey, state);
    return state;
  }
  function restoreMapState(localStorageKey, initialItems = []) {
    const storedString = localStorage.getItem(localStorageKey) ?? "";
    try {
      const array = JSON.parse(storedString);
      if (!Array.isArray(array)) throw "";
      initialItems = array;
    } catch {
    }
    const state = new MapState(initialItems);
    persistState(localStorageKey, state);
    return state;
  }
  function createElement(tagName, attributes = {}, ...children) {
    const element = document.createElement(tagName);
    if (attributes != null)
      Object.entries(attributes).forEach((entry) => {
        const [attributename, value] = entry;
        const [directiveKey, directiveValue] = attributename.split(":");
        switch (directiveKey) {
          case "on": {
            switch (directiveValue) {
              case "enter": {
                element.addEventListener("keydown", (e) => {
                  if (e.key != "Enter") return;
                  value();
                });
                break;
              }
              default: {
                element.addEventListener(directiveValue, value);
              }
            }
            break;
          }
          case "subscribe": {
            const state = value;
            state.subscribe(
              (newValue) => element[directiveValue] = newValue
            );
            break;
          }
          case "bind": {
            const state = value;
            state.subscribe(
              (newValue) => element[directiveValue] = newValue
            );
            element.addEventListener(
              "input",
              () => state.value = element[directiveValue]
            );
            break;
          }
          case "toggle": {
            if (value.subscribe) {
              const state = value;
              state.subscribe(
                (newValue) => element.toggleAttribute(directiveValue, newValue)
              );
            } else {
              element.toggleAttribute(directiveValue, value);
            }
            break;
          }
          case "set": {
            const state = value;
            state.subscribe(
              (newValue) => element.setAttribute(directiveValue, newValue)
            );
            break;
          }
          case "children": {
            switch (directiveValue) {
              case "set": {
                const state = value;
                state.subscribe((newValue) => {
                  element.innerHTML = "";
                  element.append(...[newValue].flat());
                });
                break;
              }
              case "append":
              case "appendandscroll":
              case "prepend": {
                element.style.scrollBehavior = "smooth";
                try {
                  const [listState, toElement] = value;
                  listState.handleAddition((newItem) => {
                    const child = toElement(newItem);
                    listState.handleRemoval(
                      newItem,
                      () => child.remove()
                    );
                    if (directiveValue == "append") {
                      element.append(child);
                    } else if (directiveValue == "prepend") {
                      element.prepend(child);
                    }
                  });
                } catch {
                  throw `error: cannot process subscribe:children directive because StateItemConverter is not defined. Usage: "subscribe:children={[list, converter]}"; you can find a more detailed example in the documentation`;
                }
              }
            }
          }
          default:
            element.setAttribute(attributename, value);
        }
      });
    children.filter((x) => x).forEach((child) => element.append(child));
    return element;
  }

  // src/cryptUtility.ts
  var IV_SIZE = 12;
  var ENCRYPTION_ALG = "AES-GCM";
  async function encryptString(plaintext, passphrase) {
    if (!window.crypto.subtle) return plaintext;
    const iv = generateIV();
    const key = await importKey(passphrase, "encrypt");
    const encryptedArray = await encrypt(iv, key, plaintext);
    const encryptionData = {
      iv: uInt8ToArray(iv),
      encryptedArray: uInt8ToArray(encryptedArray)
    };
    return btoa(JSON.stringify(encryptionData));
  }
  async function decryptString(cyphertext, passphrase) {
    try {
      const encrypionData = JSON.parse(atob(cyphertext));
      const iv = arrayToUint8(encrypionData.iv);
      const encryptedArray = arrayToUint8(encrypionData.encryptedArray);
      const key = await importKey(passphrase, "decrypt");
      return await decrypt(iv, key, encryptedArray);
    } catch {
      return cyphertext;
    }
  }
  function encode(string) {
    return new TextEncoder().encode(string);
  }
  function decode(array) {
    return new TextDecoder("utf-8").decode(array);
  }
  async function encrypt(iv, key, message) {
    const arrayBuffer = await window.crypto.subtle.encrypt(
      { name: ENCRYPTION_ALG, iv },
      key,
      encode(message)
    );
    return new Uint8Array(arrayBuffer);
  }
  async function decrypt(iv, key, cyphertext) {
    const arrayBuffer = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALG, iv },
      key,
      cyphertext
    );
    return arrayBufferToString(arrayBuffer);
  }
  async function hash(encoded) {
    return await crypto.subtle.digest("SHA-256", encoded);
  }
  function generateIV() {
    return crypto.getRandomValues(new Uint8Array(IV_SIZE));
  }
  async function importKey(passphrase, purpose) {
    return await crypto.subtle.importKey(
      "raw",
      await hash(encode(passphrase)),
      { name: ENCRYPTION_ALG },
      false,
      [purpose]
    );
  }
  function arrayBufferToString(arrayBuffer) {
    const uInt8Array = new Uint8Array(arrayBuffer);
    return decode(uInt8Array);
  }
  function uInt8ToArray(uInt8Array) {
    return Array.from(uInt8Array);
  }
  function arrayToUint8(array) {
    return new Uint8Array(array);
  }

  // src/utility.tsx
  var storageKeys = {
    viewType(id) {
      return id + "view-type";
    },
    hasUnread(id) {
      return id + "has-unread-messages";
    },
    primaryChannel(id) {
      return id + "primary-channel";
    },
    secondaryChannels(id) {
      return id + "secondary-channels";
    },
    encyptionKey(id) {
      return id + "encryption-key";
    },
    messages(id) {
      return id + "messages";
    },
    objects(id) {
      return id + "items";
    },
    outbox(id) {
      return id + "outbox";
    },
    itemOutbox(id) {
      return id + "item-outbox";
    },
    composingMessage(id) {
      return id + "composing-message";
    }
  };
  var stringToOptionTag = (value) => {
    return /* @__PURE__ */ createElement("option", null, value);
  };

  // src/translations.ts
  var englishTranslations = {
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
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    previousMonth: "previous month",
    nextMonth: "next month",
    // settings
    settings: "Settings",
    showSettings: "Show settings",
    zoomOut: "Zoom Out",
    zoomIn: "Zoom In",
    repairApp: "Repair App",
    clearAddresses: "Clear previous connections",
    clearCategories: "Clear suggestions for object categories",
    clearStatuses: "Clear suggestions for object statuses",
    clearObjectFilters: "Clear object filters",
    // overview
    overview: "Overview",
    connection: "Connection",
    chats: "Chats",
    yourName: "Your Name",
    namePlaceholder: "Jane Doe",
    encryptionUnavailableTitle: "Encryption is not available",
    encryptionUnavailableMessage: "Obtain this app via HTTPS or continue without encryption",
    serverAddress: "Server Address",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",
    previousConnections: "Previous connections",
    connectToServer: "Connect",
    disconnect: "Disconnect",
    mailbox: "Mailbox",
    requestMailbox: "Enable",
    deleteMailbox: "Disable",
    mailboxExplanation: "When you're disconnected, messages will be kept on the server temporarily",
    outbox: "Outbox",
    outboxText: (count) => {
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
    searchTitle: "Search",
    searchPlaceholder: "Note 2000-12-31",
    searchTitleText: (term, resultCount) => term == "" ? `Objects in total: ${resultCount}` : `Matches for "${term}": ${resultCount}`,
    viewAll: "All",
    viewNotes: "Notes",
    viewKanban: "Kanban",
    viewStatus: "Status",
    viewCalendar: "Calendar",
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
    deleteObject: "Delete object"
  };
  var allTranslations = {
    en: englishTranslations,
    es: {
      // general
      set: "Guardar",
      save: "Guardar",
      search: "Buscar",
      reset: "Restablecer",
      back: "Atr\xE1s",
      undoChanges: "Deshacer",
      close: "Cerrar",
      discard: "Descartar",
      rename: "Renombrar",
      weekdays: ["Dom", "Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b"],
      previousMonth: "\xDAltimo mes",
      nextMonth: "Pr\xF3ximo mes",
      // settings
      settings: "Configuraci\xF3n",
      showSettings: "Mostrar configuraci\xF3n",
      zoomOut: "Alejar",
      zoomIn: "Acercar",
      repairApp: "Reparar Aplicaci\xF3n",
      clearAddresses: "Borrar conexiones previas",
      clearCategories: "Borrar sugerencias para categor\xEDas de objetos",
      clearStatuses: "Borrar sugerencias para estados de objetos",
      clearObjectFilters: "Borrar filtros de objetos",
      // overview
      overview: "Resumen",
      connection: "Conexi\xF3n",
      chats: "Chats",
      yourName: "Tu nombre",
      namePlaceholder: "Juan P\xE9rez",
      encryptionUnavailableTitle: "Cifrado no disponible",
      encryptionUnavailableMessage: "Obt\xE9n esta aplicaci\xF3n a trav\xE9s de HTTPS o contin\xFAa sin cifrado",
      serverAddress: "Direcci\xF3n del servidor",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      previousConnections: "Conexiones anteriores",
      connectToServer: "Conectar",
      disconnect: "Desconectar",
      mailbox: "Buz\xF3n",
      requestMailbox: "Activar",
      deleteMailbox: "Desactivar",
      mailboxExplanation: "Si est\xE1s sin conexi\xF3n, los mensajes se guardar\xE1n temporalmente en el servidor",
      outbox: "Bandeja de salida",
      outboxText: (count) => {
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
      addChat: "A\xF1adir",
      // chat
      showChatOptions: "Mostrar opciones del chat",
      configureChatTitle: "Configurar chat",
      secondaryChannel: "Canal secundario",
      secondaryChannelPlaceholder: "A\xF1adir canal secundario",
      addSecondaryChannel: "A\xF1adir canal secundario",
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
      createObject: "a\xF1adir nuevo objeto",
      untitledObject: "Sin t\xEDtulo",
      filterObjects: "Filtrar objetos",
      searchTitle: "Buscar",
      searchPlaceholder: "Nota 2000-12-31",
      searchTitleText: (term, resultCount) => term == "" ? `Objetos en total: ${resultCount}` : `Resultados por "${term}": ${resultCount}`,
      viewAll: "Todos",
      viewNotes: "Notas",
      viewKanban: "Kanban",
      viewStatus: "Estado",
      viewCalendar: "Calendario",
      noObjects: "Sin objetos",
      objectTitle: "T\xEDtulo",
      objectTitlePlaceholder: "Mi objeto",
      objectVersion: "Version del objeto",
      note: "Nota",
      noteContentPlaceholder: "Toma nota...",
      category: "Categor\xEDa",
      categoryPlaceholder: "Define una categor\xEDa",
      priority: "Prioridad",
      priorityPlaceholder: "2",
      status: "Estado",
      statusPlaceholder: "Pendiente",
      date: "Fecha",
      time: "Hora",
      resendObjects: "Reenviar todos los objetos",
      deleteObject: "Eliminar objeto"
    },
    de: {
      // general
      set: "OK",
      save: "Sichern",
      search: "Suchen",
      reset: "Zur\xFCcksetzen",
      back: "Zur\xFCck",
      undoChanges: "\xC4nderungen verwerfen",
      close: "Schlie\xDFen",
      discard: "Verwerfen",
      rename: "Umbenennen",
      weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      previousMonth: "Vorheriger Monat",
      nextMonth: "N\xE4chster Monat",
      // settings
      settings: "Einstellungen",
      showSettings: "Einstellungen anzeigen",
      zoomOut: "Verkleinern",
      zoomIn: "Vergr\xF6\xDFern",
      repairApp: "App reparieren",
      clearAddresses: "Vorherige Verbindungen l\xF6schen",
      clearCategories: "Vorschl\xE4ge f\xFCr Objektkategorien l\xF6schen",
      clearStatuses: "Vorschl\xE4ge f\xFCr Objektstaten l\xF6schen",
      clearObjectFilters: "Objektfilter l\xF6schen",
      // overview
      overview: "\xDCbersicht",
      connection: "Verbindung",
      chats: "Chats",
      yourName: "Dein Name",
      namePlaceholder: "Max Mustermann",
      encryptionUnavailableTitle: "Verschl\xFCsselung nicht m\xF6glich",
      encryptionUnavailableMessage: "Lade diese app \xFCber HTTPS, um Nachrichten zu verschl\xFCsseln",
      serverAddress: "Serveradresse",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      previousConnections: "Vorherige Verbindungen",
      connectToServer: "Verbinden",
      disconnect: "Trennen",
      mailbox: "Briefkasten",
      requestMailbox: "Aktivieren",
      deleteMailbox: "Deaktivieren",
      mailboxExplanation: "Wenn du offline bist, werden Nachrichten auf dem Server gelagert",
      outbox: "Ausgang",
      outboxText: (count) => {
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
      addChat: "Hinzuf\xFCgen",
      // chat
      showChatOptions: "Chatoptionen einblenden",
      configureChatTitle: "Chat konfigurieren",
      secondaryChannel: "Zweitkanal",
      secondaryChannelPlaceholder: "Zweitkanal hinzuf\xFCgen",
      addSecondaryChannel: "Zweitkanal hinzuf\xFCgen",
      removeSecondaryChannel: "Zweitkanal entfernen",
      encryptionKey: "Schl\xFCssel",
      encryptionKeyPlaceholder: "n10d2482dg283hg",
      showKey: "Schl\xFCssel anzeigen",
      clearObjects: "Alle Objekte l\xF6schen",
      clearChatMessages: "Nachrichtenverlauf leeren",
      removeChat: "Chat l\xF6schen",
      messageInOutbox: "Ausstehend",
      noChatSelected: "Kein Chat ausgew\xE4hlt",
      composerPlaceholder: "Neue Nachricht...",
      sendMessage: "Senden",
      // messages
      resendMessage: "Erneut senden",
      decryptMessage: "Nachricht entschl\xFCsseln",
      copyMessage: "Nachricht kopieren",
      deleteMessage: "Nachricht l\xF6schen",
      // objects
      objectsInTotal: "Objekte insgesamt: ",
      showObjects: "Objekte anzeigen",
      createObject: "Neues Objekt erstellen",
      untitledObject: "Unbenannt",
      filterObjects: "Objekte filtern",
      searchTitle: "Suchen",
      searchPlaceholder: "Notiz 2000-12-31",
      searchTitleText: (term, resultCount) => term == "" ? `Objekte insgesamt: ${resultCount}` : `Ergebnisse f\xFCr "${term}": ${resultCount}`,
      viewAll: "Alle",
      viewNotes: "Notizen",
      viewKanban: "Kanban",
      viewStatus: "Status",
      viewCalendar: "Kalender",
      noObjects: "Keine Objekte",
      objectTitle: "Titel",
      objectTitlePlaceholder: "Mein Objekt",
      objectVersion: "Version des Objekts",
      note: "Notiz",
      noteContentPlaceholder: "Notiz eingeben...",
      category: "Kategorie",
      categoryPlaceholder: "Kategorie eingeben...",
      priority: "Priorit\xE4t",
      priorityPlaceholder: "2",
      status: "Status",
      statusPlaceholder: "Ausstehend",
      date: "Datum",
      time: "Uhrzeit",
      resendObjects: "Objekte erneut senden",
      deleteObject: "Objekt l\xF6schen"
    }
  };
  var language = navigator.language.substring(0, 2);
  var translation = allTranslations[language] ?? allTranslations.en;

  // src/Model/chatModel.ts
  var Chat = class {
    id;
    viewType;
    isSubscribed = new State(false);
    primaryChannel = new State("");
    hasUnreadMessages;
    secondaryChannels;
    encryptionKey;
    messages;
    objects;
    outbox;
    objectOutbox;
    isOutBoxEmpty;
    composingMessage;
    primaryChannelInput;
    newSecondaryChannelName;
    cannotSendMessage;
    cannotResendMessage;
    cannotAddSecondaryChannel;
    cannotSetChannel;
    cannotUndoChannel;
    cannotClearMessages;
    cannotClearObjects;
    // init
    constructor(id = UUID()) {
      this.id = id;
      this.viewType = restoreState(
        storageKeys.viewType(id),
        "all"
      );
      this.primaryChannel = restoreState(
        storageKeys.primaryChannel(id),
        ""
      );
      this.secondaryChannels = restoreListState(
        storageKeys.secondaryChannels(id)
      );
      this.hasUnreadMessages = restoreState(
        storageKeys.hasUnread(id),
        false
      );
      this.encryptionKey = restoreState(storageKeys.encyptionKey(id), "");
      this.messages = restoreListState(storageKeys.messages(id));
      this.objects = restoreMapState(storageKeys.objects(id));
      this.outbox = restoreListState(storageKeys.outbox(id));
      this.objectOutbox = restoreMapState(storageKeys.itemOutbox(id));
      this.isOutBoxEmpty = createProxyState(
        [this.outbox],
        () => this.outbox.value.size == 0
      );
      bulkSubscribe(
        [this.outbox, this.objectOutbox],
        () => this.updateOutboxCount()
      );
      this.updateOutboxCount();
      this.composingMessage = restoreState(
        storageKeys.composingMessage(id),
        ""
      );
      this.newSecondaryChannelName = new State("");
      this.primaryChannelInput = new State(this.primaryChannel.value);
      this.cannotSendMessage = createProxyState(
        [this.primaryChannel, this.composingMessage, senderName],
        () => this.primaryChannel.value == "" || this.composingMessage.value == "" || senderName.value == ""
      );
      this.cannotResendMessage = createProxyState(
        [this.primaryChannel, senderName],
        () => this.primaryChannel.value == "" || senderName.value == ""
      );
      this.cannotAddSecondaryChannel = createProxyState(
        [this.newSecondaryChannelName],
        () => this.newSecondaryChannelName.value == ""
      );
      this.cannotSetChannel = createProxyState(
        [this.primaryChannelInput, this.primaryChannel],
        () => this.primaryChannelInput.value == "" || this.primaryChannelInput.value == this.primaryChannel.value
      );
      this.cannotUndoChannel = createProxyState(
        [this.primaryChannelInput, this.primaryChannel],
        () => this.primaryChannelInput.value == this.primaryChannel.value
      );
      this.cannotClearMessages = createProxyState(
        [this.messages],
        () => this.messages.value.size == 0
      );
      this.cannotClearObjects = createProxyState(
        [this.objects],
        () => this.objects.value.size == 0
      );
    }
    // general
    deleteSelf = () => {
      Object.values(storageKeys).forEach((storageKey) => {
        localStorage.removeItem(storageKey(this.id));
      });
      chats.remove(this);
      chatIds.remove(this.id);
    };
    // handlers
    onmessage = async (data) => {
      if (!data.messageChannel) return;
      const channels = data.messageChannel.split("/");
      if (channels.indexOf(this.primaryChannel.value) == -1) return;
      if (data.subscribed != void 0) this.handleSubscription(data.subscribed);
      if (!data.messageBody) return;
      const message = JSON.parse(data.messageBody);
      const { sender, body, channel, isoDate, messageObjectString } = message;
      if (messageObjectString) {
        const decryptedMessageObjectString = await decryptString(
          messageObjectString,
          this.encryptionKey.value
        );
        const messageObject = JSON.parse(decryptedMessageObjectString);
        if (messageObject.id) return this.handleMessageObject(messageObject);
      }
      this.handleMessage({
        sender,
        body: await decryptString(body, this.encryptionKey.value),
        channel,
        isoDate
      });
    };
    handleSubscription = (isSubscribed) => {
      this.isSubscribed.value = isSubscribed;
      if (isSubscribed == true) {
        this.sendMessagesInOutbox();
      }
    };
    handleMessage = (chatMessage) => {
      this.messages.add(chatMessage);
      if (selectedChat.value != this) this.hasUnreadMessages.value = true;
    };
    handleMessageObject = (messageObject) => {
      this.addObject(messageObject, true);
    };
    // sending
    sendMessagesInOutbox = () => {
      this.outbox.value.forEach(async (message) => {
        const isSent = await this.sendMessage(message);
        if (isSent == true) this.outbox.remove(message);
      });
      this.objectOutbox.value.forEach(async (messageObject) => {
        const chatMessage = await this.createChatMessage("", messageObject);
        const isSent = await this.sendMessage(chatMessage);
        if (isSent == true) this.objectOutbox.remove(messageObject.id);
      });
    };
    updateOutboxCount() {
      outboxItemCount.value = this.outbox.value.size + this.objectOutbox.value.size;
    }
    // messages
    createChatMessage = async (messageText, messageObject) => {
      const secondaryChannelNames = [
        ...this.secondaryChannels.value.values()
      ];
      const allChannelNames = [
        this.primaryChannel.value,
        ...secondaryChannelNames
      ];
      const joinedChannelName = allChannelNames.join("/");
      const chatMessage = {
        channel: joinedChannelName,
        sender: senderName.value,
        body: messageText,
        isoDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (messageObject)
        chatMessage.messageObjectString = await encryptString(
          JSON.stringify(messageObject),
          this.encryptionKey.value
        );
      return chatMessage;
    };
    sendMessageFromComposer = async () => {
      if (this.cannotSendMessage.value == true) return;
      await this.sendMessageFromText(this.composingMessage.value);
      this.composingMessage.value = "";
    };
    sendMessageFromText = async (text) => {
      const chatMessage = await this.createChatMessage(text);
      this.outbox.add(chatMessage);
      this.sendMessagesInOutbox();
    };
    resendMessage = (chatMessage) => {
      if (this.cannotResendMessage.value == true) return;
      this.sendMessageFromText(chatMessage.body);
    };
    clearMessages = () => {
      this.messages.clear();
    };
    deleteMessage = (chatMessage) => {
      this.messages.remove(chatMessage);
    };
    deleteOutboxMessage = (chatMessage) => {
      this.outbox.remove(chatMessage);
    };
    decryptReceivedMessage = async (chatMessage) => {
      chatMessage.body = await decryptString(
        chatMessage.body,
        this.encryptionKey.value
      );
      this.messages.callSubscriptions();
    };
    sendMessage = async (chatMessage) => {
      if (isConnected.value == false || this.isSubscribed.value == false)
        return false;
      const encryptedBody = this.encryptionKey.value == "" ? chatMessage.body : await encryptString(chatMessage.body, this.encryptionKey.value);
      chatMessage.body = encryptedBody;
      const messageString = JSON.stringify(chatMessage);
      UDN.sendMessage(chatMessage.channel, messageString);
      return true;
    };
    // objects
    createObjectFromTitle = (title) => {
      const firstObjectContent = this.createObjectContent();
      const messageObject = {
        id: UUID(),
        title,
        contentVersions: {}
      };
      this.addObjectContent(messageObject, firstObjectContent);
      return messageObject;
    };
    createObjectContent = () => {
      return {
        id: UUID(),
        isoDateVersionCreated: (/* @__PURE__ */ new Date()).toISOString()
      };
    };
    addObjectContent = (messageObject, content) => {
      messageObject.contentVersions[content.id] = content;
    };
    updateObjectContent = (messageObject, content) => {
      const latest = this.getMostRecentContent(messageObject);
      Object.entries(content).forEach((entry) => {
        const [key, value] = entry;
        latest[key] = value;
      });
      this.addObjectContent(messageObject, latest);
    };
    addObject = (messageObject, ignoreIfUnchanged = false) => {
      const existingObject = this.objects.value.get(messageObject.id);
      if (existingObject) {
        let isIdentical = existingObject.title == messageObject.title;
        existingObject.title = messageObject.title;
        Object.values(messageObject.contentVersions).forEach((content) => {
          if (existingObject.contentVersions[content.id]) return;
          this.addObjectContent(existingObject, content);
          isIdentical = false;
        });
        if (isIdentical && ignoreIfUnchanged) return;
        this.objects.set(existingObject.id, existingObject);
      } else {
        this.objects.set(messageObject.id, messageObject);
      }
      const latest = this.getMostRecentContent(messageObject);
      if (latest.categoryName) usedObjectCategories.add(latest.categoryName);
      if (latest.status) usedObjectStatuses.add(latest.status);
    };
    addObjectAndSend = (messageObject) => {
      this.addObject(messageObject);
      this.sendObject(messageObject);
    };
    sendObject = (messageObject) => {
      this.objectOutbox.set(messageObject.id, messageObject);
      this.sendMessagesInOutbox();
    };
    deleteObject = (messageObject) => {
      this.objects.remove(messageObject.id);
      this.objectOutbox.remove(messageObject.id);
    };
    resendObjects = () => {
      this.objects.value.forEach((messageObject) => {
        this.sendObject(messageObject);
      });
    };
    clearObjects = () => {
      this.objects.clear();
    };
    getSortedContents = (messageObject) => {
      const contents = Object.values(messageObject.contentVersions);
      contents.sort(
        (a, b) => a.isoDateVersionCreated > b.isoDateVersionCreated ? -1 : 1
      );
      return contents;
    };
    getMostRecentContentId = (messageObject) => {
      const contents = Object.values(messageObject.contentVersions);
      return contents[contents.length - 1].id;
    };
    getMostRecentContent = (messageObject) => {
      const id = this.getMostRecentContentId(messageObject);
      return this.getObjectContentFromId(messageObject, id);
    };
    getObjectContentFromId = (messageObject, contentId) => {
      return messageObject.contentVersions[contentId];
    };
    getObjectTitle = (messageObject) => {
      return messageObject.title || translation.untitledObject;
    };
    // channel
    setChannel = () => {
      if (this.cannotSetChannel.value == true) return;
      this.primaryChannel.value = this.primaryChannelInput.value;
      UDN.subscribe(this.primaryChannel.value);
      updateMailbox();
    };
    undoChannelChange = () => {
      this.primaryChannelInput.value = this.primaryChannel.value;
    };
    addSecondaryChannel = () => {
      if (this.cannotAddSecondaryChannel.value == true) return;
      this.secondaryChannels.add(this.newSecondaryChannelName.value);
      this.newSecondaryChannelName.value = "";
    };
    removeSecondaryChannel = (channel) => {
      this.secondaryChannels.remove(channel);
    };
  };
  function createChatWithName(name) {
    const newChat = new Chat();
    chats.add(newChat);
    newChat.primaryChannel.value = name;
    newChat.primaryChannelInput.value = name;
    chatIds.add(newChat.id);
    UDN.subscribe(name);
    updateMailbox();
  }

  // node_modules/udn-frontend/index.ts
  var UDNFrontend = class {
    ws;
    // HANDLERS
    connectionHandler = () => {
    };
    disconnectionHandler = () => {
    };
    messageHandler = (data) => {
    };
    mailboxHandler = (mailboxId2) => {
    };
    mailboxConnectionHandler = (mailboxId2) => {
    };
    mailboxDeleteHandler = (mailboxId2) => {
    };
    // INIT
    set onconnect(handler) {
      this.connectionHandler = handler;
    }
    set ondisconnect(handler) {
      this.disconnectionHandler = handler;
    }
    set onmessage(handler) {
      this.messageHandler = handler;
    }
    set onmailboxcreate(handler) {
      this.mailboxHandler = handler;
    }
    set onmailboxconnect(handler) {
      this.mailboxConnectionHandler = handler;
    }
    set onmailboxdelete(handler) {
      this.mailboxDeleteHandler = handler;
    }
    // UTILITY METHODS
    send(messageObject) {
      if (this.ws == void 0) return false;
      const messageString = JSON.stringify(messageObject);
      this.ws.send(messageString);
      return true;
    }
    // PUBLIC METHODS
    // connection
    connect(address) {
      try {
        this.disconnect();
        this.ws = new WebSocket(address);
        this.ws.addEventListener("open", this.connectionHandler);
        this.ws.addEventListener("close", this.disconnectionHandler);
        this.ws.addEventListener("message", (message) => {
          const dataString = message.data.toString();
          const data = JSON.parse(dataString);
          if (data.assignedMailboxId) {
            return this.mailboxHandler(data.assignedMailboxId);
          } else if (data.connectedMailboxId) {
            return this.mailboxConnectionHandler(data.connectedMailboxId);
          } else if (data.deletedMailbox) {
            return this.mailboxDeleteHandler(data.deletedMailbox);
          } else {
            this.messageHandler(data);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    disconnect() {
      this.ws?.close();
    }
    // message
    sendMessage(channel, body) {
      const messageObject = {
        messageChannel: channel,
        messageBody: body
      };
      return this.send(messageObject);
    }
    // subscription
    subscribe(channel) {
      const messageObject = {
        subscribeChannel: channel
      };
      return this.send(messageObject);
    }
    unsubscribe(channel) {
      const messageObject = {
        unsubscribeChannel: channel
      };
      return this.send(messageObject);
    }
    // mailbox
    requestMailbox() {
      const messageObject = {
        requestingMailboxSetup: true
      };
      return this.send(messageObject);
    }
    connectMailbox(mailboxId2) {
      const messageObject = {
        requestedMailbox: mailboxId2
      };
      return this.send(messageObject);
    }
    deleteMailbox(mailboxId2) {
      const messageObject = {
        deletingMailbox: mailboxId2
      };
      return this.send(messageObject);
    }
  };

  // src/Model/model.ts
  var UDN = new UDNFrontend();
  var isConnected = new State(false);
  var serverAddressInput = restoreState("socket-address", "");
  var didRequestConnection = restoreState(
    "did-request-connection",
    false
  );
  var currentAddress = restoreState("current-address", "");
  var previousAddresses = restoreListState("previous-addresses");
  var cannotDisonnect = createProxyState(
    [isConnected],
    () => isConnected.value == false
  );
  var cannotConnect = createProxyState(
    [serverAddressInput, currentAddress, isConnected],
    () => serverAddressInput.value == "" || currentAddress.value == serverAddressInput.value && isConnected.value == true
  );
  var cannotResetAddress = createProxyState(
    [serverAddressInput, currentAddress],
    () => serverAddressInput.value == currentAddress.value
  );
  function connect() {
    if (cannotConnect.value == true) return;
    serverAddressInput.value = serverAddressInput.value.toLowerCase();
    currentAddress.value = serverAddressInput.value;
    isConnected.value = false;
    didRequestConnection.value = true;
    UDN.connect(serverAddressInput.value);
    isMailboxActive.value = false;
  }
  function disconnect() {
    didRequestConnection.value = false;
    if (cannotDisonnect.value == true) return;
    UDN.disconnect();
  }
  function resetAddressInput() {
    serverAddressInput.value = currentAddress.value;
  }
  function subscribeChannels() {
    chats.value.forEach((chat) => {
      UDN.subscribe(chat.primaryChannel.value);
    });
  }
  UDN.onconnect = () => {
    isConnected.value = true;
    const lowerCasedAddress = currentAddress.value.toLowerCase();
    if (!previousAddresses.value.has(lowerCasedAddress)) {
      previousAddresses.add(lowerCasedAddress);
    }
    subscribeChannels();
    if (mailboxId.value != "") UDN.connectMailbox(mailboxId.value);
  };
  UDN.onmessage = (data) => {
    chats.value.forEach((chat) => {
      chat.onmessage(data);
    });
  };
  UDN.ondisconnect = () => {
    isConnected.value = false;
  };
  var mailboxId = restoreState("mailbox-id", "");
  var isMailboxActive = new State(false);
  var cannotDeleteMailbox = createProxyState(
    [mailboxId, isMailboxActive, isConnected],
    () => mailboxId.value == "" || isMailboxActive.value == false || isConnected.value == false
  );
  var cannotRequestMailbox = createProxyState(
    [isConnected, isMailboxActive],
    () => isConnected.value == false || isMailboxActive.value == true
  );
  function requestMailbox() {
    if (cannotRequestMailbox.value == true) return;
    UDN.requestMailbox();
  }
  function deleteMailbox() {
    if (cannotDeleteMailbox.value == true) return;
    UDN.deleteMailbox(mailboxId.value);
  }
  function updateMailbox() {
    if (isMailboxActive.value == false) return;
    deleteMailbox();
    setTimeout(() => requestMailbox(), 10);
  }
  UDN.onmailboxcreate = (id) => {
    mailboxId.value = id;
    UDN.connectMailbox(id);
  };
  UDN.onmailboxconnect = (id) => {
    isMailboxActive.value = true;
  };
  UDN.onmailboxdelete = () => {
    isMailboxActive.value = false;
    mailboxId.value = "";
    subscribeChannels();
  };
  var outboxItemCount = new State(0);
  var outboxText = createProxyState(
    [outboxItemCount],
    () => translation.outboxText(outboxItemCount.value)
  );
  var outboxTextStyle = createProxyState(
    [outboxItemCount],
    () => outboxItemCount.value == 0 ? "success" : "warning"
  );
  var isPresentingSettingsModal = new State(false);
  var isEncryptionAvailable = window.crypto.subtle != void 0;
  var senderName = restoreState("sender-name", "");
  var pageZoom = restoreState("page-zoom", 100);
  var objectFilterInput = restoreState("object-filter", "");
  var dayInCalendar = restoreState("calendar-day", (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  pageZoom.subscribe(() => {
    document.body.style.zoom = `${pageZoom.value}%`;
    document.body.style.webkitTextSizeAdjust = `${pageZoom.value}%`;
  });
  var usedObjectCategories = restoreListState("object-categories");
  var usedObjectStatuses = restoreListState("object-statuses");
  var previousObjectSearches = restoreListState("object-searches");
  function toggleSettings() {
    isPresentingSettingsModal.value = !isPresentingSettingsModal.value;
  }
  function repairApp() {
    mapSetToLowercase(previousAddresses);
    removeSetDuplicates(previousAddresses);
    removeSetDuplicates(usedObjectCategories);
    removeSetDuplicates(usedObjectStatuses);
    removeSetDuplicates(previousObjectSearches);
  }
  function mapSetToLowercase(listState) {
    const lowerCased = [...listState.value].map((x) => x.toLowerCase());
    listState.clear();
    listState.add(...lowerCased);
  }
  function removeSetDuplicates(listState) {
    const values = [...listState.value];
    listState.clear();
    listState.add(...values);
  }
  function clearAddresses() {
    previousAddresses.clear();
  }
  function clearCategories() {
    usedObjectCategories.clear();
  }
  function clearStatuses() {
    usedObjectStatuses.clear();
  }
  function clearObjectSearches() {
    previousObjectSearches.clear();
  }
  var zoomStep = 10;
  function zoomOut() {
    pageZoom.value -= zoomStep;
  }
  function zoomIn() {
    pageZoom.value += zoomStep;
  }
  var chats = new ListState();
  var chatIds = restoreListState("chat-ids");
  var selectedChat = new State(void 0);
  var isShowingObjects = restoreState("showing-objects", false);
  var isShowingChatInSplit = restoreState(
    "showing-chat-split",
    false
  );
  var isChatOpen = createProxyState(
    [selectedChat],
    () => selectedChat.value != void 0
  );
  var isChatVisible = createProxyState(
    [isShowingObjects, isShowingChatInSplit],
    () => isShowingObjects.value == false || isShowingChatInSplit.value == true
  );
  isShowingObjects.subscribeSilent(() => {
    setTimeout(() => scrollToChat("instant"), 1);
  });
  var newChatName = new State("");
  var cannotCreateChat = createProxyState(
    [newChatName],
    () => newChatName.value == ""
  );
  function createChat() {
    if (cannotCreateChat.value == true) return;
    createChatWithName(newChatName.value);
    newChatName.value = "";
  }
  function closeChatView() {
    selectedChat.value = void 0;
    document.getElementById("settings-tab")?.scrollIntoView();
  }
  function selectChat(chat) {
    selectedChat.value = chat;
    chat.hasUnreadMessages.value = false;
    scrollToChat();
  }
  function scrollToChat(behavior = "smooth") {
    document.getElementById("message-tab")?.scrollIntoView({ behavior });
  }
  function toggleObjects() {
    isShowingObjects.value = !isShowingObjects.value;
  }
  function toggleChat() {
    isShowingChatInSplit.value = !isShowingChatInSplit.value;
  }
  chatIds.value.forEach((id) => chats.add(new Chat(id)));
  if (serverAddressInput.value != "" && didRequestConnection.value == true) {
    connect();
  }

  // src/Views/Chat/chatOptionModal.tsx
  function ChatOptionModal(chat, isPresented) {
    function closeModal() {
      isPresented.value = false;
    }
    function deleteChat() {
      chat.deleteSelf();
      closeModal();
      closeChatView();
    }
    const shouldShowKey = new State(false);
    const inputType = createProxyState(
      [shouldShowKey],
      () => shouldShowKey.value == true ? "text" : "password"
    );
    const secondaryChannelConverter = (secondaryChannel) => {
      function remove() {
        chat.removeSecondaryChannel(secondaryChannel);
      }
      return /* @__PURE__ */ createElement("div", { class: "tile width-input padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center" }, /* @__PURE__ */ createElement("b", { class: "padding-h" }, secondaryChannel), /* @__PURE__ */ createElement(
        "button",
        {
          class: "danger",
          "aria-label": translation.removeSecondaryChannel,
          "on:click": remove
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")
      )));
    };
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isPresented }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translation.configureChatTitle), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.primaryChannel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": chat.primaryChannelInput,
        placeholder: translation.primaryChannelPlaceholder,
        "on:enter": chat.setChannel
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        "aria-label": translation.undoChanges,
        class: "flex justify-center",
        "on:click": chat.undoChannelChange,
        "toggle:disabled": chat.cannotUndoChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "undo")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        "aria-label": translation.set,
        class: "flex justify-center primary",
        "on:click": chat.setChannel,
        "toggle:disabled": chat.cannotSetChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    ))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row margin-bottom width-input" }, /* @__PURE__ */ createElement(
      "input",
      {
        "aria-label": translation.secondaryChannel,
        placeholder: translation.secondaryChannelPlaceholder,
        "bind:value": chat.newSecondaryChannelName,
        "on:enter": chat.addSecondaryChannel
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "toggle:disabled": chat.cannotAddSecondaryChannel,
        "aria-label": translation.addSecondaryChannel,
        "on:click": chat.addSecondaryChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "children:prepend": [
          chat.secondaryChannels,
          secondaryChannelConverter
        ]
      }
    ), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "key"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.encryptionKey), /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translation.encryptionKeyPlaceholder,
        "bind:value": chat.encryptionKey,
        "set:type": inputType
      }
    ))), /* @__PURE__ */ createElement("label", { class: "inline margin-0" }, /* @__PURE__ */ createElement("input", { type: "checkbox", "bind:checked": shouldShowKey }), translation.showKey)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap width-input" }, /* @__PURE__ */ createElement("button", { "on:click": chat.resendObjects }, translation.resendObjects, /* @__PURE__ */ createElement("span", { class: "icon" }, "replay"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "on:click": chat.clearObjects,
        "toggle:disabled": chat.cannotClearObjects
      },
      translation.clearObjects,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "deployed_code")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "on:click": chat.clearMessages,
        "toggle:disabled": chat.cannotClearMessages
      },
      translation.clearChatMessages,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "chat_error")
    ), /* @__PURE__ */ createElement("button", { class: "danger", "on:click": deleteChat }, translation.removeChat, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete_forever")))), /* @__PURE__ */ createElement("button", { "on:click": closeModal }, translation.close, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/Views/Chat/messageComposer.tsx
  function MessageComposer(chat) {
    return /* @__PURE__ */ createElement("div", { class: "flex-row width-100" }, " ", /* @__PURE__ */ createElement(
      "input",
      {
        class: "width-100 flex-1",
        style: "max-width: unset",
        placeholder: translation.composerPlaceholder,
        "bind:value": chat.composingMessage,
        "on:enter": chat.sendMessageFromComposer
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "on:click": chat.sendMessageFromComposer,
        "toggle:disabled": chat.cannotSendMessage
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "send")
    ));
  }

  // src/icons.ts
  var icons = {
    objectTitle: "label",
    objectHistory: "history",
    noteContent: "sticky_note_2",
    categoryName: "category",
    status: "trending_up",
    priority: "priority_high",
    date: "calendar_month",
    time: "schedule"
  };

  // src/Views/Objects/objectEntryView.tsx
  function ObjectEntryView(chat, messageObject, selectedObject, isShowingObjectModal) {
    const latest = chat.getMostRecentContent(messageObject);
    function select() {
      selectedObject.value = messageObject;
      isShowingObjectModal.value = true;
    }
    function dragStart(event) {
      event.dataTransfer?.setData("text", messageObject.id);
    }
    const fields = {
      [icons.noteContent]: "---",
      [icons.priority]: "---",
      [icons.categoryName]: "---",
      [icons.status]: "---",
      [icons.date]: "---",
      [icons.time]: "---"
    };
    Object.entries(latest).forEach((entry) => {
      let [key, value] = entry;
      if (!value) return;
      const icon = icons[key];
      if (!icon) return;
      if (!fields[icon]) return;
      fields[icon] = value;
    });
    const fieldElements = Object.entries(fields).map((field) => {
      const [icon, value] = field;
      return /* @__PURE__ */ createElement("span", { class: "flex-row control-gap flex align-center padding-right ellipsis" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icon), /* @__PURE__ */ createElement("span", { class: "ellipsis" }, value));
    });
    return /* @__PURE__ */ createElement(
      "button",
      {
        class: "tile flex-no",
        "on:click": select,
        draggable: "true",
        "on:dragstart": dragStart
      },
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", { class: "ellipsis" }, chat.getObjectTitle(messageObject)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
        "span",
        {
          class: "grid height-100 flex secondary",
          style: "grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1.7rem)"
        },
        ...fieldElements
      ))
    );
  }

  // src/Views/Objects/objectGridView.tsx
  function ObjectGridView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const objectConverter = (messageObject) => {
      return ObjectEntryView(
        chat,
        messageObject,
        selectedObject,
        isShowingObjectModal
      );
    };
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "grid gap",
        style: "grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));",
        "children:prepend": [messageObjects, objectConverter]
      }
    );
  }

  // src/Views/Objects/allObjectsView.tsx
  function AllObjectsView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const objectCount = createProxyState(
      [chat.objects],
      () => chat.objects.value.size
    );
    return /* @__PURE__ */ createElement("div", { class: "width-100 height-100 scroll-v padding flex-column gap" }, /* @__PURE__ */ createElement("b", { class: "secondary" }, translation.objectsInTotal, " ", /* @__PURE__ */ createElement("span", { "subscribe:innerText": objectCount })), ObjectGridView(
      chat,
      messageObjects,
      selectedObject,
      isShowingObjectModal
    ));
  }

  // src/Views/Objects/dayView.tsx
  function DayView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const objectsForDayView = new ListState();
    function processObject(messageObject) {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.date || latest.date != dayInCalendar.value) return;
      objectsForDayView.add(messageObject);
      messageObjects.handleRemoval(messageObject, () => {
        objectsForDayView.remove(messageObject);
      });
    }
    messageObjects.handleAddition(processObject);
    dayInCalendar.subscribeSilent(() => {
      objectsForDayView.clear();
      messageObjects.value.forEach(processObject);
    });
    const objectConverter = (messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      const timeString = latest.time || "00:00";
      const [hour, minute] = timeString.split(":");
      const hourInMinutes = parseInt(hour) * 60;
      const minutesTotal = parseInt(minute) + hourInMinutes;
      const priority = latest.priority ?? 0;
      const priorityInverse = 100 - priority;
      const order = `${minutesTotal}${priorityInverse}`;
      const view = ObjectEntryView(
        chat,
        messageObject,
        selectedObject,
        isShowingObjectModal
      );
      view.style.order = order;
      return view;
    };
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "day-view padding flex-column gap scroll-v",
        "children:append": [objectsForDayView, objectConverter]
      }
    );
  }

  // src/Views/Objects/miniatureDayView.tsx
  function MiniatureDayView(chat, messageObjects, dateObject) {
    const objectsForDayView = new ListState();
    const dateString = dateObject.toISOString().split("T")[0];
    function processObject(messageObject) {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.date || latest.date != dateString) return;
      objectsForDayView.add(messageObject);
      messageObjects.handleRemoval(messageObject, () => {
        objectsForDayView.remove(messageObject);
      });
    }
    function select() {
      dayInCalendar.value = dateString;
    }
    const isSelected = createProxyState(
      [dayInCalendar],
      () => dayInCalendar.value == dateString
    );
    const today = /* @__PURE__ */ new Date();
    const isToday = today.getDate() == dateObject.getUTCDate() && today.getMonth() == dateObject.getUTCMonth() && today.getFullYear() == dateObject.getUTCFullYear();
    messageObjects.handleAddition(processObject);
    const objectConverter = (messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      const timeString = latest.time || "00:00";
      const [hour, minute] = timeString.split(":");
      const hourInMinutes = parseInt(hour) * 60;
      const minutesTotal = parseInt(minute) + hourInMinutes;
      const priority = latest.priority ?? 0;
      const priorityInverse = 100 - priority;
      const order = `${minutesTotal}${priorityInverse}`;
      const view = /* @__PURE__ */ createElement("span", { class: "secondary ellipsis" }, chat.getObjectTitle(messageObject));
      view.style.order = order;
      return view;
    };
    return /* @__PURE__ */ createElement(
      "button",
      {
        "on:click": select,
        "toggle:selected": isSelected,
        "toggle:today": isToday,
        class: "day-miniature tile flex-column align-start",
        style: "aspect-ratio: 1/1; overflow: hidden"
      },
      /* @__PURE__ */ createElement("h3", { class: "margin-0" }, dateObject.getUTCDate()),
      /* @__PURE__ */ createElement(
        "div",
        {
          class: "flex-column gap",
          "children:append": [objectsForDayView, objectConverter]
        }
      )
    );
  }

  // src/Views/Objects/calendarView.tsx
  function CalendarView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    let selectedDate = new Date(dayInCalendar.value);
    const selectedMonth = new State(selectedDate.getUTCMonth() + 1);
    const selectedYear = new State(selectedDate.getUTCFullYear());
    bulkSubscribe(
      [selectedMonth, selectedYear],
      () => updateSelectedDate()
    );
    dayInCalendar.subscribeSilent(() => {
      selectedDate = new Date(dayInCalendar.value);
    });
    updateSelectedDate();
    function updateSelectedDate() {
      selectedDate.setUTCMonth(selectedMonth.value - 1);
      selectedDate.setUTCFullYear(selectedYear.value);
      dayInCalendar.value = selectedDate.toISOString().split("T")[0];
    }
    function previousMonth() {
      if (selectedMonth.value <= 1) {
        selectedMonth.value = 12;
        selectedYear.value -= 1;
        return;
      }
      selectedMonth.value -= 1;
    }
    function nextMonth() {
      if (selectedMonth.value >= 12) {
        selectedMonth.value = 1;
        selectedYear.value += 1;
        return;
      }
      selectedMonth.value += 1;
    }
    let monthGridCells = new State([]);
    dayInCalendar.subscribe((newValue) => {
      const newSelectedDate = new Date(newValue);
      const currentDate = /* @__PURE__ */ new Date();
      monthGridCells.value = [];
      currentDate.setUTCDate(1);
      currentDate.setUTCMonth(newSelectedDate.getMonth());
      console.log(currentDate);
      for (let i = 0; i < 7; i++) {
        monthGridCells.value.push(
          /* @__PURE__ */ createElement("b", { class: "secondary ellipsis width-100" }, translation.weekdays[i])
        );
      }
      const monthOffset = currentDate.getDay();
      for (let i = 0; i < monthOffset; i++) {
        monthGridCells.value.push(/* @__PURE__ */ createElement("div", null));
      }
      while (currentDate.getUTCMonth() == newSelectedDate.getUTCMonth()) {
        monthGridCells.value.push(
          MiniatureDayView(chat, messageObjects, currentDate)
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      monthGridCells.callSubscriptions();
    });
    return /* @__PURE__ */ createElement("div", { class: "calendar-wrapper" }, /* @__PURE__ */ createElement("div", { class: "month-grid padding scroll-v" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-center gap" }, /* @__PURE__ */ createElement(
      "button",
      {
        "on:click": previousMonth,
        "aria-label": translation.previousMonth
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_back")
    ), /* @__PURE__ */ createElement(
      "input",
      {
        style: "width: 90px",
        type: "number",
        "bind:value": selectedMonth
      }
    ), /* @__PURE__ */ createElement(
      "input",
      {
        style: "width: 110px",
        type: "number",
        "bind:value": selectedYear
      }
    ), /* @__PURE__ */ createElement("button", { "on:click": nextMonth, "aria-label": translation.nextMonth }, /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
      "div",
      {
        class: "grid gap",
        style: "grid-template-columns: repeat(7, 1fr)",
        "children:set": monthGridCells
      }
    )), DayView(chat, messageObjects, selectedObject, isShowingObjectModal));
  }

  // src/Views/renameView.tsx
  function RenameView(editingName, initialName, rename) {
    const cannotRename = createProxyState(
      [editingName],
      () => editingName.value == initialName || editingName.value == ""
    );
    return /* @__PURE__ */ createElement("div", { class: "flex-row align-center justify-apart object-entry-wide" }, /* @__PURE__ */ createElement("input", { "bind:value": editingName, "on:enter": rename }), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translation.rename,
        "on:click": rename,
        "toggle:disabled": cannotRename
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "edit")
    ));
  }

  // src/Views/Objects/kanbanView.tsx
  function KanbanView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const boards = new MapState();
    const sortedBoardNames = createProxyState(
      [boards],
      () => [...boards.value.values()].map((board) => board.category).sort((a, b) => a.localeCompare(b))
    );
    messageObjects.handleAddition((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.categoryName) return;
      const categoryName = latest.categoryName;
      if (!boards.value.has(categoryName)) {
        const listState = new ListState();
        listState.subscribeSilent(() => {
          if (listState.value.size != 0) return;
          boards.remove(categoryName);
        });
        boards.set(categoryName, {
          category: categoryName,
          items: listState
        });
      }
      const boardItem = {
        priority: latest.priority ?? 0,
        messageObject
      };
      boards.value.get(categoryName)?.items.add(boardItem);
      messageObjects.handleRemoval(messageObject, () => {
        boards.value.get(categoryName)?.items.remove(boardItem);
      });
    });
    const boardToBoardView = (board) => {
      const view = KanbanBoardView(
        chat,
        board,
        selectedObject,
        isShowingObjectModal
      );
      sortedBoardNames.subscribe((sortedBoardNames2) => {
        view.style.order = sortedBoardNames2.indexOf(board.category);
      });
      return view;
    };
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-row large-gap width-100 height-100 scroll-v scroll-h padding",
        "children:append": [boards, boardToBoardView]
      }
    );
  }
  function KanbanBoardView(chat, kanbanBoard, selectedObject, isShowingObjectModal) {
    const editingCategory = new State(kanbanBoard.category);
    function renameBoard() {
      kanbanBoard.items.value.forEach((kanbanBoardItem) => {
        const { messageObject } = kanbanBoardItem;
        const latest = chat.getMostRecentContent(messageObject);
        latest.categoryName = editingCategory.value;
        chat.addObjectAndSend(messageObject);
      });
    }
    function dragOver(event) {
      event.preventDefault();
    }
    function drop(event) {
      event.preventDefault();
      var id = event.dataTransfer?.getData("text");
      if (!id) return;
      const messageObject = chat.objects.value.get(id);
      if (!messageObject) return;
      const newContent = chat.createObjectContent();
      newContent.categoryName = kanbanBoard.category;
      chat.updateObjectContent(messageObject, newContent);
      chat.addObjectAndSend(messageObject);
    }
    const itemToViewEntry = (kanbanBoardItem) => {
      const view = ObjectEntryView(
        chat,
        kanbanBoardItem.messageObject,
        selectedObject,
        isShowingObjectModal
      );
      view.style.order = kanbanBoardItem.priority * -1;
      return view;
    };
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column flex-no object-entry-wide",
        "on:dragover": dragOver,
        "on:drop": drop
      },
      RenameView(editingCategory, kanbanBoard.category, renameBoard),
      /* @__PURE__ */ createElement("hr", null),
      /* @__PURE__ */ createElement(
        "div",
        {
          class: "flex-column gap padding-bottom",
          "children:append": [kanbanBoard.items, itemToViewEntry]
        }
      )
    );
  }

  // src/Views/Objects/noteObjectsView.tsx
  function NoteObjectsView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const notes = new ListState();
    messageObjects.handleAddition((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.noteContent) return;
      notes.add(messageObject);
      messageObjects.handleRemoval(
        messageObject,
        () => notes.remove(messageObject)
      );
    });
    return /* @__PURE__ */ createElement("div", { class: "width-100 height-100 scroll-v padding" }, ObjectGridView(chat, notes, selectedObject, isShowingObjectModal));
  }

  // src/Views/Objects/objectDetailModal.tsx
  function ObjectDetailModal(chat, messageObject, isPresented) {
    const editingTitle = new State(messageObject.title);
    const selectedMessageObjectId = new State(
      chat.getMostRecentContentId(messageObject)
    );
    const selectedMessageObject = createProxyState(
      [selectedMessageObjectId],
      () => chat.getObjectContentFromId(messageObject, selectedMessageObjectId.value)
    );
    const didEditContent = new State(false);
    const editingNoteContent = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.noteContent ?? ""
    );
    const editingCategory = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.categoryName ?? ""
    );
    const editingStatus = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.status ?? ""
    );
    const editingDate = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.date ?? ""
    );
    const editingTime = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.time ?? ""
    );
    const editingPriority = createProxyState(
      [selectedMessageObject],
      () => selectedMessageObject.value.priority ?? 0
    );
    bulkSubscribe(
      [
        editingNoteContent,
        editingCategory,
        editingStatus,
        editingDate,
        editingTime,
        editingPriority
      ],
      () => didEditContent.value = true
    );
    function handleKeyDown(e) {
      if (!e.metaKey && !e.ctrlKey) return;
      switch (e.key) {
        case "s":
          e.preventDefault();
          saveAndClose();
          break;
      }
    }
    function closeModal() {
      isPresented.value = false;
    }
    function saveAndClose() {
      messageObject.title = editingTitle.value;
      if (didEditContent.value == true) {
        chat.addObjectContent(messageObject, {
          isoDateVersionCreated: (/* @__PURE__ */ new Date()).toISOString(),
          id: UUID(),
          noteContent: editingNoteContent.value,
          priority: editingPriority.value,
          categoryName: editingCategory.value,
          status: editingStatus.value,
          date: editingDate.value,
          time: editingTime.value
        });
      }
      chat.addObjectAndSend(messageObject);
      closeModal();
    }
    function deleteAndClose() {
      chat.deleteObject(messageObject);
      closeModal();
    }
    const input = /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": editingTitle,
        placeholder: translation.objectTitlePlaceholder
      }
    );
    isPresented.subscribe(() => setTimeout(() => input.focus(), 100));
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isPresented, "on:keydown": handleKeyDown }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, chat.getObjectTitle(messageObject)), /* @__PURE__ */ createElement("span", { class: "secondary" }, messageObject.id), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.objectTitle), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.objectTitle), input)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.objectHistory), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.objectVersion), /* @__PURE__ */ createElement("select", { "bind:value": selectedMessageObjectId }, ...chat.getSortedContents(messageObject).map((content) => /* @__PURE__ */ createElement("option", { value: content.id }, new Date(
      content.isoDateVersionCreated
    ).toLocaleString()))), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_drop_down"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.noteContent), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.note), /* @__PURE__ */ createElement(
      "textarea",
      {
        rows: "10",
        class: "height-auto",
        "bind:value": editingNoteContent,
        placeholder: translation.noteContentPlaceholder
      }
    ))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.categoryName), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.category), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": editingCategory,
        placeholder: translation.categoryPlaceholder,
        list: "object-categories"
      }
    ))), /* @__PURE__ */ createElement(
      "datalist",
      {
        hidden: true,
        id: "object-categories",
        "children:append": [usedObjectCategories, stringToOptionTag]
      }
    ), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.priority), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.priority), /* @__PURE__ */ createElement(
      "input",
      {
        type: "number",
        "bind:value": editingPriority,
        placeholder: translation.priorityPlaceholder
      }
    ))), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.status), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.status), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": editingStatus,
        placeholder: translation.statusPlaceholder,
        list: "object-statuses"
      }
    ))), /* @__PURE__ */ createElement(
      "datalist",
      {
        hidden: true,
        id: "object-statuses",
        "children:append": [usedObjectStatuses, stringToOptionTag]
      }
    ), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.date), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.date), /* @__PURE__ */ createElement("input", { type: "date", "bind:value": editingDate }))), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.time), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.time), /* @__PURE__ */ createElement("input", { type: "time", "bind:value": editingTime }))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("button", { class: "danger width-input", "on:click": deleteAndClose }, translation.deleteObject, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")))), /* @__PURE__ */ createElement("div", { class: "flex-row" }, /* @__PURE__ */ createElement("button", { class: "flex-1 width-100 danger", "on:click": closeModal }, translation.discard), /* @__PURE__ */ createElement("button", { class: "flex-1 width-100 primary", "on:click": saveAndClose }, translation.save, /* @__PURE__ */ createElement("span", { class: "icon" }, "save")))));
  }

  // src/Views/Objects/statusView.tsx
  function StatusView(chat, messageObjects, selectedObject, isShowingObjectModal) {
    const rows = new MapState();
    const statuses = new MapState();
    const sortedStatuses = createProxyState(
      [statuses],
      () => [...statuses.value.values()].map((statusData) => statusData.title).sort((a, b) => a.localeCompare(b))
    );
    const sortedCategoryNames = createProxyState(
      [rows],
      () => [...rows.value.values()].map((row) => row.category).sort((a, b) => a.localeCompare(b))
    );
    messageObjects.subscribe(() => {
      rows.clear();
      statuses.clear();
      messageObjects.value.forEach((messageObject) => {
        const latest = chat.getMostRecentContent(messageObject);
        if (!latest.categoryName || !latest.status) return;
        const category = latest.categoryName;
        const status = latest.status;
        if (!statuses.value.has(status)) {
          statuses.set(status, { title: status, items: [] });
        }
        statuses.value.get(status).items.push(messageObject);
        if (!rows.value.has(category)) {
          rows.set(category, {
            category,
            statusColumns: new MapState()
          });
        }
        const row = rows.value.get(category);
        if (!row.statusColumns.value.has(status)) {
          row.statusColumns.set(status, {
            status,
            items: new ListState()
          });
        }
        const column = row.statusColumns.value.get(status);
        column.items.add({
          priority: latest.priority ?? 0,
          status,
          messageObject
        });
      });
      statuses.value.forEach((statusItemList) => {
        rows.value.forEach((row) => {
          if (row.statusColumns.value.has(statusItemList.title)) return;
          row.statusColumns.set(statusItemList.title, {
            status: statusItemList.title,
            items: new ListState()
          });
        });
      });
    });
    const statusDataToHeaderView = (statusData) => {
      const view = StatusHeaderView(chat, statusData);
      sortedStatuses.subscribe(
        () => view.style.order = sortedStatuses.value.indexOf(statusData.title)
      );
      return view;
    };
    const categoryRowToView = (row) => {
      const view = KanbanRowView(
        chat,
        row,
        sortedStatuses,
        selectedObject,
        isShowingObjectModal
      );
      sortedCategoryNames.subscribe(
        () => view.style.order = sortedCategoryNames.value.indexOf(row.category)
      );
      return view;
    };
    return /* @__PURE__ */ createElement("div", { class: "flex-column large-gap width-100 height-100 scroll-v scroll-h padding" }, /* @__PURE__ */ createElement("div", { class: "flex-row large-gap" }, /* @__PURE__ */ createElement("div", { class: "flex-column object-entry-wide" }), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-row large-gap",
        "children:append": [statuses, statusDataToHeaderView]
      }
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column large-gap",
        "children:append": [rows, categoryRowToView]
      }
    ));
  }
  function StatusHeaderView(chat, status) {
    const editingStatus = new State(status.title);
    function rename() {
      status.items.forEach((messageObject) => {
        const latest = chat.getMostRecentContent(messageObject);
        latest.status = editingStatus.value;
        chat.addObject(messageObject);
      });
    }
    return /* @__PURE__ */ createElement("div", { class: "object-entry-wide" }, RenameView(editingStatus, status.title, rename), /* @__PURE__ */ createElement("hr", null));
  }
  function KanbanRowView(chat, kanbanRow, sortedStatuses, selectedObject, isShowingObjectModal) {
    const editingCategory = new State(kanbanRow.category);
    function renameCategory() {
      kanbanRow.statusColumns.value.forEach((statusColumns) => {
        statusColumns.items.value.forEach((statusCellItem) => {
          const { messageObject } = statusCellItem;
          const latest = chat.getMostRecentContent(messageObject);
          latest.categoryName = editingCategory.value;
          chat.addObjectAndSend(messageObject);
        });
      });
    }
    const statusColumnToEntryView = (statusColumn) => {
      const view = StatusColumnView(
        chat,
        statusColumn.items,
        kanbanRow.category,
        statusColumn.status,
        selectedObject,
        isShowingObjectModal
      );
      sortedStatuses.subscribe(
        () => view.style.order = sortedStatuses.value.indexOf(statusColumn.status)
      );
      return view;
    };
    return /* @__PURE__ */ createElement("div", { class: "flex-row flex-no large-gap" }, /* @__PURE__ */ createElement("div", { class: "flex-row align-start" }, RenameView(editingCategory, kanbanRow.category, renameCategory)), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-row large-gap",
        "children:append": [kanbanRow.statusColumns, statusColumnToEntryView]
      }
    ));
  }
  function StatusColumnView(chat, items, category, status, selectedObject, isShowingObjectModal) {
    function dragOver(event) {
      event.preventDefault();
    }
    function drop(event) {
      event.preventDefault();
      var id = event.dataTransfer?.getData("text");
      if (!id) return;
      const messageObject = chat.objects.value.get(id);
      if (!messageObject) return;
      const newContent = chat.createObjectContent();
      newContent.categoryName = category;
      newContent.status = status;
      chat.updateObjectContent(messageObject, newContent);
      chat.addObjectAndSend(messageObject);
    }
    const cellItemToEntryView = (cellItem) => ObjectEntryView(
      chat,
      cellItem.messageObject,
      selectedObject,
      isShowingObjectModal
    );
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap object-entry-wide",
        "on:dragover": dragOver,
        "on:drop": drop,
        "children:append": [items, cellItemToEntryView]
      }
    );
  }

  // src/Views/Objects/objectPane.tsx
  var viewTypes = {
    all: [translation.viewAll, "grid_view"],
    notes: [translation.viewNotes, icons.noteContent],
    calendar: [translation.viewCalendar, icons.date],
    kanban: [translation.viewKanban, "view_kanban"],
    status: [translation.viewStatus, icons.status]
  };
  function ObjectPane(chat) {
    const isShowingObjectModal = new State(false);
    const isShowingFilterModel = new State(false);
    const selectedObject = new State(void 0);
    function createObject() {
      const newObject = chat.createObjectFromTitle("");
      chat.addObjectAndSend(newObject);
      selectedObject.value = newObject;
      isShowingObjectModal.value = true;
    }
    function showFilters() {
      isShowingFilterModel.value = true;
    }
    function closeFilters() {
      isShowingFilterModel.value = false;
    }
    const appliedFilter = new State("");
    const resultCount = new State(0);
    const resultText = createProxyState(
      [appliedFilter, resultCount],
      () => translation.searchTitleText(appliedFilter.value, resultCount.value)
    );
    const showingMessageObjects = new MapState();
    const isFilterEmpty = createProxyState(
      [appliedFilter],
      () => appliedFilter.value == ""
    );
    function resetFilter() {
      objectFilterInput.value = "";
      applyFilter();
    }
    function applyFilter() {
      appliedFilter.value = objectFilterInput.value;
      if (!previousObjectSearches.value.has(appliedFilter.value))
        previousObjectSearches.add(appliedFilter.value);
      const allObjects = [...chat.objects.value.values()];
      allObjects.forEach((object, i) => {
        const doesMatch = checkIfMatchesFilter(object);
        if (doesMatch) {
          showingMessageObjects.set(object.id, object);
        } else {
          showingMessageObjects.remove(object.id);
        }
      });
      resultCount.value = showingMessageObjects.value.size;
    }
    chat.objects.handleAddition((messageObject) => {
      if (checkIfMatchesFilter(messageObject) == false) return;
      showingMessageObjects.set(messageObject.id, messageObject);
      chat.objects.handleRemoval(messageObject, () => {
        showingMessageObjects.remove(messageObject.id);
      });
    });
    function checkIfMatchesFilter(messageObject) {
      if (isFilterEmpty.value == true) return true;
      const stringsInObject = [];
      const objectTitle = messageObject.title || translation.untitledObject;
      stringsInObject.push(objectTitle);
      const latest = chat.getMostRecentContent(messageObject);
      if (latest) {
        Object.values(latest).forEach((value) => {
          if (typeof value != "string") return;
          stringsInObject.push(value);
        });
      }
      const wordsOfObject = stringsInObject.map((string) => string.toLowerCase().split(" ")).flat();
      const wordsOfSearchTerm = appliedFilter.value.toLowerCase().split(" ");
      for (const word of wordsOfSearchTerm) {
        if (word[0] == "-") {
          const wordContent = word.substring(1);
          if (wordsOfObject.includes(wordContent)) return false;
        } else {
          return wordsOfObject.includes(word);
        }
      }
      return true;
    }
    applyFilter();
    const objectModal = createProxyState(
      [chat.objects, selectedObject],
      () => {
        if (selectedObject.value == void 0) return /* @__PURE__ */ createElement("div", null);
        return ObjectDetailModal(
          chat,
          selectedObject.value,
          isShowingObjectModal
        );
      }
    );
    const mainView = createProxyState([chat.viewType], () => {
      function getViewFunction() {
        switch (chat.viewType.value) {
          case "notes":
            return NoteObjectsView;
          case "kanban":
            return KanbanView;
          case "status":
            return StatusView;
          case "calendar":
            return CalendarView;
          default:
            return AllObjectsView;
        }
      }
      return getViewFunction()(
        chat,
        showingMessageObjects,
        selectedObject,
        isShowingObjectModal
      );
    });
    return /* @__PURE__ */ createElement("div", { class: "chat-object-view flex-column scroll-no padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-row align-center border-bottom" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary height-100",
        "on:click": createObject,
        "aria-label": translation.createObject
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    ), /* @__PURE__ */ createElement("div", { class: "padding-sm flex flex-row gap justify-center scroll-h width-100" }, ...Object.keys(viewTypes).map(
      (key) => ViewTypeToggle(key, chat.viewType)
    )), /* @__PURE__ */ createElement(
      "button",
      {
        class: "height-100",
        "aria-label": translation.filterObjects,
        "on:click": showFilters
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "filter_list")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "object-content width-100 height-100 flex scroll-no",
        "children:set": mainView
      }
    ), /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isShowingFilterModel }, /* @__PURE__ */ createElement("div", { style: "max-width: 2084px" }, /* @__PURE__ */ createElement("main", { class: "gap" }, /* @__PURE__ */ createElement("h2", null, translation.filterObjects), /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "search"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.searchTitle), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": objectFilterInput,
        "on:enter": applyFilter,
        placeholder: translation.searchPlaceholder,
        list: "object-searches"
      }
    ), /* @__PURE__ */ createElement(
      "datalist",
      {
        hidden: true,
        id: "object-searches",
        "children:append": [
          previousObjectSearches,
          stringToOptionTag
        ]
      }
    )))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50 flex",
        "on:click": resetFilter,
        "toggle:disabled": isFilterEmpty
      },
      translation.reset
    ), /* @__PURE__ */ createElement("button", { class: "width-50 flex primary", "on:click": applyFilter }, translation.search, /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("b", { class: "secondary", "subscribe:innerText": resultText }), ObjectGridView(
      chat,
      showingMessageObjects,
      selectedObject,
      isShowingObjectModal
    )), /* @__PURE__ */ createElement("button", { "on:click": closeFilters }, translation.close, /* @__PURE__ */ createElement("span", { class: "icon" }, "close")))), /* @__PURE__ */ createElement("div", { "children:set": objectModal }));
  }
  function ViewTypeToggle(key, selection) {
    const [label, icon] = viewTypes[key];
    function select() {
      selection.value = key;
    }
    const isSelected = createProxyState(
      [selection],
      () => selection.value == key
    );
    return /* @__PURE__ */ createElement("button", { "aria-label": label, "on:click": select, "toggle:selected": isSelected }, /* @__PURE__ */ createElement("span", { class: "icon" }, icon));
  }

  // src/Views/Chat/threadView.tsx
  function ThreadView(chat) {
    const messageConverter = (message) => {
      function resendMessage() {
        chat.resendMessage(message);
      }
      function copyMessage() {
        navigator.clipboard.writeText(message.body);
      }
      function decrypt2() {
        chat.decryptReceivedMessage(message);
      }
      function remove() {
        chat.deleteMessage(message);
      }
      const messageBody = createProxyState(
        [chat.messages],
        () => message.body
      );
      return /* @__PURE__ */ createElement("div", { class: "tile width-100 flex-no padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center secondary" }, /* @__PURE__ */ createElement("span", { class: "padding-h ellipsis" }, /* @__PURE__ */ createElement("b", { class: "info" }, message.sender)), /* @__PURE__ */ createElement("span", { class: "flex-row" }, /* @__PURE__ */ createElement(
        "button",
        {
          "aria-label": translation.resendMessage,
          "on:click": resendMessage,
          "toggle:disabled": chat.cannotResendMessage
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "replay")
      ), /* @__PURE__ */ createElement(
        "button",
        {
          "aria-label": translation.copyMessage,
          "on:click": copyMessage
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "content_copy")
      ), /* @__PURE__ */ createElement(
        "button",
        {
          "aria-label": translation.decryptMessage,
          "on:click": decrypt2
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "key")
      ), /* @__PURE__ */ createElement("button", { "aria-label": translation.deleteMessage, "on:click": remove }, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")))), /* @__PURE__ */ createElement("div", { class: "flex-column padding-h padding-bottom" }, /* @__PURE__ */ createElement("b", { class: "break-word", "subscribe:innerText": messageBody }), /* @__PURE__ */ createElement("span", { class: "secondary" }, /* @__PURE__ */ createElement("b", null, new Date(message.isoDate).toLocaleString()), /* @__PURE__ */ createElement("br", null), message.channel))));
    };
    const outboxMessageConverter = (message) => {
      function remove() {
        chat.deleteOutboxMessage(message);
      }
      return /* @__PURE__ */ createElement("div", { class: "tile width-100 flex-no padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center" }, /* @__PURE__ */ createElement("b", { class: "error padding-h" }, translation.messageInOutbox), /* @__PURE__ */ createElement("span", { class: "flex-row secondary" }, /* @__PURE__ */ createElement("button", { "aria-label": translation.deleteMessage, "on:click": remove }, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")))), /* @__PURE__ */ createElement("div", { class: "flex-column padding-h padding-bottom" }, /* @__PURE__ */ createElement("b", { class: "break-word" }, message.body), /* @__PURE__ */ createElement("span", { class: "secondary" }, /* @__PURE__ */ createElement("b", null, new Date(message.isoDate).toLocaleString()), /* @__PURE__ */ createElement("br", null), message.channel))));
    };
    const messageList = /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "children:append": [chat.messages, messageConverter]
      }
    );
    const outboxList = /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "children:append": [chat.outbox, outboxMessageConverter]
      }
    );
    const listWrapper = /* @__PURE__ */ createElement("div", { class: "thread-view flex-column gap" }, messageList, outboxList);
    function scrollToBottom() {
      listWrapper.scrollTop = listWrapper.scrollHeight;
    }
    function scrollToBottomIfAppropriate() {
      const scrollFromBottom = listWrapper.scrollHeight - (listWrapper.scrollTop + listWrapper.offsetHeight);
      if (scrollFromBottom > 400) return;
      scrollToBottom();
    }
    chat.messages.handleAddition(scrollToBottomIfAppropriate);
    chat.outbox.handleAddition(scrollToBottomIfAppropriate);
    isShowingObjects.subscribe(() => scrollToBottom());
    setTimeout(() => scrollToBottom(), 50);
    return listWrapper;
  }

  // src/Tabs/messageTab.tsx
  function MessageTab() {
    const messageTabContent = createProxyState([selectedChat], () => {
      if (selectedChat.value == void 0)
        return /* @__PURE__ */ createElement("div", { class: "width-100 height-100 flex-column align-center justify-center" }, /* @__PURE__ */ createElement("span", { class: "secondary" }, translation.noChatSelected));
      const chat = selectedChat.value;
      const isShowingOptions = new State(false);
      function showOptions() {
        isShowingOptions.value = true;
      }
      return [
        /* @__PURE__ */ createElement("header", { class: "padding-0" }, /* @__PURE__ */ createElement("span", { class: "flex-row align-center" }, /* @__PURE__ */ createElement("button", { "aria-label": translation.back, "on:click": closeChatView }, /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_back")), /* @__PURE__ */ createElement("span", { "subscribe:innerText": chat.primaryChannel })), /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
          "button",
          {
            "aria-label": translation.showObjects,
            "on:click": toggleObjects,
            "toggle:selected": isShowingObjects
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "deployed_code")
        ), /* @__PURE__ */ createElement(
          "button",
          {
            "aria-label": translation.showObjects,
            "on:click": toggleChat,
            "toggle:selected": isChatVisible
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "forum")
        ), /* @__PURE__ */ createElement(
          "button",
          {
            "aria-label": translation.showChatOptions,
            "on:click": showOptions
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "tune")
        ))),
        ObjectPane(chat),
        ThreadView(chat),
        /* @__PURE__ */ createElement("footer", null, MessageComposer(chat)),
        ChatOptionModal(chat, isShowingOptions)
      ];
    });
    return /* @__PURE__ */ createElement(
      "article",
      {
        id: "message-tab",
        "children:set": messageTabContent,
        "toggle:showingobjects": isShowingObjects,
        "toggle:chatvisible": isChatVisible,
        "toggle:chatopen": isChatOpen
      }
    );
  }

  // src/Views/Overview/chatListSection.tsx
  var chatConverter = (chat) => {
    function select() {
      selectChat(chat);
    }
    const isSelected = createProxyState(
      [selectedChat],
      () => selectedChat.value == chat
    );
    return /* @__PURE__ */ createElement(
      "button",
      {
        class: "tile",
        "on:click": select,
        "toggle:selected": isSelected,
        "toggle:unread": chat.hasUnreadMessages
      },
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", { class: "ellipsis", "subscribe:innerText": chat.primaryChannel })),
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    );
  };
  function ChatListSection() {
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("h2", null, translation.chats), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.primaryChannel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": newChatName,
        placeholder: translation.primaryChannelPlaceholder,
        "on:enter": createChat
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-50",
        "toggle:disabled": cannotCreateChat,
        "on:click": createChat
      },
      translation.addChat,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "children:append": [chats, chatConverter]
      }
    ));
  }

  // src/Views/Overview/connectionSection.tsx
  function ConnectionSection() {
    const stringToPreviouAddressOption = (value) => {
      const isSelected = value == serverAddressInput.value;
      return /* @__PURE__ */ createElement("option", { "toggle:selected": isSelected }, value);
    };
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("h2", null, translation.connection), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "cell_tower"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.serverAddress), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": serverAddressInput,
        "on:enter": connect,
        placeholder: translation.serverAddressPlaceholder,
        list: "previous-addresses"
      }
    ), /* @__PURE__ */ createElement(
      "datalist",
      {
        hidden: true,
        id: "previous-addresses",
        "children:append": [previousAddresses, stringToOptionTag]
      }
    ))), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "history"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.previousConnections), /* @__PURE__ */ createElement(
      "select",
      {
        "bind:value": serverAddressInput,
        "children:append": [previousAddresses, stringToPreviouAddressOption]
      }
    ), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_drop_down"))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger width-100 flex-1 justify-center",
        "aria-label": translation.disconnect,
        "on:click": disconnect,
        "toggle:disabled": cannotDisonnect
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "close")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-100 flex-1 justify-center",
        "aria-label": translation.undoChanges,
        "on:click": resetAddressInput,
        "toggle:disabled": cannotResetAddress
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "undo")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-100 flex-1 justify-center",
        "aria-label": translation.connectToServer,
        "on:click": connect,
        "toggle:disabled": cannotConnect
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "inbox"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.mailbox), /* @__PURE__ */ createElement("span", { class: "secondary" }, translation.mailboxExplanation))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger width-100 flex-1",
        "on:click": deleteMailbox,
        "toggle:disabled": cannotDeleteMailbox
      },
      translation.deleteMailbox
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-100 flex-1",
        "on:click": requestMailbox,
        "toggle:disabled": cannotRequestMailbox
      },
      translation.requestMailbox,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "outbox"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.outbox), /* @__PURE__ */ createElement(
      "span",
      {
        "set:class": outboxTextStyle,
        "subscribe:innerText": outboxText
      }
    ))));
  }

  // src/Views/Overview/personalSection.tsx
  function PersonalSection() {
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.yourName), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": senderName,
        placeholder: translation.namePlaceholder
      }
    ))));
  }

  // src/Tabs/overviewTab.tsx
  function OverviewTab() {
    return /* @__PURE__ */ createElement("article", { id: "settings-tab", "toggle:connected": isConnected }, /* @__PURE__ */ createElement("header", null, translation.overview, /* @__PURE__ */ createElement("button", { "aria-label": translation.showSettings, "on:click": toggleSettings }, /* @__PURE__ */ createElement("span", { class: "icon" }, "settings"))), /* @__PURE__ */ createElement("div", { class: "flex-column large-gap" }, /* @__PURE__ */ createElement("div", { class: "tile error flex-no", "toggle:hidden": isEncryptionAvailable }, /* @__PURE__ */ createElement("span", { class: "icon" }, "warning"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.encryptionUnavailableTitle), /* @__PURE__ */ createElement("span", { class: "secondary" }, translation.encryptionUnavailableMessage))), PersonalSection(), ConnectionSection(), ChatListSection()));
  }

  // src/Views/settingsModal.tsx
  function SettingsModal() {
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isPresentingSettingsModal }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translation.settings), /* @__PURE__ */ createElement("div", { class: "flex-row width-input gap" }, /* @__PURE__ */ createElement("button", { class: "width-100 flex justify-start", "on:click": zoomOut }, /* @__PURE__ */ createElement("span", { class: "icon" }, "zoom_out"), translation.zoomOut), /* @__PURE__ */ createElement("button", { class: "width-100 flex justify-start", "on:click": zoomIn }, /* @__PURE__ */ createElement("span", { class: "icon" }, "zoom_in"), translation.zoomIn)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column width-input" }, /* @__PURE__ */ createElement("button", { class: "tile width-100 flex-1", "on:click": repairApp }, /* @__PURE__ */ createElement("span", { class: "icon" }, "handyman"), translation.repairApp)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column width-input gap" }, /* @__PURE__ */ createElement("button", { class: "tile width-100 flex-1", "on:click": clearAddresses }, /* @__PURE__ */ createElement("span", { class: "icon" }, "cell_tower"), translation.clearAddresses), /* @__PURE__ */ createElement("button", { class: "tile width-100 flex-1", "on:click": clearCategories }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.categoryName), translation.clearCategories), /* @__PURE__ */ createElement("button", { class: "tile width-100 flex-1", "on:click": clearStatuses }, /* @__PURE__ */ createElement("span", { class: "icon" }, icons.status), translation.clearStatuses), /* @__PURE__ */ createElement(
      "button",
      {
        class: "tile width-100 flex-1",
        "on:click": clearObjectSearches
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "search"),
      translation.clearObjectFilters
    ))), /* @__PURE__ */ createElement("button", { class: "width-100", "on:click": toggleSettings }, translation.close, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/index.tsx
  document.querySelector("main").append(OverviewTab(), MessageTab(), SettingsModal());
  document.querySelector("main").classList.add("split");
})();
