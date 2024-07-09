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
        const id = item.id;
        if (!this.removalHandlers.has(id)) return;
        this.removalHandlers.get(id)(item);
        this.removalHandlers.delete(id);
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
      this.removalHandlers.set(item.id, handler);
    }
    // stringification
    toString() {
      const array = [...this.value];
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
  function restoreListState(localStorageKey) {
    const storedString = localStorage.getItem(localStorageKey) ?? "";
    let initialItems = [];
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
            if (directiveValue == "children") {
              element.style.scrollBehavior = "smooth";
              try {
                const [listState, toElement] = value;
                listState.handleAddition((newItem) => {
                  const child = toElement(newItem);
                  listState.handleRemoval(
                    newItem,
                    () => child.remove()
                  );
                  element.append(child);
                  element.scrollTop = element.scrollHeight;
                });
              } catch {
                throw `error: cannot process subscribe:children directive because ListItemConverter is not defined. Usage: "subscribe:children={[list, converter]}"; you can find a more detailed example in the documentation`;
              }
            } else {
              const state = value;
              state.subscribe(
                (newValue) => element[directiveValue] = newValue
              );
            }
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

  // src/translations.ts
  var englishTranslations = {
    // general
    setInput: "Set",
    connectionStatus: "Connection status",
    connectedTo: (server) => `Connected to "${server}"`,
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
    mailboxExplanation: "When you're disconnected, messages will be kept on the server temporarily",
    // messages
    messages: "Messages",
    composerPlaceholder: "Type a message...",
    sendMessage: "Send",
    clearHistory: "Clear history",
    encryptionUnavailableTitle: "Encryption is not available",
    encryptionUnavailableMessage: "Obtain this app via HTTPS or continue without encryption",
    decryptMessage: "Decrypt message",
    copyMessage: "Copy message",
    deleteMessage: "Delete message"
  };
  var allTranslations = {
    en: englishTranslations,
    es: {
      // general
      setInput: "OK",
      connectionStatus: "Estado de Conexi\xF3n",
      connectedTo: (server) => `Conectado a "${server}"`,
      disconnected: "Desconectado",
      // settings
      settings: "Configuraci\xF3n",
      connection: "Conexi\xF3n",
      communication: "Comunicaci\xF3n",
      encryption: "Cifrado",
      serverAddress: "Direcci\xF3n del servidor",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      connectToServer: "Conectar",
      disconnect: "Desconectar",
      primaryChannel: "Canal principal",
      leaveChannel: "Salir",
      channelPlaceholder: "mi-canal",
      addSecondaryChannel: "A\xF1adir canal segundario",
      removeSecondaryChannel: "Eliminar canal segundario",
      newSecondaryChannelPlaceholder: "A\xF1adir canal segundario",
      encryptionKey: "Clave de cifrada",
      encryptionKeyPlaceholder: "1jg028ej40d",
      showEncryptionKey: "Mostrar clave de cifrado",
      myName: "Mi nombre",
      yourNamePlaceholder: "Juan P\xE9rez",
      mailbox: "Buz\xF3n",
      requestMailbox: "Activar",
      deleteMailbox: "Desactivar",
      mailboxExplanation: "Si est\xE1s sin conexi\xF3n, los mensajes se guardar\xE1n temporalmente en el servidor",
      // messages
      messages: "Mensajes",
      composerPlaceholder: "Escribe un mensaje...",
      sendMessage: "Enviar",
      clearHistory: "Borrar historial",
      encryptionUnavailableTitle: "Cifrado no disponible",
      encryptionUnavailableMessage: "Obt\xE9n esta p\xE1gina a trav\xE9s de HTTPS para cifrar o contin\xFAa sin cifrado",
      decryptMessage: "Descifrar mensaje",
      copyMessage: "Copiar mensaje",
      deleteMessage: "Eliminar mensaje"
    },
    de: {
      // general
      setInput: "OK",
      connectionStatus: "Verbindungsstatus",
      connectedTo: (server) => `Verbunden mit "${server}"`,
      disconnected: "Verbindung getrennt",
      // settings
      settings: "Einstellungen",
      connection: "Verbindung",
      communication: "Kommunikation",
      encryption: "Verschl\xFCsselung",
      serverAddress: "Serveraddresse",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      connectToServer: "Verbinden",
      disconnect: "Trennen",
      primaryChannel: "Hauptkanal",
      leaveChannel: "Verlassen",
      channelPlaceholder: "mein-kanal",
      addSecondaryChannel: "Zweitkanal hinzuf\xFCgen",
      removeSecondaryChannel: "Zweitkanal entfernen",
      newSecondaryChannelPlaceholder: "Zweitkanal hinzuf\xFCgen",
      encryptionKey: "Schl\xFCssel",
      encryptionKeyPlaceholder: "1jg028ej40d",
      showEncryptionKey: "Schl\xFCssel anzeigen",
      myName: "Mein Name",
      yourNamePlaceholder: "Max Mustermann",
      mailbox: "Briefkasten",
      requestMailbox: "Aktivieren",
      deleteMailbox: "Deaktivieren",
      mailboxExplanation: "Nachrichten werden tempor\xE4r auf dem Server gespeichert, wenn deine Verbindung getrennt ist",
      // messages
      messages: "Nachrichten",
      composerPlaceholder: "Neue Nachricht...",
      sendMessage: "Senden",
      clearHistory: "Nachrichtenverlauf leeren",
      encryptionUnavailableTitle: "Verschl\xFCsselung nicht m\xF6glich",
      encryptionUnavailableMessage: "Um Nachrichten zu verschl\xFCsseln, lade diese Seite \xFCber HTTPS.",
      decryptMessage: "Nachricht entschl\xFCsseln",
      copyMessage: "Nachricht kopieren",
      deleteMessage: "Nachricht l\xF6schen"
    }
  };
  var language = navigator.language.substring(0, 2);
  var translation = allTranslations[language] ?? allTranslations.en;

  // src/model.ts
  var UDN = new UDNFrontend();
  var Channel = class {
    constructor(channelName) {
      this.channelName = channelName;
    }
    id = UUID();
  };
  var Message = class {
    constructor(channel, sender, body, isoDate) {
      this.channel = channel;
      this.sender = sender;
      this.body = body;
      this.isoDate = isoDate;
    }
    id = UUID();
  };
  var currentAddress = new State("");
  var serverAddress = restoreState("socket-address", "");
  var isConnected = new State(false);
  var connectionMessage = createProxyState(
    [serverAddress],
    () => translation.connectedTo(serverAddress.value)
  );
  var cannotDisonnect = createProxyState(
    [isConnected],
    () => isConnected.value == false
  );
  var cannotConnect = createProxyState(
    [serverAddress, currentAddress, isConnected],
    () => serverAddress.value == "" || currentAddress.value == serverAddress.value && isConnected.value == true
  );
  var mailboxId = restoreState("mailbox-id", "");
  var isMailboxConnected = new State(false);
  var cannotRequestMailbox = createProxyState(
    [isConnected, isMailboxConnected],
    () => isConnected.value == false || isMailboxConnected.value == true
  );
  var cannotDeleteMailbox = createProxyState(
    [isConnected, mailboxId, isMailboxConnected],
    () => isConnected.value == false || mailboxId.value == "" || isMailboxConnected.value == false
  );
  var encryptionKey = restoreState("encryption-key", "");
  var isEncryptionUnavailable = window.crypto.subtle == void 0;
  var currentPrimaryChannel = new State("");
  var primaryChannel = restoreState("primary-channel", "");
  var newSecondaryChannelName = new State("");
  var secondaryChannels = restoreListState("secondary-channels");
  var cannotSetChannel = createProxyState(
    [primaryChannel, currentPrimaryChannel, isConnected],
    () => primaryChannel.value == "" || isConnected.value == false
  );
  var cannotLeaveChannel = createProxyState(
    [currentPrimaryChannel, isConnected],
    () => currentPrimaryChannel.value == "" || isConnected.value == false
  );
  var cannotAddSecondaryChannel = createProxyState(
    [newSecondaryChannelName],
    () => newSecondaryChannelName.value == ""
  );
  var senderName = restoreState("sender-name", "");
  var messageBody = restoreState("message", "");
  var cannotSendMessage = createProxyState(
    [currentPrimaryChannel, messageBody, senderName, isConnected],
    () => isConnected.value == false || currentPrimaryChannel.value == "" || messageBody.value == "" || senderName.value == ""
  );
  var messages = restoreListState("messages");
  function connect() {
    if (cannotConnect.value == true) return;
    currentAddress.value = serverAddress.value;
    isConnected.value = false;
    UDN.connect(serverAddress.value);
  }
  function disconnect() {
    if (cannotDisonnect.value == true) return;
    UDN.disconnect();
  }
  function requestMailbox() {
    UDN.requestMailbox();
  }
  function deleteMailbox() {
    UDN.deleteMailbox(mailboxId.value);
  }
  function updateMailbox() {
    if (!isMailboxConnected || mailboxId.value == "") return;
    deleteMailbox();
    requestMailbox();
  }
  async function sendMessage() {
    if (cannotSendMessage.value == true) return;
    const secondaryChannelNames = [
      ...secondaryChannels.value.values()
    ].map((channel) => channel.channelName);
    const allChannelNames = [
      primaryChannel.value,
      ...secondaryChannelNames
    ];
    const encrypted = await encryptMessage();
    if (encrypted == void 0) return;
    const joinedChannelName = allChannelNames.join("/");
    const messageObject = new Message(
      joinedChannelName,
      senderName.value,
      encrypted,
      (/* @__PURE__ */ new Date()).toISOString()
    );
    const messageString = JSON.stringify(messageObject);
    UDN.sendMessage(joinedChannelName, messageString);
    messageBody.value = "";
  }
  function clearMessageHistory() {
    messages.clear();
  }
  function deleteMessage(message) {
    messages.remove(message);
  }
  function setChannel() {
    if (cannotSetChannel.value == true) return;
    if (currentPrimaryChannel != void 0) {
      UDN.unsubscribe(currentPrimaryChannel.value);
    }
    UDN.subscribe(primaryChannel.value);
    updateMailbox();
  }
  function leaveChannel() {
    if (cannotLeaveChannel.value == true) return;
    UDN.unsubscribe(currentPrimaryChannel.value);
  }
  function addSecondaryChannel() {
    if (cannotAddSecondaryChannel.value == true) return;
    const channelObject = new Channel(newSecondaryChannelName.value);
    secondaryChannels.add(channelObject);
    newSecondaryChannelName.value = "";
  }
  function removeSecondaryChannel(channel) {
    secondaryChannels.remove(channel);
  }
  async function decryptReceivedMessage(message) {
    message.body = await decryptMessage(message.body);
    messages.callSubscriptions();
  }
  UDN.onconnect = () => {
    isConnected.value = true;
    setChannel();
    if (mailboxId.value != "") {
      UDN.connectMailbox(mailboxId.value);
    }
  };
  UDN.onmailboxcreate = (id) => {
    mailboxId.value = id;
    UDN.connectMailbox(id);
  };
  UDN.onmailboxconnect = () => {
    isMailboxConnected.value = true;
  };
  UDN.onmailboxdelete = () => {
    isMailboxConnected.value = false;
    mailboxId.value = "";
  };
  UDN.onmessage = (data) => {
    if (data.subscribed != void 0 && data.messageChannel != void 0) {
      return handleSubscriptionConfirmation(data.messageChannel, data.subscribed);
    } else if (data.messageBody) {
      handleMessage(data.messageBody);
    }
  };
  UDN.ondisconnect = () => {
    isConnected.value = false;
    isMailboxConnected.value = false;
  };
  function handleSubscriptionConfirmation(channel, isSubscribed) {
    if (isSubscribed == true) {
      currentPrimaryChannel.value = channel;
    } else {
      currentPrimaryChannel.value = "";
    }
  }
  async function handleMessage(body) {
    try {
      const object = JSON.parse(body);
      if (!object.channel || !object.sender || !object.body || !object.isoDate)
        return;
      const messageObject = new Message(
        object.channel,
        object.sender,
        await decryptMessage(object.body),
        object.isoDate
      );
      messages.add(messageObject);
    } catch {
    }
  }
  async function encryptMessage() {
    if (encryptionKey.value == "") return messageBody.value;
    if (!window.crypto.subtle) return messageBody.value;
    const iv = generateIV();
    const key = await importKey(encryptionKey.value, "encrypt");
    const encryptedArray = await encrypt(iv, key, messageBody.value);
    const encryptionData = {
      iv: uInt8ToArray(iv),
      encryptedArray: uInt8ToArray(encryptedArray)
    };
    return btoa(JSON.stringify(encryptionData));
  }
  async function decryptMessage(encryptionData) {
    try {
      const encrypionData = JSON.parse(atob(encryptionData));
      const iv = arrayToUint8(encrypionData.iv);
      const encryptedArray = arrayToUint8(encrypionData.encryptedArray);
      const key = await importKey(encryptionKey.value, "decrypt");
      return await decrypt(iv, key, encryptedArray);
    } catch (error) {
      console.error(error);
      return encryptionData;
    }
  }
  if (serverAddress.value != "") {
    connect();
  }

  // src/Views/messageComposer.tsx
  function MessageComposer() {
    return /* @__PURE__ */ createElement("div", { class: "flex-row width-100" }, /* @__PURE__ */ createElement(
      "input",
      {
        class: "width-100 flex-1",
        style: "max-width: unset",
        placeholder: translation.composerPlaceholder,
        "bind:value": messageBody,
        "on:enter": sendMessage
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "on:click": sendMessage,
        "toggle:disabled": cannotSendMessage
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "send")
    ));
  }

  // src/Views/threadView.tsx
  var messageConverter = (message) => {
    const messageBody2 = createProxyState([messages], () => message.body);
    function copyMessage() {
      navigator.clipboard.writeText(message.body);
    }
    function decrypt2() {
      decryptReceivedMessage(message);
    }
    function remove() {
      deleteMessage(message);
    }
    return /* @__PURE__ */ createElement("div", { class: "tile width-100 flex-no padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center secondary" }, /* @__PURE__ */ createElement("span", { class: "padding-h ellipsis" }, /* @__PURE__ */ createElement("b", { class: "info" }, message.sender), " - ", message.channel), /* @__PURE__ */ createElement("span", { class: "flex-row" }, /* @__PURE__ */ createElement("button", { "aria-label": translation.copyMessage, "on:click": copyMessage }, /* @__PURE__ */ createElement("span", { class: "icon" }, "content_copy")), /* @__PURE__ */ createElement("button", { "aria-label": translation.decryptMessage, "on:click": decrypt2 }, /* @__PURE__ */ createElement("span", { class: "icon" }, "key")), /* @__PURE__ */ createElement("button", { "aria-label": translation.deleteMessage, "on:click": remove }, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")))), /* @__PURE__ */ createElement("div", { class: "flex-column padding-h padding-bottom" }, /* @__PURE__ */ createElement("b", { class: "break-word", "subscribe:innerText": messageBody2 }), /* @__PURE__ */ createElement("span", { class: "secondary" }, new Date(message.isoDate).toLocaleString()))));
  };
  function ThreadView() {
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "subscribe:children": [messages, messageConverter]
      }
    );
  }

  // src/Tabs/messageTab.tsx
  function MessageTab() {
    return /* @__PURE__ */ createElement("article", { id: "message-tab" }, /* @__PURE__ */ createElement("header", null, translation.messages, /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        "aria-label": translation.clearHistory,
        "on:click": clearMessageHistory
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete_sweep")
    ))), ThreadView(), /* @__PURE__ */ createElement("footer", null, MessageComposer()));
  }

  // src/Views/communicationSection.tsx
  var secondaryChannelConverter = (channel) => {
    function remove() {
      removeSecondaryChannel(channel);
    }
    return /* @__PURE__ */ createElement("div", { class: "tile padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center" }, /* @__PURE__ */ createElement("b", { class: "padding-h" }, channel.channelName), /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "aria-label": translation.removeSecondaryChannel,
        "on:click": remove
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")
    )));
  };
  function CommunicationSection() {
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h2", null, translation.communication), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.myName), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": senderName,
        placeholder: translation.yourNamePlaceholder
      }
    ))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.primaryChannel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": primaryChannel,
        "on:enter": setChannel,
        placeholder: translation.channelPlaceholder
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger width-50",
        "on:click": leaveChannel,
        "toggle:disabled": cannotLeaveChannel
      },
      translation.leaveChannel
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-50",
        "on:click": setChannel,
        "toggle:disabled": cannotSetChannel
      },
      translation.setInput,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row width-input margin-bottom" }, /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": newSecondaryChannelName,
        "on:enter": addSecondaryChannel,
        placeholder: translation.newSecondaryChannelPlaceholder,
        class: "width-100 flex"
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "on:click": addSecondaryChannel,
        "toggle:disabled": cannotAddSecondaryChannel,
        "aria-label": translation.addSecondaryChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap",
        "subscribe:children": [secondaryChannels, secondaryChannelConverter]
      }
    ));
  }

  // src/Views/connectionSettingsView.tsx
  function ConnectionInputView() {
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "cell_tower"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.serverAddress), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": serverAddress,
        "on:enter": connect,
        placeholder: translation.serverAddressPlaceholder
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger width-50",
        "on:click": disconnect,
        "toggle:disabled": cannotDisonnect
      },
      translation.disconnect
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-50",
        "on:click": connect,
        "toggle:disabled": cannotConnect
      },
      translation.connectToServer,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "inbox"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.mailbox), /* @__PURE__ */ createElement("span", { class: "secondary" }, translation.mailboxExplanation))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger width-50",
        "on:click": deleteMailbox,
        "toggle:disabled": cannotDeleteMailbox
      },
      translation.deleteMailbox
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary width-50",
        "on:click": requestMailbox,
        "toggle:disabled": cannotRequestMailbox
      },
      translation.requestMailbox,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )));
  }

  // src/Views/connectionStatusView.tsx
  function ConnectionStatusView() {
    return /* @__PURE__ */ createElement("div", { class: "tile width-input" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.connectionStatus), /* @__PURE__ */ createElement(
      "span",
      {
        class: "success connected-only",
        "subscribe:innerText": connectionMessage
      }
    ), /* @__PURE__ */ createElement("span", { class: "error disconnected-only" }, translation.disconnected)));
  }

  // src/Views/connectionSection.tsx
  function ConnectionSection() {
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h2", null, translation.connection), ConnectionStatusView(), /* @__PURE__ */ createElement("hr", null), ConnectionInputView());
  }

  // src/Views/encryptionSection.tsx
  var shouldShowKey = new State(false);
  var inputType = createProxyState(
    [shouldShowKey],
    () => shouldShowKey.value ? "text" : "password"
  );
  function EncryptionSection() {
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h2", null, translation.encryption), /* @__PURE__ */ createElement(
      "div",
      {
        class: "error tile margin-bottom",
        "toggle:hidden": !isEncryptionUnavailable
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "warning"),
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.encryptionUnavailableTitle), /* @__PURE__ */ createElement("p", null, translation.encryptionUnavailableMessage))
    ), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "key"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.encryptionKey), /* @__PURE__ */ createElement(
      "input",
      {
        "toggle:disabled": isEncryptionUnavailable,
        "bind:value": encryptionKey,
        "set:type": inputType,
        placeholder: translation.encryptionKeyPlaceholder
      }
    ))), /* @__PURE__ */ createElement("label", { class: "inline" }, /* @__PURE__ */ createElement("input", { type: "checkbox", "bind:checked": shouldShowKey }), translation.showEncryptionKey));
  }

  // src/Tabs/settingsTab.tsx
  function SettingsTab() {
    return /* @__PURE__ */ createElement("article", { id: "settings-tab", "toggle:connected": isConnected }, /* @__PURE__ */ createElement("header", null, translation.settings), /* @__PURE__ */ createElement("div", null, ConnectionSection(), CommunicationSection(), EncryptionSection()));
  }

  // src/index.tsx
  document.body.prepend(
    /* @__PURE__ */ createElement("menu", { class: "mobile-only" }, /* @__PURE__ */ createElement("a", { class: "tab-link", href: "#settings-tab", active: true }, /* @__PURE__ */ createElement("span", { class: "icon" }, "settings"), translation.settings), /* @__PURE__ */ createElement("a", { class: "tab-link", href: "#message-tab" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), translation.messages))
  );
  document.querySelector("main").append(SettingsTab(), MessageTab());
  document.querySelector("main").classList.add("split");
})();
