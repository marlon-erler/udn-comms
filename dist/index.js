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
      this.removalHandlers.get(item)(item);
      this.removalHandlers.delete(item);
    }
    clear() {
      this.value.clear();
      this.callSubscriptions();
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

  // src/utility.ts
  var storageKeys = {
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

  // src/Model/chatModel.ts
  var Chat = class {
    id;
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
    // init
    constructor(id = UUID()) {
      this.id = id;
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
      const { sender, body, channel, isoDate, messageObject } = JSON.parse(
        data.messageBody
      );
      if (messageObject && messageObject.id && messageObject.title) {
        return this.handleMessageObject(messageObject);
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
      this.objects.set(messageObject.id, messageObject);
    };
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
      if (messageObject) chatMessage.messageObject = messageObject;
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
    sendMessagesInOutbox = () => {
      this.outbox.value.forEach((message) => {
        this.sendMessage(message);
      });
      this.objectOutbox.value.forEach(async (object) => {
        const chatMessage = await this.createChatMessage("", object);
        this.sendMessage(chatMessage);
      });
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
      if (isConnected.value == false || this.isSubscribed.value == false) return;
      const encryptedBody = this.encryptionKey.value == "" ? chatMessage.body : await encryptString(chatMessage.body, this.encryptionKey.value);
      chatMessage.body = encryptedBody;
      const messageString = JSON.stringify(chatMessage);
      UDN.sendMessage(chatMessage.channel, messageString);
      this.outbox.remove(chatMessage);
      if (chatMessage.messageObject)
        this.objectOutbox.remove(chatMessage.messageObject.id);
    };
    // objects
    addObjectAndSend(object) {
      this.objects.set(object.id, object);
      this.sendObject(object);
    }
    sendObject(object) {
      this.objectOutbox.set(object.id, object);
      this.sendMessagesInOutbox();
    }
    deleteObject(object) {
      this.objects.remove(object.id);
      this.objectOutbox.remove(object.id);
    }
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
    currentAddress.value = serverAddressInput.value;
    previousAddresses.add(currentAddress.value);
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
  var isEncryptionAvailable = window.crypto.subtle != void 0;
  var senderName = restoreState("sender-name", "");
  var chats = new ListState();
  var chatIds = restoreListState("chat-ids");
  var selectedChat = new State(void 0);
  var isShowingChatTools = new State(false);
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
    isShowingChatTools.value = false;
    selectedChat.value = void 0;
    document.getElementById("settings-tab")?.scrollIntoView();
  }
  function selectChat(chat) {
    selectedChat.value = chat;
    chat.hasUnreadMessages.value = false;
    document.getElementById("message-tab")?.scrollIntoView();
  }
  function toggleChatTools() {
    isShowingChatTools.value = !isShowingChatTools.value;
  }
  chatIds.value.forEach((id) => chats.add(new Chat(id)));
  if (serverAddressInput.value != "" && didRequestConnection.value == true) {
    connect();
  }

  // src/translations.ts
  var englishTranslations = {
    // general
    set: "Set",
    save: "Save",
    back: "Back",
    undoChanges: "Undo changes",
    close: "Close",
    discard: "Discard",
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
    connectToServer: "Connect",
    disconnect: "Disonnect",
    mailbox: "Mailbox",
    requestMailbox: "Enable",
    deleteMailbox: "Disable",
    mailboxExplanation: "When you're disconnected, messages will be kept on the server temporarily",
    primaryChannel: "Primary channel",
    primaryChannelPlaceholder: "my-channel",
    addChat: "Add",
    // messages
    showChatOptions: "show chat options",
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
    // objects
    toggleChatTools: "toggle chat tools",
    objectTitle: "Object title",
    objectTitlePlaceholder: "My object",
    deleteObject: "Delete object"
  };
  var allTranslations = {
    en: englishTranslations,
    es: {
      // general
      set: "Guardar",
      back: "Atr\xE1s",
      undoChanges: "Deshacer",
      close: "Cerrar",
      // overview
      overview: "Resumen",
      connection: "Conexion",
      chats: "Chats",
      yourName: "Tu nombre",
      namePlaceholder: "Juan P\xE9rez",
      encryptionUnavailableTitle: "Cifrado no disponible",
      encryptionUnavailableMessage: "Obt\xE9n esta aplicaci\xF3n a traves de HTTPS o contin\xFAa sin cifrado",
      serverAddress: "Direccion del servidor",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      connectToServer: "Conectar",
      disconnect: "Desconectar",
      mailbox: "Buz\xF3n",
      requestMailbox: "Activar",
      deleteMailbox: "Desactivar",
      mailboxExplanation: "Si est\xE1s sin conexi\xF3n, los mensajes se guardar\xE1n temporalmente en el servidor",
      primaryChannel: "Canal principal",
      primaryChannelPlaceholder: "mi-canal",
      addChat: "A\xF1adir",
      // messages
      showChatOptions: "Mostrar opciones del chat",
      configureChatTitle: "Configurar chat",
      secondaryChannel: "Canal segundario",
      secondaryChannelPlaceholder: "A\xF1adir canal segundario",
      addSecondaryChannel: "A\xF1adir canal segundario",
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
      deleteMessage: "Eliminar este mensaje"
    },
    de: {
      // general
      set: "OK",
      back: "Zur\xFCck",
      undoChanges: "\xC4nderungen verwerfen",
      close: "Schlie\xDFen",
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
      connectToServer: "Verbinden",
      disconnect: "Trennen",
      mailbox: "Briefkasten",
      requestMailbox: "Aktivieren",
      deleteMailbox: "Deaktivieren",
      mailboxExplanation: "Wenn du offline bist, werden Nachrichten auf dem Server gelagert",
      primaryChannel: "Hauptkanal",
      primaryChannelPlaceholder: "mein-kanal",
      addChat: "Hinzuf\xFCgen",
      // messages
      showChatOptions: "Chatoptionen einblenden",
      configureChatTitle: "Chat konfigurieren",
      secondaryChannel: "Zweitkanal",
      secondaryChannelPlaceholder: "Zweitkanal hinzuf\xFCgen",
      addSecondaryChannel: "Zweitkanal hinzuf\xFCgen",
      removeSecondaryChannel: "Zweitkanal entfernen",
      encryptionKey: "Schl\xFCssel",
      encryptionKeyPlaceholder: "n10d2482dg283hg",
      showKey: "Schl\xFCssel anzeigen",
      removeChat: "Chat l\xF6schen",
      clearChatMessages: "Nachrichtenverlauf leeren",
      noChatSelected: "Kein Chat ausgew\xE4hlt",
      messageInOutbox: "Ausstehend",
      composerPlaceholder: "Neue Nachricht...",
      sendMessage: "Senden",
      resendMessage: "Erneut senden",
      decryptMessage: "Nachricht entschl\xFCsseln",
      copyMessage: "Nachricht kopieren",
      deleteMessage: "Nachricht l\xF6schen"
    }
  };
  var language = navigator.language.substring(0, 2);
  var translation = allTranslations[language] ?? allTranslations.en;

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
    ))), /* @__PURE__ */ createElement("label", { class: "inline margin-0" }, /* @__PURE__ */ createElement("input", { type: "checkbox", "bind:checked": shouldShowKey }), translation.showKey)), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "on:click": chat.clearMessages,
        "toggle:disabled": chat.cannotClearMessages
      },
      translation.clearChatMessages,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete_sweep")
    ), /* @__PURE__ */ createElement("button", { class: "danger", "on:click": deleteChat }, translation.removeChat, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")))), /* @__PURE__ */ createElement("button", { "on:click": closeModal }, translation.close, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/Views/Chat/itemDetailModal.tsx
  function ItemDetailModal(chat, object, isPresented) {
    function closeModal() {
      isPresented.value = false;
    }
    function saveAndClose() {
      object.title = editingTitle.value;
      chat.addObjectAndSend(object);
      closeModal();
    }
    function deleteAndClose() {
      chat.deleteObject(object);
      closeModal();
    }
    const editingTitle = new State(object.title);
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isPresented }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, object.title), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "label"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.objectTitle), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": editingTitle,
        placeholder: translation.objectTitlePlaceholder
      }
    )))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("button", { class: "danger", "on:click": deleteAndClose }, translation.deleteObject, /* @__PURE__ */ createElement("span", { class: "icon" }, "delete"))), /* @__PURE__ */ createElement("div", { class: "flex-row" }, /* @__PURE__ */ createElement("button", { class: "flex-1 width-100 danger", "on:click": closeModal }, translation.discard), /* @__PURE__ */ createElement("button", { class: "flex-1 width-100 primary", "on:click": saveAndClose }, translation.save, /* @__PURE__ */ createElement("span", { class: "icon" }, "save")))));
  }

  // src/Views/Chat/chatToolView.tsx
  function ChatToolView(chat) {
    const isShowingObjectModal = new State(false);
    const selectedObject = new State(void 0);
    const objectModal = createProxyState([selectedObject], () => {
      if (selectedObject.value == void 0) return /* @__PURE__ */ createElement("div", null);
      return ItemDetailModal(chat, selectedObject.value, isShowingObjectModal);
    });
    function createItem() {
      chat.addObjectAndSend({
        id: UUID(),
        title: "new item"
      });
    }
    const itemConverter = (object) => {
      function select() {
        selectedObject.value = object;
        isShowingObjectModal.value = true;
      }
      return /* @__PURE__ */ createElement("button", { "on:click": select }, object.title);
    };
    return /* @__PURE__ */ createElement("div", { class: "chat-tool-view" }, /* @__PURE__ */ createElement("button", { "on:click": createItem }, "+"), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { "children:prepend": [chat.objects, itemConverter] }), /* @__PURE__ */ createElement("div", { "children:set": objectModal }));
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
    isShowingChatTools.subscribe(() => scrollToBottom());
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
            "aria-label": translation.toggleChatTools,
            "on:click": toggleChatTools,
            "toggle:selected": isShowingChatTools
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "architecture")
        ), /* @__PURE__ */ createElement(
          "button",
          {
            "aria-label": translation.showChatOptions,
            "on:click": showOptions
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "tune")
        ))),
        ChatToolView(chat),
        ThreadView(chat),
        /* @__PURE__ */ createElement("footer", null, MessageComposer(chat)),
        ChatOptionModal(chat, isShowingOptions)
      ];
    });
    return /* @__PURE__ */ createElement(
      "article",
      {
        "toggle:showingchattools": isShowingChatTools,
        id: "message-tab",
        "children:set": messageTabContent
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
  var addressConverter = (address) => {
    return /* @__PURE__ */ createElement("option", null, address);
  };
  function ConnectionSection() {
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
        "children:append": [previousAddresses, addressConverter]
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
    )));
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
    return /* @__PURE__ */ createElement("article", { id: "settings-tab", "toggle:connected": isConnected }, /* @__PURE__ */ createElement("header", null, translation.overview), /* @__PURE__ */ createElement("div", { class: "flex-column large-gap" }, /* @__PURE__ */ createElement("div", { class: "tile error flex-no", "toggle:hidden": isEncryptionAvailable }, /* @__PURE__ */ createElement("span", { class: "icon" }, "warning"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.encryptionUnavailableTitle), /* @__PURE__ */ createElement("span", { class: "secondary" }, translation.encryptionUnavailableMessage))), PersonalSection(), ConnectionSection(), ChatListSection()));
  }

  // src/index.tsx
  document.querySelector("main").append(OverviewTab(), MessageTab());
  document.querySelector("main").classList.add("split");
})();
