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
  function createProxyState(statesToSubscibe, fn) {
    const proxyState = new State(fn());
    statesToSubscibe.forEach(
      (state) => state.subscribe(() => proxyState.value = fn())
    );
    return proxyState;
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

  // src/Model/Utility/utility.ts
  function stringify(data) {
    return JSON.stringify(data);
  }
  function parse(string) {
    return JSON.parse(string);
  }

  // src/Model/Utility/typeSafety.ts
  var DATA_VERSION = "v2";
  function checkIsValidObject(object) {
    return object.dataVersion == DATA_VERSION;
  }

  // src/Model/storageModel.ts
  var PATH_COMPONENT_SEPARATOR = "\\";
  var StorageModel = class _StorageModel {
    storageEntryTree = {};
    // basic
    store = (pathComponents, value) => {
      const key = _StorageModel.pathComponentsToKey(...pathComponents);
      localStorage.setItem(key, value);
      this.updateTree(...pathComponents);
    };
    restore = (pathComponents) => {
      const key = _StorageModel.pathComponentsToKey(...pathComponents);
      return localStorage.getItem(key);
    };
    remove = (pathComponents, shouldInitialize = true) => {
      const key = _StorageModel.pathComponentsToKey(...pathComponents);
      localStorage.removeItem(key);
      if (shouldInitialize == true) {
        this.initializeTree();
      }
    };
    removeRecursive = (pathComponentsOfEntityToDelete) => {
      a: for (const key of Object.keys(localStorage)) {
        const pathComponentsOfCurrentEntity = _StorageModel.keyToPathComponents(key);
        for (let i = 0; i < pathComponentsOfEntityToDelete.length; i++) {
          if (!pathComponentsOfCurrentEntity[i]) continue a;
          if (pathComponentsOfCurrentEntity[i] != pathComponentsOfEntityToDelete[i])
            continue a;
        }
        this.remove(pathComponentsOfCurrentEntity, false);
      }
      this.initializeTree();
    };
    list = (pathComponents) => {
      let currentParent = this.storageEntryTree;
      for (const component of pathComponents) {
        const nextParent = currentParent[component];
        if (nextParent == void 0) return [];
        currentParent = nextParent;
      }
      return [...Object.keys(currentParent)];
    };
    // stringifiable
    storeStringifiable = (pathComponents, value) => {
      const valueString = stringify(value);
      this.store(pathComponents, valueString);
    };
    restoreStringifiable = (pathComponents) => {
      const valueString = this.restore(pathComponents);
      if (!valueString) return null;
      return parse(valueString);
    };
    // init
    constructor() {
      this.initializeTree();
    }
    // utility
    initializeTree = () => {
      console.log("initializing tree");
      this.storageEntryTree = {};
      for (const key of Object.keys(localStorage)) {
        const components = _StorageModel.keyToPathComponents(key);
        this.updateTree(...components);
      }
    };
    updateTree = (...pathComponents) => {
      let currentParent = this.storageEntryTree;
      for (const pathPart of pathComponents) {
        if (!currentParent[pathPart]) {
          currentParent[pathPart] = {};
        }
        currentParent = currentParent[pathPart];
      }
    };
    print = () => {
      console.log(JSON.stringify(this.storageEntryTree, null, 4));
    };
    static pathComponentsToKey = (...pathComponents) => {
      return pathComponents.join(PATH_COMPONENT_SEPARATOR);
    };
    static keyToPathComponents = (key) => {
      return key.split(PATH_COMPONENT_SEPARATOR);
    };
    static join = (...items) => {
      let allComponents = [];
      for (const item of items) {
        const parts = this.keyToPathComponents(item);
        allComponents.push(...parts);
      }
      return _StorageModel.pathComponentsToKey(...allComponents);
    };
  };
  var storageKeys = {
    // connection
    socketAddress: [DATA_VERSION, "connection", "socket-address"],
    // settings
    username: [DATA_VERSION, "settings", "user-name"],
    firstDayOfWeek: [DATA_VERSION, "settings", "first-day-of-week"],
    // history
    previousAddresses: [DATA_VERSION, "history", "previous-addresses"],
    previousObjectCategories: [DATA_VERSION, "history", "object-categories"],
    previousObjectStatuses: [DATA_VERSION, "history", "object-statuses"],
    previousObjectFilters: [DATA_VERSION, "history", "object-filters"],
    // chat etc
    chats: [DATA_VERSION, "chat"],
    chatInfo: (id) => [DATA_VERSION, "chat", id, "info"],
    chatMessages: (id) => [DATA_VERSION, "chat", id, "messages"],
    chatObjects: (id) => [DATA_VERSION, "chat", id, "objects"],
    chatOutbox: (id) => [DATA_VERSION, "chat", id, "outbox"]
  };

  // src/Model/chatModel.ts
  var ChatModel = class {
    // data
    id;
    storageModel;
    info;
    messages = /* @__PURE__ */ new Set();
    objects = /* @__PURE__ */ new Map();
    outbox = /* @__PURE__ */ new Set();
    // paths
    get infoPath() {
      return storageKeys.chatInfo(this.id);
    }
    get messageDirPath() {
      return storageKeys.chatMessages(this.id);
    }
    get objectDirPath() {
      return storageKeys.chatObjects(this.id);
    }
    get outboxDirPath() {
      return storageKeys.chatOutbox(this.id);
    }
    getMessagePath = (id) => {
      return [...this.messageDirPath, id];
    };
    getObjectPath = (id) => {
      return [...this.objectDirPath, id];
    };
    // set
    setPrimaryChannel = (primaryChannel) => {
      this.info.primaryChannel = primaryChannel;
      this.storeInfo();
    };
    setSecondaryChannels = (secondaryChannels) => {
      this.info.secondaryChannels = secondaryChannels;
      this.storeInfo();
    };
    // store & add
    storeInfo = () => {
      this.storageModel.storeStringifiable(this.infoPath, this.info);
    };
    addMessage = (message) => {
      if (!this.messages.has(message)) {
        this.messages.add(message);
      }
      const messagePath = this.getMessagePath(message.id);
      this.storageModel.storeStringifiable(messagePath, message);
    };
    addObject = (object) => {
      this.objects.set(object.id, object);
      const objectPath = this.getObjectPath(object.id);
      this.storageModel.storeStringifiable(objectPath, object);
    };
    // remove
    remove = () => {
      this.unloadData();
      const dirPath = [...storageKeys.chats, this.id];
      this.storageModel.removeRecursive(dirPath);
    };
    // restore
    restoreInfo = () => {
      const info = this.storageModel.restoreStringifiable(this.infoPath);
      if (info != null) {
        this.info = info;
      } else {
        this.info = generateChatInfo("0");
      }
    };
    restoreMessages = () => {
      const messageIds = this.storageModel.list(this.messageDirPath);
      if (!Array.isArray(messageIds)) return;
      for (const messageId of messageIds) {
        const messagePath = this.getMessagePath(messageId);
        const message = this.storageModel.restoreStringifiable(messagePath);
        if (checkIsValidObject(message) == false) return;
        this.messages.add(message);
      }
    };
    restoreObjects = () => {
      const objectIds = this.storageModel.list(this.objectDirPath);
      if (!Array.isArray(objectIds)) return;
      for (const objectId of objectIds) {
        const objectPathComponents = this.getObjectPath(objectId);
        const object = this.storageModel.restoreStringifiable(objectPathComponents);
        if (checkIsValidObject(object) == false) return;
        if (object.id != objectId) return;
        this.objects.set(objectId, object);
      }
    };
    // memory
    loadData = () => {
      this.restoreMessages();
      this.restoreObjects();
    };
    unloadData = () => {
      this.messages.clear();
      this.objects.clear();
    };
    // init
    constructor(storageModel2, chatId) {
      this.id = chatId;
      this.storageModel = storageModel2;
      this.restoreInfo();
    }
  };
  function generateChatInfo(primaryChannel) {
    return {
      primaryChannel,
      secondaryChannels: [],
      encryptionKey: "",
      hasUnreadMessages: false
    };
  }

  // src/Model/chatListModel.ts
  var ChatListModel = class {
    storageModel;
    // data
    chatModels = /* @__PURE__ */ new Map();
    // store & add
    addChatModel = (chatModel) => {
      this.chatModels.set(chatModel.id, chatModel);
    };
    createChat = (primaryChannel) => {
      const id = v4_default();
      const chatModel = new ChatModel(this.storageModel, id);
      chatModel.setPrimaryChannel(primaryChannel);
      this.addChatModel(chatModel);
      return chatModel;
    };
    deleteChat = (chat) => {
      chat.remove();
      this.untrackChat(chat);
    };
    untrackChat = (chat) => {
      this.chatModels.delete(chat.id);
    };
    // restore
    loadChats = () => {
      const chatDir = storageKeys.chats;
      const chatIds = this.storageModel.list(chatDir);
      for (const chatId of chatIds) {
        const chatModel = new ChatModel(this.storageModel, chatId);
        this.addChatModel(chatModel);
      }
    };
    // init
    constructor(storageModel2) {
      this.storageModel = storageModel2;
      this.loadChats();
    }
  };

  // src/ViewModel/chatListViewModel.tsx
  var ChatListViewModel = class {
    chatListModel;
    // state
    newChatPrimaryChannel = new State("");
    chatModels = new ListState();
    // guards
    cannotCreateChat = createProxyState(
      [this.newChatPrimaryChannel],
      () => this.newChatPrimaryChannel.value == ""
    );
    // methods
    createChat = () => {
      const chatModel = this.chatListModel.createChat(
        this.newChatPrimaryChannel.value
      );
      this.newChatPrimaryChannel.value = "";
      this.chatModels.add(chatModel);
    };
    deleteChat = (chat) => {
      this.chatListModel.deleteChat(chat);
      this.chatModels.remove(chat);
    };
    // restore
    restoreChats = () => {
      for (const chat of this.chatListModel.chatModels.values()) {
        this.chatModels.add(chat);
      }
    };
    // init
    constructor(storageModel2) {
      const chatListModel = new ChatListModel(storageModel2);
      this.chatListModel = chatListModel;
      this.restoreChats();
    }
  };

  // src/View/translations.ts
  var englishTranslations = {
    general: {
      closeButtonAudioLabel: "close",
      deleteItemButtonAudioLabel: "delete item"
    },
    regional: {
      weekdays: {
        full: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        abbreviated: [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ]
      }
    },
    homePage: {
      appName: "Comms",
      ///
      overviewHeadline: "Overview",
      serverAddress: "Server address",
      serverAddressPlaceholder: "wss://192.168.0.69:3000",
      connectAudioLabel: "connect to server",
      disconnectAudioLabel: "disconnect from server",
      manageConnectionsAudioLabel: "manage connections",
      mailboxHeadline: "Server Mailbox",
      mailboxDisabled: "Mailbox disabled. You will miss out on messages sent while you're away",
      mailboxEnabled: "Mailbox enabled. If you disconnect, the server will keep your messages temporarily",
      outboxHeadline: "Outbox",
      outboxAllItemsSent: "All items sent",
      yourNameLabel: "Your name",
      yourNamePlaceholder: "Jane Doe",
      setNameButton: "Set",
      firstDayOfWeekLabel: "First day of week",
      scrollToChatButton: "Chats",
      ///
      backToOverviewAudioLabel: "go back to overview",
      chatsHeadline: "Chats",
      addChatAudioLabel: "name of new chat",
      addChatPlaceholder: "Add chat",
      addChatButton: "Add chat"
    },
    connectionModal: {
      connectionModalHeadline: "Manage Connections",
      ///
      connectButtonAudioLabel: "connect"
    }
  };
  var allTranslations = {
    en: englishTranslations
  };
  var language = navigator.language.substring(0, 2);
  var translations = allTranslations[language] || allTranslations.en;

  // src/View/Components/deletableListItem.tsx
  function DeletableListItem(text, primaryButton, ondelete) {
    return /* @__PURE__ */ createElement("div", { class: "tile flex-row justify-apart align-center padding-0" }, /* @__PURE__ */ createElement("span", { class: "padding-h" }, text), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, primaryButton, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "aria-label": translations.general.deleteItemButtonAudioLabel,
        "on:click": ondelete
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")
    )));
  }

  // src/View/Modals/connectionModal.tsx
  function ConnectionModal(connectionViewModel2) {
    const previousAddressConverter = (address) => {
      function connnect() {
        connectionViewModel2.connectToAddress(address);
      }
      const cannotConnect = createProxyState(
        [connectionViewModel2.isConnected],
        () => connectionViewModel2.connectionModel.address == address
      );
      return DeletableListItem(
        address,
        /* @__PURE__ */ createElement(
          "button",
          {
            class: "primary",
            "on:click": connnect,
            "toggle:disabled": cannotConnect,
            "aria-label": translations.connectionModal.connectButtonAudioLabel
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "link")
        ),
        () => {
          connectionViewModel2.removePreviousAddress(address);
        }
      );
    };
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "modal",
        "toggle:open": connectionViewModel2.isShowingConnectionModal
      },
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translations.connectionModal.connectionModalHeadline), /* @__PURE__ */ createElement(
        "div",
        {
          class: "flex-column gap",
          "children:append": [
            connectionViewModel2.previousAddresses,
            previousAddressConverter
          ]
        }
      )), /* @__PURE__ */ createElement("button", { "on:click": connectionViewModel2.hideConnectionModal }, translations.general.closeButtonAudioLabel, /* @__PURE__ */ createElement("span", { class: "icon" }, "close")))
    );
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
    mailboxHandler = (mailboxId) => {
    };
    mailboxConnectionHandler = (mailboxId) => {
    };
    mailboxDeleteHandler = (mailboxId) => {
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
    connectMailbox(mailboxId) {
      const messageObject = {
        requestedMailbox: mailboxId
      };
      return this.send(messageObject);
    }
    deleteMailbox(mailboxId) {
      const messageObject = {
        deletingMailbox: mailboxId
      };
      return this.send(messageObject);
    }
  };

  // src/Model/connectionModel.ts
  var ConnectionModel = class {
    udn;
    storageModel;
    // data
    get isConnected() {
      return this.udn.ws != void 0 && this.udn.ws.readyState == 1;
    }
    get address() {
      return this.udn.ws?.url;
    }
    // connection
    connect = (address) => {
      this.udn.connect(address);
    };
    disconnect = () => {
      this.udn.disconnect();
    };
    handleConnectionChange = () => {
      console.log("connection status:", this.isConnected, this.address);
      if (this.isConnected == false) return;
      if (this.address) {
        this.storeAddress(this.address);
      }
    };
    // messaging
    sendChatMessage = (chatMessage) => {
      const stringifiedBody = stringify(chatMessage);
      return this.udn.sendMessage(chatMessage.channel, stringifiedBody);
    };
    // storage
    getAddressPath = (address) => {
      const dirPath = storageKeys.previousAddresses;
      return [...dirPath, address];
    };
    storeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.store(addressPath, "");
    };
    removeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.remove(addressPath);
    };
    get addresses() {
      const dirPath = storageKeys.previousAddresses;
      return this.storageModel.list(dirPath);
    }
    // setup
    constructor(configuration) {
      this.udn = new UDNFrontend();
      this.storageModel = configuration.storageModel;
      this.udn.onmessage = (data) => {
        configuration.messageHandler(data);
      };
      this.udn.onconnect = () => {
        this.handleConnectionChange();
        configuration.connectionChangeHandler();
      };
      this.udn.ondisconnect = () => {
        this.handleConnectionChange();
        configuration.connectionChangeHandler();
      };
    }
  };

  // src/ViewModel/connectionViewModel.tsx
  var ConnectionViewModel = class {
    connectionModel;
    // state
    serverAddressInput = new State("");
    isConnected = new State(false);
    isShowingConnectionModal = new State(false);
    previousAddresses = new ListState();
    // guards
    cannotConnect = createProxyState(
      [this.serverAddressInput, this.isConnected],
      () => this.isConnected.value == true && this.serverAddressInput.value == this.connectionModel.address || this.serverAddressInput.value == ""
    );
    cannotDisonnect = createProxyState(
      [this.isConnected],
      () => this.isConnected.value == false
    );
    hasNoPreviousConnections = createProxyState(
      [this.previousAddresses],
      () => this.previousAddresses.value.size == 0
    );
    // handlers
    connectionChangeHandler = () => {
      this.isConnected.value = this.connectionModel.isConnected;
      if (this.connectionModel.isConnected == false) return;
      if (this.connectionModel.address) {
        this.serverAddressInput.value = this.connectionModel.address;
      }
      this.updatePreviousAddresses();
    };
    messageHandler = (data) => {
    };
    // methods
    connect = () => {
      this.connectToAddress(this.serverAddressInput.value);
    };
    connectToAddress = (address) => {
      this.connectionModel.connect(address);
    };
    disconnect = () => {
      this.connectionModel.disconnect();
    };
    removePreviousAddress = (address) => {
      this.connectionModel.removeAddress(address);
      this.updatePreviousAddresses();
    };
    // view methods
    showConnectionModal = () => {
      this.isShowingConnectionModal.value = true;
    };
    hideConnectionModal = () => {
      this.isShowingConnectionModal.value = false;
    };
    updatePreviousAddresses = () => {
      this.previousAddresses.clear();
      this.previousAddresses.add(...this.connectionModel.addresses);
    };
    // init
    constructor(storageModel2) {
      const connectionModel = new ConnectionModel({
        storageModel: storageModel2,
        connectionChangeHandler: this.connectionChangeHandler,
        messageHandler: this.messageHandler
      });
      this.connectionModel = connectionModel;
      this.updatePreviousAddresses();
    }
  };

  // src/View/Components/option.tsx
  function Option(text, value, selectedOnCreate) {
    return /* @__PURE__ */ createElement("option", { value, "toggle:selected": selectedOnCreate }, text);
  }
  var StringToOption = (string) => {
    return Option(string, string, false);
  };

  // src/View/Components/chatEntry.tsx
  function ChatEntry(chatModel) {
    return /* @__PURE__ */ createElement("button", { class: "chat-entry tile" }, /* @__PURE__ */ createElement("span", { class: "shadow" }, chatModel.info.primaryChannel), /* @__PURE__ */ createElement("h2", null, chatModel.info.primaryChannel));
  }
  var ChatModelToChatEntry = (chatModel) => {
    return ChatEntry(chatModel);
  };

  // src/View/homePage.tsx
  function HomePage(settingsViewModel2, connectionViewModel2, chatListViewModel2) {
    const overviewSection = /* @__PURE__ */ createElement("div", { id: "overview-section" }, /* @__PURE__ */ createElement("h2", null, translations.homePage.overviewHeadline), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "cell_tower"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.serverAddress), /* @__PURE__ */ createElement(
      "input",
      {
        list: "previous-connection-list",
        placeholder: translations.homePage.serverAddressPlaceholder,
        "bind:value": connectionViewModel2.serverAddressInput,
        "on:enter": connectionViewModel2.connect
      }
    ), /* @__PURE__ */ createElement(
      "datalist",
      {
        hidden: true,
        id: "previous-connection-list",
        "children:append": [
          connectionViewModel2.previousAddresses,
          StringToOption
        ]
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger flex justify-center",
        "aria-label": translations.homePage.disconnectAudioLabel,
        "on:click": connectionViewModel2.disconnect,
        "toggle:disabled": connectionViewModel2.cannotDisonnect
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "link_off")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "flex justify-center",
        "aria-label": translations.homePage.manageConnectionsAudioLabel,
        "on:click": connectionViewModel2.showConnectionModal,
        "toggle:disabled": connectionViewModel2.hasNoPreviousConnections
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "history")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary flex justify-center",
        "aria-label": translations.homePage.connectAudioLabel,
        "on:click": connectionViewModel2.connect,
        "toggle:disabled": connectionViewModel2.cannotConnect
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "link")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "inbox"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translations.homePage.mailboxHeadline), /* @__PURE__ */ createElement("span", { class: "error" }, translations.homePage.mailboxDisabled))), /* @__PURE__ */ createElement("div", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "outbox"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translations.homePage.outboxHeadline), /* @__PURE__ */ createElement("span", { class: "success" }, translations.homePage.outboxAllItemsSent))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.yourNameLabel), /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translations.homePage.yourNamePlaceholder,
        "bind:value": settingsViewModel2.nameInput,
        "on:enter": settingsViewModel2.setName
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "on:click": settingsViewModel2.setName,
        "toggle:disabled": settingsViewModel2.cannotSetName
      },
      translations.homePage.setNameButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "calendar_month"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.firstDayOfWeekLabel), /* @__PURE__ */ createElement("select", { "bind:value": settingsViewModel2.firstDayOfWeekInput }, ...translations.regional.weekdays.full.map(
      (weekdayName, i) => Option(
        weekdayName,
        i.toString(),
        i == settingsViewModel2.firstDayOfWeekInput.value
      )
    )), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_drop_down"))), /* @__PURE__ */ createElement("div", { class: "mobile-only" }, /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, /* @__PURE__ */ createElement("button", { class: "ghost width-50", "on:click": scrollToChat }, translations.homePage.scrollToChatButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")))));
    const chatSection = /* @__PURE__ */ createElement("div", { id: "chat-section" }, /* @__PURE__ */ createElement("h2", null, translations.homePage.chatsHeadline), /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translations.homePage.addChatPlaceholder,
        "aria-label": translations.homePage.addChatAudioLabel,
        "bind:value": chatListViewModel2.newChatPrimaryChannel,
        "on:enter": chatListViewModel2.createChat
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.homePage.addChatButton,
        "on:click": chatListViewModel2.createChat,
        "toggle:disabled": chatListViewModel2.cannotCreateChat
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        id: "chat-grid",
        "children:append": [chatListViewModel2.chatModels, ChatModelToChatEntry]
      }
    ));
    function scrollToChat() {
      chatSection.scrollIntoView();
    }
    return /* @__PURE__ */ createElement("article", { id: "home-page" }, /* @__PURE__ */ createElement("header", null, /* @__PURE__ */ createElement("span", null, translations.homePage.appName)), /* @__PURE__ */ createElement("div", null, overviewSection, chatSection));
  }

  // src/Model/settingsModel.ts
  var SettingsModel = class {
    storageModel;
    username;
    firstDayOfWeek;
    // set
    setName(newValue) {
      this.username = newValue;
      const path = storageKeys.username;
      this.storageModel.store(path, newValue);
    }
    setFirstDayOfWeek(newValue) {
      this.firstDayOfWeek = newValue;
      const path = storageKeys.firstDayOfWeek;
      this.storageModel.storeStringifiable(path, newValue);
    }
    // restore
    restoreUsername() {
      const path = storageKeys.username;
      const content = this.storageModel.restore(path);
      this.username = content ?? "";
    }
    restoreFirstDayofWeek() {
      const path = storageKeys.firstDayOfWeek;
      const content = this.storageModel.restoreStringifiable(path);
      this.firstDayOfWeek = content ?? 0;
    }
    // init
    constructor(storageModel2) {
      this.storageModel = storageModel2;
      this.restoreUsername();
      this.restoreFirstDayofWeek();
    }
  };

  // src/ViewModel/settingsViewModel.ts
  var SettingsViewModel = class {
    settingsModel;
    // state
    nameInput = new State("");
    firstDayOfWeekInput = new State(0);
    // guards
    cannotSetName = createProxyState(
      [this.nameInput],
      () => this.nameInput.value == "" || this.nameInput.value == this.settingsModel.username
    );
    // set
    setName = () => {
      this.settingsModel.setName(this.nameInput.value);
      this.nameInput.callSubscriptions();
    };
    setFirstDayofWeek = () => {
      this.settingsModel.setFirstDayOfWeek(this.firstDayOfWeekInput.value);
    };
    // init
    constructor(storageModel2) {
      const settingsModel = new SettingsModel(storageModel2);
      this.settingsModel = settingsModel;
      this.nameInput.value = settingsModel.username;
      this.firstDayOfWeekInput.value = settingsModel.firstDayOfWeek;
      this.firstDayOfWeekInput.subscribe(this.setFirstDayofWeek);
    }
  };

  // src/index.tsx
  var storageModel = new StorageModel();
  storageModel.print();
  var settingsViewModel = new SettingsViewModel(storageModel);
  var connectionViewModel = new ConnectionViewModel(storageModel);
  var chatListViewModel = new ChatListViewModel(storageModel);
  document.querySelector("main").append(
    HomePage(settingsViewModel, connectionViewModel, chatListViewModel),
    ConnectionModal(connectionViewModel)
  );
})();
