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
        if (!this.removalHandlers.has(item)) return;
        this.removalHandlers.get(item)(item);
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
      this.removalHandlers.set(item, handler);
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
                  element.append(newValue);
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
                  throw `error: cannot process subscribe:children directive because ListItemConverter is not defined. Usage: "subscribe:children={[list, converter]}"; you can find a more detailed example in the documentation`;
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
    if (!window.crypto.subtle) return false;
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

  // src/utility.ts
  var storageKeys = {
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
    composingMessage(id) {
      return id + "composing-message";
    }
  };

  // src/Model/chatModel.ts
  var Chat = class {
    id;
    isSubscribed = new State(false);
    currentChannel = new State("");
    primaryChannelInput;
    secondaryChannels;
    encryptionKey;
    messages;
    composingMessage;
    newSecondaryChannelName;
    cannotSendMessage;
    cannotAddSecondaryChannel;
    cannotSetChannel;
    // init
    constructor(id = UUID()) {
      this.primaryChannelInput = restoreState(
        storageKeys.primaryChannel(id),
        ""
      );
      this.secondaryChannels = restoreListState(
        storageKeys.secondaryChannels(id)
      );
      this.encryptionKey = restoreState(storageKeys.encyptionKey(id), "");
      this.messages = restoreListState(storageKeys.messages(id));
      this.composingMessage = restoreState(
        storageKeys.composingMessage(id),
        ""
      );
      this.newSecondaryChannelName = new State("");
      this.cannotSendMessage = createProxyState(
        [
          this.primaryChannelInput,
          this.composingMessage,
          this.isSubscribed,
          isConnected
        ],
        () => this.primaryChannelInput.value == "" || this.composingMessage.value == "" || this.isSubscribed.value == false || isConnected.value == false
      );
      this.cannotAddSecondaryChannel = createProxyState(
        [this.newSecondaryChannelName],
        () => this.newSecondaryChannelName.value == ""
      );
      this.cannotSetChannel = createProxyState(
        [this.primaryChannelInput, this.currentChannel],
        () => this.primaryChannelInput.value == "" || this.primaryChannelInput.value == this.currentChannel.value
      );
    }
    // handlers
    onmessage(data) {
      if (data.messageChannel && data.messageChannel != this.currentChannel.value)
        return;
      if (data.subscribed != void 0) this.handleSubscription(data.subscribed);
      if (!data.messageBody) return;
      const { sender, body, channel, isoDate } = JSON.parse(data.messageBody);
      this.handleMessage({ sender, body, channel, isoDate });
    }
    handleSubscription(isSubscribed) {
      this.isSubscribed.value = isSubscribed;
    }
    handleMessage(chatMessage) {
      this.messages.add(chatMessage);
    }
    // messages
    async sendMessage() {
      if (this.cannotSendMessage.value == true) return;
      const secondaryChannelNames = [
        ...this.secondaryChannels.value.values()
      ].map((channel) => channel);
      const allChannelNames = [
        this.primaryChannelInput.value,
        ...secondaryChannelNames
      ];
      const encrypted = await encryptString(
        this.composingMessage.value,
        this.encryptionKey.value
      ) || this.composingMessage.value;
      if (encrypted == void 0) return;
      const joinedChannelName = allChannelNames.join("/");
      const messageObject = {
        channel: joinedChannelName,
        sender: senderName.value,
        body: encrypted,
        isoDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      const messageString = JSON.stringify(messageObject);
      UDN.sendMessage(joinedChannelName, messageString);
      this.composingMessage.value = "";
    }
    clearMessages() {
      this.messages.clear();
    }
    deleteMessage(message) {
      this.messages.remove(message);
    }
    async decryptReceivedMessage(message) {
      message.body = await decryptString(message.body, this.encryptionKey.value);
      this.messages.callSubscriptions();
    }
    // channel
    setChannel() {
      if (this.cannotSetChannel.value == true) return;
      this.currentChannel.value = this.primaryChannelInput.value;
      UDN.subscribe(this.currentChannel.value);
    }
    addSecondaryChannel() {
      if (this.cannotAddSecondaryChannel.value == true) return;
      this.secondaryChannels.add(this.newSecondaryChannelName.value);
      this.newSecondaryChannelName.value = "";
    }
    removeSecondaryChannel(channel) {
      this.secondaryChannels.remove(channel);
    }
  };
  var chatIds = restoreListState("chat-ids");
  var chatArray = [...chatIds.value.values()].map((id) => new Chat(id));
  var chats = new ListState(chatArray);

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
    currentAddress.value = serverAddressInput.value;
    isConnected.value = false;
    didRequestConnection.value = true;
    UDN.connect(serverAddressInput.value);
  }
  function disconnect() {
    didRequestConnection.value = false;
    if (cannotDisonnect.value == true) return;
    UDN.disconnect();
  }
  function resetAddressInput() {
    serverAddressInput.value = currentAddress.value;
  }
  UDN.onconnect = () => {
    isConnected.value = true;
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
    [mailboxId, isMailboxActive],
    () => mailboxId.value == "" || isMailboxActive.value == false
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
  UDN.onmailboxcreate = (id) => {
    mailboxId.value = id;
    UDN.connectMailbox(id);
  };
  UDN.onmailboxconnect = () => {
    isMailboxActive.value = true;
  };
  UDN.onmailboxdelete = () => {
    isMailboxActive.value = false;
    mailboxId.value = "";
  };
  var isEncryptionUnavailable = window.crypto.subtle == void 0;
  var senderName = restoreState("sender-name", "");
  var selectedChat = new State(void 0);
  if (serverAddressInput.value != "" && didRequestConnection.value == true) {
    connect();
  }

  // src/translations.ts
  var englishTranslations = {
    // general
    setInput: "Set",
    // overview
    overview: "Overview",
    connection: "Connection",
    communication: "Communication",
    encryption: "Encryption",
    serverAddress: "Server Address",
    serverAddressPlaceholder: "wss://192.168.0.69:3000",
    connectToServer: "Connect",
    disconnect: "Disonnect",
    resetAddress: "Reset address",
    noChatSelected: "No chat selected",
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
      // settings
      overview: "Configuraci\xF3n",
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
      // settings
      overview: "Einstellungen",
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

  // src/Views/messageComposer.tsx
  function MessageComposer() {
    const composerContent = createProxyState([selectedChat], () => {
      if (selectedChat.value == void 0) return /* @__PURE__ */ createElement("div", null);
      const chat = selectedChat.value;
      return /* @__PURE__ */ createElement("div", { class: "flex-row width-100" }, " ", /* @__PURE__ */ createElement(
        "input",
        {
          class: "width-100 flex-1",
          style: "max-width: unset",
          placeholder: translation.composerPlaceholder,
          "bind:value": chat.composingMessage,
          "on:enter": chat.sendMessage
        }
      ), /* @__PURE__ */ createElement(
        "button",
        {
          class: "primary",
          "on:click": chat.sendMessage,
          "toggle:disabled": chat.cannotSendMessage
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "send")
      ));
    });
    return /* @__PURE__ */ createElement("div", { "children:set": composerContent });
  }

  // src/Views/threadView.tsx
  function ThreadView() {
    const threadViewContent = createProxyState([selectedChat], () => {
      if (selectedChat.value == void 0)
        return /* @__PURE__ */ createElement("div", null, translation.noChatSelected);
      const chat = selectedChat.value;
      const messageConverter = (message) => {
        function copyMessage() {
          navigator.clipboard.writeText(message.body);
        }
        function decrypt2() {
          chat.decryptReceivedMessage(message);
        }
        function remove() {
          chat.deleteMessage(message);
        }
        return /* @__PURE__ */ createElement("div", { class: "tile width-100 flex-no padding-0" }, /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("div", { class: "flex-row justify-apart align-center secondary" }, /* @__PURE__ */ createElement("span", { class: "padding-h ellipsis" }, /* @__PURE__ */ createElement("b", { class: "info" }, message.sender), " - ", message.channel), /* @__PURE__ */ createElement("span", { class: "flex-row" }, /* @__PURE__ */ createElement(
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
        ), /* @__PURE__ */ createElement(
          "button",
          {
            "aria-label": translation.deleteMessage,
            "on:click": remove
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")
        ))), /* @__PURE__ */ createElement("div", { class: "flex-column padding-h padding-bottom" }, /* @__PURE__ */ createElement("b", { class: "break-word", "subscribe:innerText": message.body }), /* @__PURE__ */ createElement("span", { class: "secondary" }, new Date(message.isoDate).toLocaleString()))));
      };
      return /* @__PURE__ */ createElement(
        "div",
        {
          class: "flex-column gap",
          "children:append": [chat.messages, messageConverter]
        }
      );
    });
    return /* @__PURE__ */ createElement("div", { "children:set": threadViewContent });
  }

  // src/Tabs/messageTab.tsx
  function MessageTab() {
    function clearMessageHistory() {
      selectedChat.value?.clearMessages();
    }
    const headerText = createProxyState(
      [selectedChat],
      () => selectedChat.value != void 0 ? selectedChat.value.currentChannel : translation.messages
    );
    return /* @__PURE__ */ createElement("article", { id: "message-tab" }, /* @__PURE__ */ createElement("header", null, /* @__PURE__ */ createElement("span", { "subscribe:innerText": headerText }), /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        "aria-label": translation.clearHistory,
        "on:click": clearMessageHistory
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete_sweep")
    ))), ThreadView(), /* @__PURE__ */ createElement("footer", null, MessageComposer()));
  }

  // src/Views/connectionSection.tsx
  function ConnectionSection() {
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "cell_tower"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.serverAddress), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": serverAddressInput,
        "on:enter": connect,
        placeholder: translation.serverAddressPlaceholder
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row width-input justify-end" }, /* @__PURE__ */ createElement(
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
        "aria-label": translation.resetAddress,
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
    )));
  }

  // src/Tabs/settingsTab.tsx
  function SettingsTab() {
    return /* @__PURE__ */ createElement("article", { id: "settings-tab", "toggle:connected": isConnected }, /* @__PURE__ */ createElement("header", null, translation.overview), /* @__PURE__ */ createElement("div", null, ConnectionSection()));
  }

  // src/index.tsx
  document.querySelector("main").append(SettingsTab(), MessageTab());
  document.querySelector("main").classList.add("split");
})();
