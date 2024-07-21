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
              case "prepend": {
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
                } catch (error) {
                  throw `error: cannot process subscribe:children directive. 
 Error: ${error} 
 Usage: "subscribe:children={[list, converter]}"; you can find a more detailed example in the documentation.`;
                }
              }
            }
            break;
          }
          default:
            element.setAttribute(attributename, value);
        }
      });
    children.filter((x) => x).forEach((child) => element.append(child));
    return element;
  }

  // src/Model/Utility/typeSafety.ts
  var DATA_VERSION = "v2";
  function checkIsValidObject(object) {
    return object.dataVersion == DATA_VERSION;
  }
  function checkMatchesObjectStructure(objectToCheck, reference) {
    for (const key of Object.keys(reference)) {
      const requiredType = typeof reference[key];
      const actualType = typeof objectToCheck[key];
      if (requiredType != actualType) return false;
      if (requiredType != "object") continue;
      const doesNestedObjectMatch = checkMatchesObjectStructure(
        reference[key],
        objectToCheck[key]
      );
      if (doesNestedObjectMatch == false) return false;
    }
    return true;
  }

  // src/Model/Utility/utility.ts
  function createTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function stringify(data) {
    return JSON.stringify(data, null, 4);
  }
  function parse(string) {
    try {
      return JSON.parse(string);
    } catch {
      return {};
    }
  }
  function parseValidObject(string) {
    const parsed = parse(string);
    if (checkIsValidObject(parsed) == false) return null;
    return parsed;
  }
  function localeCompare(a, b) {
    return a.localeCompare(b);
  }

  // src/Model/storageModel.ts
  var PATH_COMPONENT_SEPARATOR = "\\";
  var StorageModel = class _StorageModel {
    storageEntryTree = {};
    // basic
    write = (pathComponents, value) => {
      const pathString = _StorageModel.pathComponentsToString(
        ...pathComponents
      );
      localStorage.setItem(pathString, value);
      this.updateTree(...pathComponents);
    };
    read = (pathComponents) => {
      const pathString = _StorageModel.pathComponentsToString(
        ...pathComponents
      );
      return localStorage.getItem(pathString);
    };
    remove = (pathComponents, shouldInitialize = true) => {
      const pathString = _StorageModel.pathComponentsToString(
        ...pathComponents
      );
      localStorage.removeItem(pathString);
      if (shouldInitialize == true) {
        this.initializeTree();
      }
    };
    removeRecursive = (pathComponentsOfEntityToDelete) => {
      a: for (const key of Object.keys(localStorage)) {
        const pathComponentsOfCurrentEntity = _StorageModel.stringToPathComponents(key);
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
      return [...Object.keys(currentParent).sort(localeCompare)];
    };
    // stringifiable
    writeStringifiable = (pathComponents, value) => {
      const valueString = stringify(value);
      this.write(pathComponents, valueString);
    };
    readStringifiable = (pathComponents) => {
      const valueString = this.read(pathComponents);
      if (!valueString) return null;
      const object = parseValidObject(valueString);
      return object;
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
        const components = _StorageModel.stringToPathComponents(key);
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
    printTree = () => {
      return stringify(this.storageEntryTree);
    };
    static getFileName = (pathComponents) => {
      return pathComponents[pathComponents.length - 1] || "\\";
    };
    static getFileNameFromString = (pathString) => {
      const pathComponents = this.stringToPathComponents(pathString);
      return pathComponents[pathComponents.length - 1] || "\\";
    };
    static pathComponentsToString = (...pathComponents) => {
      return pathComponents.join(PATH_COMPONENT_SEPARATOR);
    };
    static stringToPathComponents = (string) => {
      return string.split(PATH_COMPONENT_SEPARATOR).filter((x) => x != "");
    };
    static join = (...items) => {
      let allComponents = [];
      for (const item of items) {
        const parts = this.stringToPathComponents(item);
        allComponents.push(...parts);
      }
      return _StorageModel.pathComponentsToString(...allComponents);
    };
  };
  var storageKeys = {
    // connection
    socketAddress: [DATA_VERSION, "connection", "socket-address"],
    reconnectAddress: [DATA_VERSION, "connection", "reconnect-address"],
    outbox: [DATA_VERSION, "connection", "outbox"],
    mailboxes: [DATA_VERSION, "connection", "mailboxes"],
    // settings
    username: [DATA_VERSION, "settings", "user-name"],
    firstDayOfWeek: [DATA_VERSION, "settings", "first-day-of-week"],
    // history
    previousAddresses: [DATA_VERSION, "history", "previous-addresses"],
    // chat
    chats: [DATA_VERSION, "chat"],
    chatInfo: (id) => [DATA_VERSION, "chat", id, "info"],
    chatLastUsedPage: (id) => [
      DATA_VERSION,
      "chat",
      id,
      "last-used-page"
    ],
    chatColor: (id) => [DATA_VERSION, "chat", id, "color"],
    chatMessages: (id) => [DATA_VERSION, "chat", id, "messages"],
    chatFiles: [DATA_VERSION, "chat", "files"]
  };

  // src/Model/fileModel.ts
  var FileModel = class _FileModel {
    chatModel;
    storageModel;
    // handler
    handleStringifiedFile = (stringifiedFile) => {
      const file = parseValidObject(stringifiedFile);
      if (file == null) return;
      this.storeFile(file);
    };
    // methods
    addFile = (file) => {
      this.chatModel.sendMessage("", file);
    };
    // storage
    storeFile = (file) => {
      for (const fileContent of file.contentVersions) {
        this.storeFileContent(file, fileContent);
      }
    };
    storeFileContent = (file, fileContent) => {
      const fileContentName = _FileModel.getFileContentName(fileContent);
      const fileContentPath = _FileModel.getFileContentPath(
        file,
        fileContentName
      );
      const existingFileContent = this.storageModel.read(fileContentPath);
      if (existingFileContent != null) return;
      const stringifiedContent = stringify(fileContent);
      this.storageModel.write(fileContentPath, stringifiedContent);
    };
    listFileIds = () => {
      return this.storageModel.list(storageKeys.chatFiles);
    };
    listFileContents = (file) => {
      const filePath = _FileModel.getFilePath(file.id);
      return this.storageModel.list(filePath);
    };
    getFile = (fileId) => {
      const filePath = _FileModel.getFilePath(fileId);
      const fileOrNull = this.storageModel.readStringifiable(filePath);
      return fileOrNull;
    };
    getLatestFileContentName = (fileContentNames) => {
      return fileContentNames[fileContentNames.length - 1];
    };
    getFileContent = (file, fileContentName) => {
      const filePath = _FileModel.getFileContentPath(file, fileContentName);
      const fileContentOrNull = this.storageModel.readStringifiable(filePath);
      return fileContentOrNull;
    };
    // init
    constructor(chatModel, storageModel2) {
      this.chatModel = chatModel;
      this.storageModel = storageModel2;
    }
    // utility
    static getFilePath = (fileId) => {
      return [...storageKeys.chatFiles, fileId];
    };
    static getFileContentName = (fileContent) => {
      return fileContent.creationDate + fileContent.id;
    };
    static getFileContentPath = (file, fileContentName) => {
      const filePath = _FileModel.getFilePath(file.id);
      return [...filePath, fileContentName];
    };
    static createFile = () => {
      return {
        dataVersion: DATA_VERSION,
        id: v4_default(),
        contentVersions: []
      };
    };
  };

  // src/Model/Utility/crypto.ts
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

  // src/ViewModel/colors.ts
  var Color = /* @__PURE__ */ ((Color2) => {
    Color2["Standard"] = "standard";
    Color2["Coral"] = "coral";
    Color2["Yellow"] = "yellow";
    Color2["Mint"] = "mint";
    Color2["LightBlue"] = "lightblue";
    Color2["Blue"] = "blue";
    Color2["purple"] = "purple";
    return Color2;
  })(Color || {});

  // src/Model/chatModel.ts
  var ChatModel = class _ChatModel {
    connectionModel;
    storageModel;
    settingsModel;
    chatListModel;
    fileModel;
    // data
    id;
    info;
    color;
    chatMessageHandler = () => {
    };
    // sorting
    get index() {
      return this.chatListModel.getIndexOfPrimaryChannel(
        this.info.primaryChannel
      );
    }
    // paths
    get infoPath() {
      return storageKeys.chatInfo(this.id);
    }
    get colorPath() {
      return storageKeys.chatColor(this.id);
    }
    get messageDirPath() {
      return storageKeys.chatMessages(this.id);
    }
    getMessagePath = (id) => {
      return [...this.messageDirPath, id];
    };
    // set
    setPrimaryChannel = (primaryChannel) => {
      this.info.primaryChannel = primaryChannel;
      this.storeInfo();
      this.chatListModel.updateIndices();
      this.subscribe();
    };
    setSecondaryChannels = (secondaryChannels) => {
      this.info.secondaryChannels = secondaryChannels;
      this.storeInfo();
    };
    setEncryptionKey = (key) => {
      this.info.encryptionKey = key;
      this.storeInfo();
    };
    setColor = (color) => {
      this.color = color;
      this.storeColor();
    };
    // store & add
    storeInfo = () => {
      this.storageModel.writeStringifiable(this.infoPath, this.info);
    };
    storeColor = () => {
      this.storageModel.write(this.colorPath, this.color);
    };
    addMessage = async (chatMessage) => {
      await this.decryptMessage(chatMessage);
      if (chatMessage.body != "") {
        const messagePath = this.getMessagePath(chatMessage.id);
        this.storageModel.writeStringifiable(messagePath, chatMessage);
        this.chatMessageHandler(chatMessage);
      }
      this.fileModel.handleStringifiedFile(chatMessage.stringifiedFile);
    };
    // delete
    delete = () => {
      this.chatListModel.untrackChat(this);
      const dirPath = [...storageKeys.chats, this.id];
      this.storageModel.removeRecursive(dirPath);
    };
    // load
    loadInfo = () => {
      const info = this.storageModel.readStringifiable(this.infoPath);
      if (info != null) {
        this.info = info;
      } else {
        this.info = _ChatModel.generateChatInfo("0");
      }
    };
    loadColor = () => {
      const path = this.colorPath;
      const color = this.storageModel.read(path);
      if (!color) {
        this.color = "standard" /* Standard */;
      } else {
        this.color = color;
      }
    };
    get messages() {
      const messageIds = this.storageModel.list(this.messageDirPath);
      if (!Array.isArray(messageIds)) return [];
      const messages = [];
      for (const messageId of messageIds) {
        const messagePath = this.getMessagePath(messageId);
        const message = this.storageModel.readStringifiable(messagePath);
        if (checkIsValidObject(message) == false) continue;
        messages.push(message);
      }
      const sorted = messages.sort(
        (a, b) => a.dateSent.localeCompare(b.dateSent)
      );
      return sorted;
    }
    // messaging
    sendMessage = async (body, file) => {
      const senderName = this.settingsModel.username;
      if (senderName == "") return false;
      const allChannels = [this.info.primaryChannel];
      for (const secondaryChannel of this.info.secondaryChannels) {
        allChannels.push(secondaryChannel);
      }
      const combinedChannel = allChannels.join("/");
      const chatMessage = await _ChatModel.createChatMessage(
        combinedChannel,
        senderName,
        this.info.encryptionKey,
        body,
        file
      );
      this.addMessage(chatMessage);
      this.connectionModel.sendMessageOrStore(chatMessage);
      return true;
    };
    handleMessage = (body) => {
      const chatMessage = parseValidObject(body);
      if (chatMessage == null) return;
      chatMessage.status = "received" /* Received */;
      this.addMessage(chatMessage);
    };
    handleMessageSent = (chatMessage) => {
      chatMessage.status = "sent" /* Sent */;
      this.addMessage(chatMessage);
    };
    decryptMessage = async (chatMessage) => {
      const decryptedBody = await decryptString(
        chatMessage.body,
        this.info.encryptionKey
      );
      const decryptedFile = await decryptString(
        chatMessage.stringifiedFile ?? "",
        this.info.encryptionKey
      );
      chatMessage.body = decryptedBody;
      chatMessage.stringifiedFile = decryptedFile;
    };
    setMessageHandler = (handler) => {
      this.chatMessageHandler = handler;
    };
    subscribe = () => {
      this.connectionModel.addChannel(this.info.primaryChannel);
    };
    // init
    constructor(storageModel2, connectionModel2, settingsModel2, chatListModel2, chatId) {
      this.id = chatId;
      this.connectionModel = connectionModel2;
      this.settingsModel = settingsModel2;
      this.storageModel = storageModel2;
      this.chatListModel = chatListModel2;
      this.loadInfo();
      this.loadColor();
      this.subscribe();
      connectionModel2.setMessageSentHandler(this.handleMessageSent);
      this.fileModel = new FileModel(this, this.storageModel);
    }
    // utility
    static generateChatInfo = (primaryChannel) => {
      return {
        dataVersion: DATA_VERSION,
        primaryChannel,
        secondaryChannels: [],
        encryptionKey: "",
        hasUnreadMessages: false
      };
    };
    static createChatMessage = async (channel, sender, encryptionKey, body, file) => {
      const chatMessage = {
        dataVersion: DATA_VERSION,
        id: v4_default(),
        channel,
        sender,
        body,
        dateSent: createTimestamp(),
        status: "outbox" /* Outbox */,
        stringifiedFile: ""
      };
      if (file != void 0) {
        const stringifiedFile = stringify(file);
        chatMessage.stringifiedFile = stringifiedFile;
      }
      if (encryptionKey != "") {
        chatMessage.body = await encryptString(chatMessage.body, encryptionKey);
        chatMessage.stringifiedFile = await encryptString(
          chatMessage.stringifiedFile,
          encryptionKey
        );
      }
      return chatMessage;
    };
  };

  // src/Model/chatListModel.ts
  var ChatListModel = class {
    storageModel;
    settingsModel;
    connectionModel;
    // data
    chatModels = /* @__PURE__ */ new Set();
    sortedPrimaryChannels = [];
    // handlers
    messageHandler = (data) => {
      for (const chatModel of this.chatModels) {
        const channel = data.messageChannel;
        const body = data.messageBody;
        if (channel == void 0) return;
        if (body == void 0) return;
        const allChannels = channel.split("/");
        for (const channel2 of allChannels) {
          if (channel2 != chatModel.info.primaryChannel) continue;
          chatModel.handleMessage(body);
          break;
        }
      }
    };
    // store & add
    addChatModel = (chatModel) => {
      this.chatModels.add(chatModel);
      this.updateIndices();
    };
    createChat = (primaryChannel) => {
      const id = v4_default();
      const chatModel = new ChatModel(
        this.storageModel,
        this.connectionModel,
        this.settingsModel,
        this,
        id
      );
      chatModel.setPrimaryChannel(primaryChannel);
      this.addChatModel(chatModel);
      return chatModel;
    };
    untrackChat = (chat) => {
      this.chatModels.delete(chat);
      this.updateIndices();
    };
    // sorting
    updateIndices = () => {
      this.sortedPrimaryChannels = [];
      let allChannels = [];
      for (const chatModel of this.chatModels) {
        allChannels.push(chatModel.info.primaryChannel);
      }
      this.sortedPrimaryChannels = allChannels.sort(localeCompare);
    };
    getIndexOfPrimaryChannel(primaryChannel) {
      return this.sortedPrimaryChannels.indexOf(primaryChannel);
    }
    // load
    loadChats = () => {
      const chatDir = storageKeys.chats;
      const chatIds = this.storageModel.list(chatDir);
      for (const chatId of chatIds) {
        const chatModel = new ChatModel(
          this.storageModel,
          this.connectionModel,
          this.settingsModel,
          this,
          chatId
        );
        this.addChatModel(chatModel);
      }
    };
    // init
    constructor(storageModel2, settingsModel2, connectionModel2) {
      this.storageModel = storageModel2;
      this.settingsModel = settingsModel2;
      this.connectionModel = connectionModel2;
      this.loadChats();
      connectionModel2.setMessageHandler(this.messageHandler);
    }
  };

  // src/Model/chatMessageViewModel.ts
  var ChatMessageViewModel = class {
    chatViewModel;
    // data
    chatMessage;
    channel;
    sender;
    dateSent;
    body = new State("");
    status = new State(void 0);
    sentByUser;
    // methods
    copyMessage = () => {
      navigator.clipboard.writeText(this.body.value);
    };
    resendMessage = () => {
      this.chatViewModel.sendMessageFromBody(this.body.value);
    };
    decryptMessage = () => {
      this.chatViewModel.decryptMessage(this);
    };
    // load
    loadData = () => {
      this.channel = this.chatMessage.channel;
      this.sender = this.chatMessage.sender;
      this.dateSent = new Date(this.chatMessage.dateSent).toLocaleString();
      this.body.value = this.chatMessage.body;
      this.status.value = this.chatMessage.status;
    };
    // init
    constructor(chatViewModel, chatMessage, sentByUser) {
      this.chatViewModel = chatViewModel;
      this.chatMessage = chatMessage;
      this.sentByUser = sentByUser;
      this.loadData();
    }
  };

  // src/ViewModel/chatViewModel.ts
  var ChatViewModel = class {
    chatModel;
    storageModel;
    settingsViewModel;
    chatListViewModel;
    // state
    index = new State(0);
    primaryChannel = new State("");
    primaryChannelInput = new State("");
    secondaryChannels = new ListState();
    newSecondaryChannelInput = new State("");
    encryptionKeyInput = new State("");
    shouldShowEncryptionKey = new State(false);
    encryptionKeyInputType = createProxyState(
      [this.shouldShowEncryptionKey],
      () => this.shouldShowEncryptionKey.value == true ? "text" : "password"
    );
    color = new State("standard" /* Standard */);
    selectedPage = new State(
      "messages" /* Messages */
    );
    chatMessageViewModels = new MapState();
    composingMessage = new State("");
    // guards
    cannotSetPrimaryChannel = createProxyState(
      [this.primaryChannel, this.primaryChannelInput],
      () => this.primaryChannelInput.value == "" || this.primaryChannelInput.value == this.primaryChannel.value
    );
    cannotAddSecondaryChannel = createProxyState(
      [this.newSecondaryChannelInput],
      () => this.newSecondaryChannelInput.value == ""
    );
    cannotSetEncryptionKey;
    cannotSendMessage;
    // sorting
    updateIndex = () => {
      this.index.value = this.chatModel.index;
    };
    // view
    open = () => {
      this.chatListViewModel.openChat(this);
      this.loadMessages();
    };
    close = () => {
      this.chatListViewModel.closeChat();
    };
    // add
    addChatMessage = (chatMessage) => {
      const chatMessageModel = new ChatMessageViewModel(
        this,
        chatMessage,
        chatMessage.sender == this.settingsViewModel.username.value
      );
      const existingChatMessageViewModel = this.chatMessageViewModels.value.get(chatMessage.id);
      if (existingChatMessageViewModel != void 0) {
        existingChatMessageViewModel.body.value = chatMessage.body;
        existingChatMessageViewModel.status.value = chatMessage.status;
      } else {
        this.chatMessageViewModels.set(chatMessage.id, chatMessageModel);
      }
    };
    // settings
    setPrimaryChannel = () => {
      this.chatModel.setPrimaryChannel(this.primaryChannelInput.value);
      this.primaryChannel.value = this.chatModel.info.primaryChannel;
      this.chatListViewModel.updateIndices();
    };
    addSecondaryChannel = () => {
      this.secondaryChannels.add(this.newSecondaryChannelInput.value);
      this.newSecondaryChannelInput.value = "";
      this.storeSecondaryChannels();
      this.loadSecondaryChannels();
    };
    removeSecondaryChannel = (secondaryChannel) => {
      this.secondaryChannels.remove(secondaryChannel);
      this.storeSecondaryChannels();
    };
    storeSecondaryChannels = () => {
      this.chatModel.setSecondaryChannels([
        ...this.secondaryChannels.value.values()
      ]);
    };
    setEncryptionKey = () => {
      this.chatModel.setEncryptionKey(this.encryptionKeyInput.value);
      this.encryptionKeyInput.callSubscriptions();
    };
    setColor = (newColor) => {
      this.color.value = newColor;
      this.chatModel.setColor(newColor);
    };
    remove = () => {
      this.close();
      this.chatModel.delete();
      this.chatListViewModel.loadChats();
    };
    // messaging
    sendMessage = () => {
      if (this.cannotSendMessage.value == true) return;
      this.sendMessageFromBody(this.composingMessage.value);
      this.composingMessage.value = "";
    };
    sendMessageFromBody = (body) => {
      this.chatModel.sendMessage(body);
    };
    decryptMessage = async (messageViewModel) => {
      const chatMessage = messageViewModel.chatMessage;
      await this.chatModel.decryptMessage(chatMessage);
      this.chatModel.addMessage(chatMessage);
      messageViewModel.loadData();
    };
    // load
    loadPageSelection = () => {
      const path = storageKeys.chatLastUsedPage(this.chatModel.id);
      const lastUsedPage = this.storageModel.read(path);
      if (lastUsedPage != null) {
        this.selectedPage.value = lastUsedPage;
      }
      this.selectedPage.subscribeSilent((newPage) => {
        this.storageModel.write(path, newPage);
      });
    };
    loadSecondaryChannels = () => {
      this.secondaryChannels.clear();
      for (const secondaryChannel of this.chatModel.info.secondaryChannels.sort(
        localeCompare
      )) {
        this.secondaryChannels.add(secondaryChannel);
      }
    };
    loadMessages = () => {
      for (const chatMessage of this.chatModel.messages) {
        this.addChatMessage(chatMessage);
      }
    };
    // init
    constructor(chatModel, storageModel2, settingsViewModel2, chatListViewModel2) {
      this.chatModel = chatModel;
      this.storageModel = storageModel2;
      this.settingsViewModel = settingsViewModel2;
      this.chatListViewModel = chatListViewModel2;
      chatModel.setMessageHandler((chatMessage) => {
        this.addChatMessage(chatMessage);
      });
      this.primaryChannel.value = chatModel.info.primaryChannel;
      this.primaryChannelInput.value = chatModel.info.primaryChannel;
      this.encryptionKeyInput.value = chatModel.info.encryptionKey;
      this.cannotSetEncryptionKey = createProxyState(
        [this.encryptionKeyInput],
        () => this.encryptionKeyInput.value == this.chatModel.info.encryptionKey
      );
      this.color.value = chatModel.color;
      this.loadSecondaryChannels();
      this.loadPageSelection();
      this.updateIndex();
      this.cannotSendMessage = createProxyState(
        [this.settingsViewModel.username, this.composingMessage],
        () => this.settingsViewModel.username.value == "" || this.composingMessage.value == ""
      );
    }
  };

  // src/ViewModel/chatListViewModel.ts
  var ChatListViewModel = class {
    chatListModel;
    storageModel;
    settingsViewModel;
    // state
    newChatPrimaryChannel = new State("");
    chatViewModels = new ListState();
    selectedChat = new State(void 0);
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
      const chatViewModel = this.createChatViewModel(chatModel);
      this.chatViewModels.add(chatViewModel);
      this.updateIndices();
    };
    untrackChat = (chatViewModel) => {
      this.chatListModel.untrackChat(chatViewModel.chatModel);
      this.chatViewModels.remove(chatViewModel);
    };
    createChatViewModel = (chatModel) => {
      return new ChatViewModel(
        chatModel,
        this.storageModel,
        this.settingsViewModel,
        this
      );
    };
    // view
    openChat = (chatViewModel) => {
      this.selectedChat.value = chatViewModel;
    };
    closeChat = () => {
      this.selectedChat.value = void 0;
    };
    // sorting
    updateIndices = () => {
      for (const chatViewModel of this.chatViewModels.value) {
        chatViewModel.updateIndex();
      }
    };
    // load
    loadChats = () => {
      this.chatViewModels.clear();
      for (const chatModel of this.chatListModel.chatModels.values()) {
        const chatViewModel = this.createChatViewModel(chatModel);
        this.chatViewModels.add(chatViewModel);
      }
    };
    // init
    constructor(chatListModel2, storageModel2, settingsViewModel2) {
      this.chatListModel = chatListModel2;
      this.storageModel = storageModel2;
      this.settingsViewModel = settingsViewModel2;
      this.loadChats();
    }
  };

  // src/View/Components/chatViewToggleButton.tsx
  function ChatViewToggleButton(label, icon, page, chatViewModel) {
    function select() {
      chatViewModel.selectedPage.value = page;
    }
    const isSelected = createProxyState(
      [chatViewModel.selectedPage],
      () => chatViewModel.selectedPage.value == page
    );
    return /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": label,
        "toggle:selected": isSelected,
        "on:click": select
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, icon)
    );
  }

  // src/View/translations.ts
  var englishTranslations = {
    general: {
      closeButton: "Close",
      deleteItemButtonAudioLabel: "delete item",
      abortButton: "Abort",
      confirmButton: "Confirm",
      setButton: "Set"
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
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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
      yourNameLabel: "Your name",
      yourNamePlaceholder: "Jane Doe",
      setNameButtonAudioLabel: "set name",
      firstDayOfWeekLabel: "First day of week",
      manageStorageButton: "Manage storage",
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
    },
    storage: {
      noItemSelected: "No item selected",
      notAFile: "(not a file)",
      contentEmpty: "(empty)",
      path: "Path",
      content: "Content",
      deleteItem: "Delete item"
    },
    chatPage: {
      closeChatAudioLabe: "close chat",
      chatSettingsAudioLabel: "chat settings",
      pages: {
        settings: "Settings",
        messages: "Messages",
        allObjects: "All objects",
        kanban: "Kanban",
        calendar: "Calendar",
        progress: "Progress"
      },
      settings: {
        settingsHeadline: "Settings",
        primaryChannelLabel: "Primary channel",
        setPrimaryChannelButtonAudioLabel: "set primary channel",
        newSecondaryChannelPlaceholder: "Add secondary channel",
        newSecondaryChannelAudioLabel: "name of new secondary channel",
        addSecondaryChannelButtonAudioLabel: "add secondary channel",
        encryptionKeyLabel: "Encryption key",
        setEncryptionKeyButtonAudioLabel: "set encryption key",
        showEncryptionKey: "Show encryption key",
        deleteChatButton: "Delete entire chat"
      },
      message: {
        composerInputPlaceholder: "Type a message...",
        sendMessageButtonAudioLabel: "send message",
        showMessageInfoButtonAudioLabel: "show message info",
        messageInfoHeadline: "Message Info",
        sentBy: "Sent by",
        timeSent: "Time sent",
        channel: "Channel",
        messageContent: "Message content",
        copyMessageButton: "Copy message",
        resendMessageButton: "Resend message",
        decryptMessageButton: "Decrypt message",
        deleteMessageButton: "Delete message"
      }
    }
  };
  var allTranslations = {
    en: englishTranslations
  };
  var language = navigator.language.substring(0, 2);
  var translations = allTranslations[language] || allTranslations.en;

  // src/View/Components/chatMessageInfoModal.tsx
  function ChatMessageInfoModal(chatMessageViewModel, isOpen) {
    function closeModal() {
      isOpen.value = false;
    }
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isOpen }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translations.chatPage.message.messageInfoHeadline), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.sentBy), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.sender))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "schedule"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.timeSent), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.dateSent))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.channel), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.channel))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "description"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.messageContent), /* @__PURE__ */ createElement(
      "b",
      {
        class: "break-word",
        "subscribe:innerText": chatMessageViewModel.body
      }
    )))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.copyMessage }, translations.chatPage.message.copyMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "content_copy")), /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.resendMessage }, translations.chatPage.message.resendMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "redo")), /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.decryptMessage }, translations.chatPage.message.decryptMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "key")))), /* @__PURE__ */ createElement(
      "button",
      {
        "on:click": closeModal,
        "aria-label": translations.general.closeButton
      },
      translations.general.closeButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "close")
    )));
  }

  // src/View/Components/chatMessage.tsx
  function ChatMessage(chatMessageViewModel) {
    const isInfoModalOpen = new State(false);
    function openModal() {
      isInfoModalOpen.value = true;
    }
    const statusIcon = createProxyState(
      [chatMessageViewModel.status],
      () => {
        switch (chatMessageViewModel.status.value) {
          case "outbox" /* Outbox */:
            return "hourglass_top";
          case "sent" /* Sent */:
            return "check";
          case "received" /* Received */:
            return "done_all";
          default:
            return "warning";
        }
      }
    );
    return /* @__PURE__ */ createElement(
      "div",
      {
        class: "message-bubble",
        "toggle:sentbyuser": chatMessageViewModel.sentByUser
      },
      /* @__PURE__ */ createElement("div", { class: "main tile" }, /* @__PURE__ */ createElement("div", { class: "text-container" }, /* @__PURE__ */ createElement("span", { class: "sender-name ellipsis" }, chatMessageViewModel.sender), /* @__PURE__ */ createElement(
        "span",
        {
          class: "body",
          "subscribe:innerText": chatMessageViewModel.body
        }
      ), /* @__PURE__ */ createElement("span", { class: "timestamp ellipsis" }, /* @__PURE__ */ createElement("span", { class: "icon", "subscribe:innerText": statusIcon }), chatMessageViewModel.dateSent)), /* @__PURE__ */ createElement("div", { class: "button-container" }, /* @__PURE__ */ createElement(
        "button",
        {
          "on:click": openModal,
          "aria-label": translations.chatPage.message.showMessageInfoButtonAudioLabel
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "info")
      ))),
      ChatMessageInfoModal(chatMessageViewModel, isInfoModalOpen)
    );
  }
  var ChatMessageViewModelToView = (chatMessageViewModel) => {
    return ChatMessage(chatMessageViewModel);
  };

  // src/View/ChatPages/messagePage.tsx
  function MessagePage(chatViewModel) {
    const messageContainer = /* @__PURE__ */ createElement(
      "div",
      {
        id: "message-container",
        "children:append": [
          chatViewModel.chatMessageViewModels,
          ChatMessageViewModelToView
        ]
      }
    );
    function scrollDown() {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    function scrollDownIfApplicable() {
      const scrollFromBottom = messageContainer.scrollHeight - (messageContainer.scrollTop + messageContainer.offsetHeight);
      if (scrollFromBottom > 400) return;
      scrollDown();
    }
    chatViewModel.chatMessageViewModels.subscribeSilent(scrollDownIfApplicable);
    setTimeout(() => scrollDown(), 100);
    return /* @__PURE__ */ createElement("div", { id: "message-page" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", { "subscribe:innerText": chatViewModel.primaryChannel })), /* @__PURE__ */ createElement("div", { class: "content" }, messageContainer, /* @__PURE__ */ createElement("div", { id: "composer" }, /* @__PURE__ */ createElement("div", { class: "content-width-constraint" }, /* @__PURE__ */ createElement("div", { class: "input-width-constraint" }, /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": chatViewModel.composingMessage,
        "on:enter": chatViewModel.sendMessage,
        placeholder: translations.chatPage.message.composerInputPlaceholder
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.chatPage.message.sendMessageButtonAudioLabel,
        "on:click": chatViewModel.sendMessage,
        "toggle:disabled": chatViewModel.cannotSendMessage
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "send")
    ))))));
  }

  // src/View/Components/dangerousActionButton.tsx
  function DangerousActionButton(label, icon, action) {
    const isActionRequested = new State(false);
    const cannotConfirm = createProxyState(
      [isActionRequested],
      () => isActionRequested.value == false
    );
    function requestAction() {
      isActionRequested.value = true;
    }
    function abort() {
      isActionRequested.value = false;
    }
    return /* @__PURE__ */ createElement("div", { class: "flex-row" }, /* @__PURE__ */ createElement("button", { class: "flex", "on:click": abort, "toggle:hidden": cannotConfirm }, translations.general.abortButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "undo")), /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger flex",
        "on:click": requestAction,
        "toggle:hidden": isActionRequested
      },
      label,
      /* @__PURE__ */ createElement("span", { class: "icon" }, icon)
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger flex",
        "on:click": action,
        "toggle:hidden": cannotConfirm
      },
      translations.general.confirmButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "warning")
    ));
  }

  // src/View/Components/deletableListItem.tsx
  function DeletableListItem(text, primaryButton, ondelete) {
    return /* @__PURE__ */ createElement("div", { class: "tile flex-row justify-apart align-center padding-0" }, /* @__PURE__ */ createElement("span", { class: "padding-h ellipsis" }, text), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, primaryButton, /* @__PURE__ */ createElement(
      "button",
      {
        class: "danger",
        "aria-label": translations.general.deleteItemButtonAudioLabel,
        "on:click": ondelete
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "delete")
    )));
  }

  // src/View/ChatPages/settingsPage.tsx
  function SettingsPage(chatViewModel) {
    const secondaryChannelConverter = (secondaryChannel) => {
      return DeletableListItem(secondaryChannel, /* @__PURE__ */ createElement("span", null), () => {
        chatViewModel.removeSecondaryChannel(secondaryChannel);
      });
    };
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", null, translations.chatPage.settings.settingsHeadline)), /* @__PURE__ */ createElement("div", { class: "content" }, /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.settings.primaryChannelLabel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": chatViewModel.primaryChannelInput,
        "on:enter": chatViewModel.setPrimaryChannel
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "aria-label": translations.chatPage.settings.setPrimaryChannelButtonAudioLabel,
        "on:click": chatViewModel.setPrimaryChannel,
        "toggle:disabled": chatViewModel.cannotSetPrimaryChannel
      },
      translations.general.setButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row width-input margin-bottom" }, /* @__PURE__ */ createElement(
      "input",
      {
        "aria-label": translations.chatPage.settings.newSecondaryChannelAudioLabel,
        placeholder: translations.chatPage.settings.newSecondaryChannelPlaceholder,
        "bind:value": chatViewModel.newSecondaryChannelInput,
        "on:enter": chatViewModel.addSecondaryChannel
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.chatPage.settings.addSecondaryChannelButtonAudioLabel,
        "on:click": chatViewModel.addSecondaryChannel,
        "toggle:disabled": chatViewModel.cannotAddSecondaryChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap width-input",
        "children:append": [
          chatViewModel.secondaryChannels,
          secondaryChannelConverter
        ]
      }
    ), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "key"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.settings.encryptionKeyLabel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": chatViewModel.encryptionKeyInput,
        "on:enter": chatViewModel.setEncryptionKey,
        "set:type": chatViewModel.encryptionKeyInputType
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "aria-label": translations.chatPage.settings.setEncryptionKeyButtonAudioLabel,
        "on:click": chatViewModel.setEncryptionKey,
        "toggle:disabled": chatViewModel.cannotSetEncryptionKey
      },
      translations.general.setButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("label", { class: "inline" }, /* @__PURE__ */ createElement(
      "input",
      {
        type: "checkbox",
        "bind:checked": chatViewModel.shouldShowEncryptionKey
      }
    ), translations.chatPage.settings.showEncryptionKey), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row gap width-input" }, ...Object.values(Color).map((color) => {
      const isSelected = createProxyState(
        [chatViewModel.color],
        () => chatViewModel.color.value == color
      );
      function setColor() {
        chatViewModel.setColor(color);
      }
      return /* @__PURE__ */ createElement(
        "button",
        {
          color,
          class: "fill-color width-100 flex",
          style: "height: 2rem",
          "toggle:selected": isSelected,
          "on:click": setColor
        }
      );
    })), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "width-input" }, DangerousActionButton(
      translations.chatPage.settings.deleteChatButton,
      "chat_error",
      chatViewModel.remove
    ))));
  }

  // src/View/chatPage.tsx
  function ChatPage(chatViewModel) {
    const mainContent = new State(/* @__PURE__ */ createElement("div", null));
    chatViewModel.selectedPage.subscribe((selectedPage) => {
      switch (selectedPage) {
        case "settings" /* Settings */:
          return mainContent.value = SettingsPage(chatViewModel);
        default:
          return mainContent.value = MessagePage(chatViewModel);
      }
    });
    return /* @__PURE__ */ createElement("article", { id: "chat-page", "set:color": chatViewModel.color, class: "subtle-background" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("div", { id: "ribbon" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.closeChatAudioLabe,
        "on:click": chatViewModel.close
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "close")
    ), /* @__PURE__ */ createElement("span", null, ChatViewToggleButton(
      translations.chatPage.pages.calendar,
      "calendar_month",
      "calendar" /* Calendar */,
      chatViewModel
    ), ChatViewToggleButton(
      translations.chatPage.pages.progress,
      "window",
      "progress" /* Progress */,
      chatViewModel
    ), ChatViewToggleButton(
      translations.chatPage.pages.kanban,
      "view_kanban",
      "kanban" /* Kanban */,
      chatViewModel
    ), ChatViewToggleButton(
      translations.chatPage.pages.allObjects,
      "deployed_code",
      "all" /* AllObjects */,
      chatViewModel
    ), ChatViewToggleButton(
      translations.chatPage.pages.messages,
      "forum",
      "messages" /* Messages */,
      chatViewModel
    ), ChatViewToggleButton(
      translations.chatPage.pages.settings,
      "settings",
      "settings" /* Settings */,
      chatViewModel
    ))), /* @__PURE__ */ createElement("div", { id: "main", "children:set": mainContent })));
  }

  // src/View/chatPageWrapper.tsx
  function ChatPageWrapper(chatListViewModel2) {
    const chatPageContent = createProxyState(
      [chatListViewModel2.selectedChat],
      () => {
        if (chatListViewModel2.selectedChat.value == void 0) {
          return /* @__PURE__ */ createElement("div", null);
        } else {
          return ChatPage(chatListViewModel2.selectedChat.value);
        }
      }
    );
    return /* @__PURE__ */ createElement(
      "div",
      {
        id: "chat-page-wrapper",
        "children:set": chatPageContent
      }
    );
  }

  // src/View/Modals/connectionModal.tsx
  function ConnectionModal(connectionViewModel2) {
    const previousAddressConverter = (address) => {
      function connnect() {
        connectionViewModel2.connectToAddress(address);
      }
      const cannotConnect = createProxyState(
        [connectionViewModel2.isConnected],
        () => connectionViewModel2.isConnected.value == true && connectionViewModel2.connectionModel.address == address
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
      )), /* @__PURE__ */ createElement("button", { "on:click": connectionViewModel2.hideConnectionModal }, translations.general.closeButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "close")))
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
      if (this.ws.readyState != 1) return false;
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
    connectionChangeHandler = () => {
    };
    messageHandler = () => {
    };
    messageSentHandler = () => {
    };
    channelsToSubscribe = /* @__PURE__ */ new Set();
    // connection
    connect = (address) => {
      this.udn.connect(address);
    };
    disconnect = () => {
      this.udn.disconnect();
      const reconnectAddressPath = storageKeys.reconnectAddress;
      this.storageModel.remove(reconnectAddressPath);
    };
    handleMessage = (data) => {
      this.messageHandler(data);
    };
    handleConnectionChange = () => {
      console.log("connection status:", this.isConnected, this.address);
      this.connectionChangeHandler();
      if (this.isConnected == false) return;
      if (!this.address) return;
      this.connectMailbox();
      this.storeAddress(this.address);
      this.sendSubscriptionRequest();
      this.sendMessagesInOutbox();
    };
    // mailbox
    requestNewMailbox = () => {
      console.trace("requesting mailbox");
      this.udn.requestMailbox();
    };
    connectMailbox = () => {
      if (this.address == void 0) return;
      const path = [...storageKeys.mailboxes, this.address];
      const mailboxId = this.storageModel.read(path);
      console.log("connecting mailbox", mailboxId);
      if (mailboxId == null) return this.requestNewMailbox();
      this.udn.connectMailbox(mailboxId);
    };
    storeMailbox = (mailboxId) => {
      if (this.address == void 0) return;
      const path = [...storageKeys.mailboxes, this.address];
      this.storageModel.write(path, mailboxId);
    };
    // subscription
    addChannel = (channel) => {
      this.channelsToSubscribe.add(channel);
      this.sendSubscriptionRequest();
    };
    sendSubscriptionRequest = () => {
      if (this.isConnected == false) return;
      for (const channel of this.channelsToSubscribe) {
        this.udn.subscribe(channel);
      }
      this.connectMailbox();
    };
    // outbox
    getOutboxMessags = () => {
      const outboxPath = storageKeys.outbox;
      const messageIds = this.storageModel.list(outboxPath);
      let messages = [];
      for (const messageId of messageIds) {
        const message = this.storageModel.readStringifiable([
          ...outboxPath,
          messageId
        ]);
        if (message == void 0) continue;
        if (checkIsValidObject(message) == false) continue;
        messages.push(message);
      }
      return messages;
    };
    addToOutbox = (chatMessage) => {
      const messagePath = [...storageKeys.outbox, chatMessage.id];
      this.storageModel.writeStringifiable(messagePath, chatMessage);
    };
    removeFromOutbox = (chatMessage) => {
      const messagePath = [...storageKeys.outbox, chatMessage.id];
      this.storageModel.remove(messagePath);
    };
    sendMessagesInOutbox = () => {
      const messages = this.getOutboxMessags();
      for (const message of messages) {
        const isSent = this.tryToSendMessage(message);
        if (isSent == false) return;
        this.removeFromOutbox(message);
      }
    };
    // messaging
    sendMessageOrStore = (chatMessage) => {
      const isSent = this.tryToSendMessage(chatMessage);
      if (isSent == true) return;
      this.addToOutbox(chatMessage);
    };
    tryToSendMessage = (chatMessage) => {
      const stringifiedBody = stringify(chatMessage);
      const isSent = this.udn.sendMessage(
        chatMessage.channel,
        stringifiedBody
      );
      if (isSent) this.messageSentHandler(chatMessage);
      return isSent;
    };
    // storage
    getAddressPath = (address) => {
      const dirPath = storageKeys.previousAddresses;
      return [...dirPath, address];
    };
    storeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.write(addressPath, "");
      const reconnectAddressPath = storageKeys.reconnectAddress;
      this.storageModel.write(reconnectAddressPath, address);
    };
    removeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.remove(addressPath);
    };
    get addresses() {
      const dirPath = storageKeys.previousAddresses;
      return this.storageModel.list(dirPath);
    }
    // handlers
    setConnectionChangeHandler = (handler) => {
      this.connectionChangeHandler = handler;
    };
    setMessageHandler = (handler) => {
      this.messageHandler = handler;
    };
    setMessageSentHandler = (handler) => {
      this.messageSentHandler = handler;
    };
    // setup
    constructor(storageModel2) {
      this.udn = new UDNFrontend();
      this.storageModel = storageModel2;
      this.udn.onmessage = (data) => {
        this.handleMessage(data);
      };
      this.udn.onconnect = () => {
        this.handleConnectionChange();
      };
      this.udn.ondisconnect = () => {
        this.handleConnectionChange();
      };
      this.udn.onmailboxcreate = (mailboxId) => {
        console.log("created mailbox", mailboxId);
        this.storeMailbox(mailboxId);
        this.connectMailbox();
      };
      this.udn.onmailboxdelete = (mailboxId) => {
        console.log(`mailbox ${mailboxId} deleted`);
        this.requestNewMailbox();
      };
      this.udn.onmailboxconnect = (mailboxId) => {
        console.log(`using mailbox ${mailboxId}`);
      };
      const reconnectAddressPath = storageKeys.reconnectAddress;
      const reconnectAddress = storageModel2.read(reconnectAddressPath);
      if (reconnectAddress != null) {
        this.connect(reconnectAddress);
      }
    }
  };

  // src/ViewModel/connectionViewModel.ts
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
      if (this.connectionModel.address == void 0) return;
      this.serverAddressInput.value = this.connectionModel.address;
      if (!this.previousAddresses.value.has(this.connectionModel.address)) {
        this.previousAddresses.add(this.connectionModel.address);
      }
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
    constructor(connectionModel2) {
      this.connectionModel = connectionModel2;
      this.updatePreviousAddresses();
      connectionModel2.setConnectionChangeHandler(this.connectionChangeHandler);
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
  function ChatEntry(chatViewModel) {
    const view = /* @__PURE__ */ createElement("button", { "set:color": chatViewModel.color, class: "chat-entry tile", "on:click": chatViewModel.open }, /* @__PURE__ */ createElement(
      "span",
      {
        class: "shadow",
        "subscribe:innerText": chatViewModel.primaryChannel
      }
    ), /* @__PURE__ */ createElement("h2", { "subscribe:innerText": chatViewModel.primaryChannel }));
    chatViewModel.index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });
    return view;
  }
  var ChatViewModelToChatEntry = (chatViewModel) => {
    return ChatEntry(chatViewModel);
  };

  // src/View/homePage.tsx
  function HomePage(storageViewModel2, settingsViewModel2, connectionViewModel2, chatListViewModel2) {
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
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.yourNameLabel), /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translations.homePage.yourNamePlaceholder,
        "bind:value": settingsViewModel2.usernameInput,
        "on:enter": settingsViewModel2.setName
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "on:click": settingsViewModel2.setName,
        "toggle:disabled": settingsViewModel2.cannotSetName,
        "aria-label": translations.homePage.setNameButtonAudioLabel
      },
      translations.general.setButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "calendar_month"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.firstDayOfWeekLabel), /* @__PURE__ */ createElement("select", { "bind:value": settingsViewModel2.firstDayOfWeekInput }, ...translations.regional.weekdays.full.map(
      (weekdayName, i) => Option(
        weekdayName,
        i.toString(),
        i == settingsViewModel2.firstDayOfWeekInput.value
      )
    )), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_drop_down"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("button", { class: "tile flex-no", "on:click": storageViewModel2.showStorageModal }, /* @__PURE__ */ createElement("span", { class: "icon" }, "hard_drive_2"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.homePage.manageStorageButton))), /* @__PURE__ */ createElement("div", { class: "mobile-only" }, /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end" }, /* @__PURE__ */ createElement("button", { class: "ghost width-50", "on:click": scrollToChat }, translations.homePage.scrollToChatButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")))));
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
        "children:append": [
          chatListViewModel2.chatViewModels,
          ChatViewModelToChatEntry
        ]
      }
    ));
    function scrollToChat() {
      chatSection.scrollIntoView();
    }
    return /* @__PURE__ */ createElement("article", { id: "home-page" }, /* @__PURE__ */ createElement("div", null, overviewSection, chatSection));
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
      this.storageModel.write(path, newValue);
    }
    setFirstDayOfWeek(newValue) {
      this.firstDayOfWeek = newValue;
      const path = storageKeys.firstDayOfWeek;
      this.storageModel.writeStringifiable(path, newValue);
    }
    // load
    loadUsernam() {
      const path = storageKeys.username;
      const content = this.storageModel.read(path);
      this.username = content ?? "";
    }
    loadFirstDayofWeek() {
      const path = storageKeys.firstDayOfWeek;
      const content = this.storageModel.readStringifiable(path);
      this.firstDayOfWeek = content ?? 0;
    }
    // init
    constructor(storageModel2) {
      this.storageModel = storageModel2;
      this.loadUsernam();
      this.loadFirstDayofWeek();
    }
  };

  // src/ViewModel/settingsViewModel.ts
  var SettingsViewModel = class {
    settingsModel;
    // state
    username = new State("");
    usernameInput = new State("");
    firstDayOfWeekInput = new State(0);
    // guards
    cannotSetName = createProxyState(
      [this.usernameInput],
      () => this.usernameInput.value == "" || this.usernameInput.value == this.settingsModel.username
    );
    // set
    setName = () => {
      this.settingsModel.setName(this.usernameInput.value);
      this.username.value = this.settingsModel.username;
      this.usernameInput.callSubscriptions();
    };
    setFirstDayofWeek = () => {
      this.settingsModel.setFirstDayOfWeek(this.firstDayOfWeekInput.value);
    };
    // init
    constructor(settingsModel2) {
      this.settingsModel = settingsModel2;
      this.username.value = settingsModel2.username;
      this.usernameInput.value = settingsModel2.username;
      this.firstDayOfWeekInput.value = settingsModel2.firstDayOfWeek;
      this.firstDayOfWeekInput.subscribe(this.setFirstDayofWeek);
    }
  };

  // src/View/Components/directoryItemList.tsx
  function DirectoryItemList(storageViewModel2, pathString = PATH_COMPONENT_SEPARATOR) {
    const StringToDirectoryItemList = (pathString2) => DirectoryItemList(storageViewModel2, pathString2);
    const path = StorageModel.stringToPathComponents(pathString);
    const fileName = StorageModel.getFileName(path);
    const items = new ListState();
    const style = `text-indent: ${path.length * 2}rem`;
    function loadItems() {
      items.clear();
      const directoryItems = storageViewModel2.storageModel.list(path);
      for (const directoryItem of directoryItems) {
        const itemPath = [...path, directoryItem];
        const pathString2 = StorageModel.pathComponentsToString(...itemPath);
        items.add(pathString2);
      }
    }
    function select() {
      storageViewModel2.selectedPath.value = pathString;
    }
    storageViewModel2.lastDeletedItemPath.subscribe((lastDeletedItemPath) => {
      if (!items.value.has(lastDeletedItemPath)) return;
      select();
      setTimeout(() => loadItems(), 50);
    });
    const isSelected = createProxyState(
      [storageViewModel2.selectedPath],
      () => storageViewModel2.selectedPath.value == pathString
    );
    isSelected.subscribe(() => {
      if (isSelected.value == false) return;
      loadItems();
    });
    return /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-100 flex-1 clip",
        "toggle:selected": isSelected,
        "on:click": select
      },
      /* @__PURE__ */ createElement("span", { class: "ellipsis width-100 flex-1", style }, fileName)
    ), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column",
        "children:append": [items, StringToDirectoryItemList]
      }
    ));
  }

  // src/View/Components/fileBrowser.tsx
  function FileBrowser(storageViewModel2) {
    const detailView = createProxyState(
      [storageViewModel2.selectedPath],
      () => {
        if (storageViewModel2.selectedPath.value == PATH_COMPONENT_SEPARATOR)
          return /* @__PURE__ */ createElement("span", { class: "secondary" }, translations.storage.noItemSelected);
        return /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("div", { class: "tile flex-no" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translations.storage.path), /* @__PURE__ */ createElement(
          "span",
          {
            class: "break-all",
            "subscribe:innerText": storageViewModel2.selectedPath
          }
        ))), /* @__PURE__ */ createElement("div", { class: "tile flex-no" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translations.storage.content), /* @__PURE__ */ createElement(
          "code",
          {
            "subscribe:innerText": storageViewModel2.selectedFileContent
          }
        ))), DangerousActionButton(
          translations.storage.deleteItem,
          "delete_forever",
          storageViewModel2.deleteSelectedItem
        ));
      }
    );
    const view = /* @__PURE__ */ createElement("div", { class: "file-browser" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("div", { class: "scroll-area" }, DirectoryItemList(storageViewModel2)), /* @__PURE__ */ createElement("div", { class: "detail-button-wrapper" }, /* @__PURE__ */ createElement("button", { class: "ghost", "on:click": scrollToDetails }, /* @__PURE__ */ createElement(
      "span",
      {
        class: "ellipsis",
        "subscribe:innerText": storageViewModel2.selectedFileName
      }
    ), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")))), /* @__PURE__ */ createElement("div", { class: "scroll-area", "children:set": detailView }));
    function scrollToDetails() {
      view.scrollLeft = view.scrollWidth;
    }
    return view;
  }

  // src/View/Modals/storageModal.tsx
  function StorageModal(storageViewModel2) {
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": storageViewModel2.isShowingStorageModal }, /* @__PURE__ */ createElement("div", { style: "max-width: 64rem" }, /* @__PURE__ */ createElement("main", { class: "padding-0" }, FileBrowser(storageViewModel2)), /* @__PURE__ */ createElement("button", { "on:click": storageViewModel2.hideStorageModal }, translations.general.closeButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/ViewModel/storageViewModel.ts
  var StorageViewModel = class {
    storageModel;
    // state
    isShowingStorageModal = new State(false);
    selectedPath = new State(PATH_COMPONENT_SEPARATOR);
    didMakeChanges = new State(false);
    selectedFileName;
    selectedFileContent;
    lastDeletedItemPath = new State("");
    // methods
    getSelectedItemContent = () => {
      const path = StorageModel.stringToPathComponents(this.selectedPath.value);
      const content = this.storageModel.read(path);
      return (content ?? translations.storage.notAFile) || translations.storage.contentEmpty;
    };
    deleteSelectedItem = () => {
      const path = StorageModel.stringToPathComponents(this.selectedPath.value);
      this.lastDeletedItemPath.value = this.selectedPath.value;
      this.storageModel.removeRecursive(path);
      this.didMakeChanges.value = true;
    };
    // view methods
    showStorageModal = () => {
      this.isShowingStorageModal.value = true;
    };
    hideStorageModal = () => {
      if (this.didMakeChanges.value == true) {
        window.location.reload();
        return;
      }
      this.isShowingStorageModal.value = false;
    };
    // init
    constructor(storageModel2) {
      this.storageModel = storageModel2;
      this.selectedFileName = createProxyState(
        [this.selectedPath],
        () => StorageModel.getFileNameFromString(this.selectedPath.value)
      );
      this.selectedFileContent = createProxyState(
        [this.selectedPath],
        () => this.getSelectedItemContent()
      );
    }
  };

  // src/index.tsx
  var storageModel = new StorageModel();
  var settingsModel = new SettingsModel(storageModel);
  var connectionModel = new ConnectionModel(storageModel);
  var chatListModel = new ChatListModel(
    storageModel,
    settingsModel,
    connectionModel
  );
  var storageViewModel = new StorageViewModel(storageModel);
  var settingsViewModel = new SettingsViewModel(settingsModel);
  var connectionViewModel = new ConnectionViewModel(connectionModel);
  var chatListViewModel = new ChatListViewModel(
    chatListModel,
    storageModel,
    settingsViewModel
  );
  chatListViewModel.selectedChat.subscribe(() => {
    document.body.toggleAttribute(
      "showing-chat",
      chatListViewModel.selectedChat.value != void 0
    );
  });
  document.body.append(
    /* @__PURE__ */ createElement("div", { id: "background-wrapper" }, /* @__PURE__ */ createElement("div", { id: "sky" }), /* @__PURE__ */ createElement("div", { id: "grass-1" }), /* @__PURE__ */ createElement("div", { id: "grass-2" }))
  );
  document.querySelector("main").append(
    HomePage(
      storageViewModel,
      settingsViewModel,
      connectionViewModel,
      chatListViewModel
    ),
    ChatPageWrapper(chatListViewModel),
    ConnectionModal(connectionViewModel),
    StorageModal(storageViewModel)
  );
  console.log(
    checkMatchesObjectStructure(
      { a: 4263, b: "bla", d: true, c: [1, 2] },
      { a: 123, b: "hello", d: false, c: [1, 3] }
    )
  );
})();
