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
              try {
                const [listState, toElement] = value;
                listState.handleAddition((newItem) => {
                  const child = toElement(newItem, listState);
                  listState.handleRemoval(
                    newItem,
                    () => child.remove()
                  );
                  element.append(child);
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
    // handlers
    connectionHandler = () => {
    };
    disconnectionHandler = () => {
    };
    messageHandler = (data) => {
    };
    // init
    set onconnect(handler) {
      this.connectionHandler = handler;
    }
    set ondisconnect(handler) {
      this.disconnectionHandler = handler;
    }
    set onmessage(handler) {
      this.messageHandler = handler;
    }
    // utility methods
    send(messageObject) {
      if (this.ws == void 0) return false;
      const messageString = JSON.stringify(messageObject);
      this.ws.send(messageString);
      return true;
    }
    // public methods
    connect(address) {
      this.ws = new WebSocket(address);
      this.ws.addEventListener("open", this.connectionHandler);
      this.ws.addEventListener("close", this.disconnectionHandler);
      this.ws.addEventListener("message", (message) => {
        const dataString = message.data.toString();
        const data = JSON.parse(dataString);
        this.messageHandler(data);
      });
    }
    sendMessage(channel, body) {
      const messageObject = {
        messageChannel: channel,
        messageBody: body
      };
      return this.send(messageObject);
    }
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
  };

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
  var cannotConnect = createProxyState(
    [serverAddress, currentAddress, isConnected],
    () => serverAddress.value == "" || currentAddress.value == serverAddress.value && isConnected.value == true
  );
  var encryptionKey = restoreState("encryption-key", "");
  var isEncryptionUnavailable = window.crypto.subtle == void 0;
  var currentPrimaryChannel = new State("");
  var primaryChannel = restoreState("primary-channel", "");
  var newSecondaryChannelName = new State("");
  var secondaryChannels = restoreListState("secondary-channels");
  var senderName = restoreState("sender-name", "");
  var messageBody = restoreState("message", "");
  var cannotSetChannel = createProxyState(
    [primaryChannel, currentPrimaryChannel, isConnected],
    () => primaryChannel.value == "" || primaryChannel.value == currentPrimaryChannel.value || isConnected.value == false
  );
  var cannotAddSecondaryChannel = createProxyState(
    [newSecondaryChannelName],
    () => newSecondaryChannelName.value == ""
  );
  var cannotSendMessage = createProxyState(
    [currentPrimaryChannel, messageBody, senderName],
    () => currentPrimaryChannel.value == "" || messageBody.value == "" || senderName.value == ""
  );
  var messages = restoreListState("messages");
  function connect() {
    if (cannotConnect.value == true) return;
    currentAddress.value = serverAddress.value;
    isConnected.value = false;
    UDN.connect(serverAddress.value);
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
  function setChannel() {
    if (cannotSetChannel.value == true) return;
    if (currentPrimaryChannel != void 0) {
      UDN.unsubscribe(currentPrimaryChannel.value);
    }
    UDN.subscribe(primaryChannel.value);
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
  UDN.onconnect = () => {
    isConnected.value = true;
    setChannel();
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
  };
  function handleSubscriptionConfirmation(channel, isSubscribed) {
    if (isSubscribed == true) {
      currentPrimaryChannel.value = channel;
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

  // src/translations.ts
  var englishTranslations = {
    // general
    setInput: "Set",
    connectionStatus: "Connection status",
    connectedTo: createProxyState(
      [],
      () => `Connected to ${currentAddress}`
    ),
    disconnected: "Disconnected",
    // settings
    settings: "Settings",
    connection: "Connection",
    communication: "Communication",
    encryption: "Encryption",
    serverAddress: "Server Address",
    serverAddressPlaceholder: "ws://192.168.0.69:3000",
    connectToServer: "Connect",
    primaryChannel: "Primary channel",
    channelPlaceholder: "my-channel",
    addSecondaryChannel: "Add secondary channel",
    removeSecondaryChannel: "Remove secondary channel",
    newSecondaryChannelPlaceholder: "Add secondary channel",
    encryptionKey: "Encryption key",
    encryptionKeyPlaceholder: "1jg028ej40d",
    showEncryptionKey: "Show encryption key",
    yourName: "Your Name",
    yourNamePlaceholder: "Jane Doe",
    // messages
    messages: "Messages",
    composerPlaceholder: "Type a message...",
    sendMessage: "Send",
    clearHistory: "Clear history",
    encryptionUnavailableTitle: "Encryption is not available",
    encryptionUnavailableMessage: "Encryption is not available on insecure contexts. Obtain this app via HTTPS or continue without encryption"
  };
  var allTranslations = {
    en: englishTranslations
  };
  var language = navigator.language.substring(0, 2);
  var translation = allTranslations[language] ?? allTranslations.en;

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
    return /* @__PURE__ */ createElement("div", { class: "tile width-100 flex-no" }, /* @__PURE__ */ createElement("div", { class: "flex-column" }, /* @__PURE__ */ createElement("span", { class: "secondary" }, message.sender, "@", message.channel), /* @__PURE__ */ createElement("b", null, message.body), /* @__PURE__ */ createElement("span", { class: "secondary" }, new Date(message.isoDate).toLocaleString())));
  };
  function ThreadView() {
    return /* @__PURE__ */ createElement("div", { class: "flex-column gap", "subscribe:children": [messages, messageConverter] });
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
    return /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("h2", null, translation.communication), /* @__PURE__ */ createElement("label", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translation.yourName), /* @__PURE__ */ createElement(
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
        class: "primary width-50",
        "on:click": connect,
        "toggle:disabled": cannotConnect
      },
      translation.connectToServer,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )));
  }

  // src/Views/connectionStatusView.tsx
  function ConnectionStatusView() {
    return /* @__PURE__ */ createElement("div", { class: "tile width-input" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, translation.connectionStatus), /* @__PURE__ */ createElement(
      "span",
      {
        class: "success connected-only",
        "subscribe:innerText": translation.connectedTo
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
    return /* @__PURE__ */ createElement("article", { id: "settings-tab", "toggle:connected": isConnected }, /* @__PURE__ */ createElement("header", null, translation.settings), /* @__PURE__ */ createElement("div", null, ConnectionSection(), CommunicationSection(), EncryptionSection(), /* @__PURE__ */ createElement("hr", { class: "mobile-only" }), /* @__PURE__ */ createElement(
      "a",
      {
        href: "#message-tab",
        class: "mobile-only width-100 flex-row justify-end control-gap"
      },
      translation.messages,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )));
  }

  // src/index.tsx
  document.querySelector("main").append(SettingsTab(), MessageTab());
  document.querySelector("main").classList.add("split");
})();
