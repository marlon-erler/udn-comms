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
  function bulkSubscribe(statesToSubscibe, fn) {
    statesToSubscibe.forEach((state) => state.subscribeSilent(fn));
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
                  console.error(error);
                  throw `error: cannot process subscribe:children directive. 
 Usage: "children:append={[list, converter]}"; you can find a more detailed example in the documentation.`;
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
    if (typeof reference != "object") {
      return typeof objectToCheck == typeof reference;
    }
    for (const key of Object.keys(reference)) {
      const requiredType = typeof reference[key];
      const actualType = typeof objectToCheck[key];
      if (requiredType != actualType) return false;
      if (Array.isArray(reference[key]) || reference[key] instanceof Set) {
        if (objectToCheck[key].length == 0) continue;
        if (objectToCheck[key].size == 0) continue;
        const [firstOfObjectToCheck] = objectToCheck[key];
        const [fisrtOfReference] = reference[key];
        const doesFirstItemMatch = checkMatchesObjectStructure(
          firstOfObjectToCheck,
          fisrtOfReference
        );
        if (doesFirstItemMatch == false) return false;
      } else if (requiredType == "object") {
        const doesNestedObjectMatch = checkMatchesObjectStructure(
          objectToCheck[key],
          reference[key]
        );
        if (doesNestedObjectMatch == false) return false;
      }
    }
    return true;
  }

  // src/Model/Utility/utility.ts
  function createTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function checkDoesObjectMatchReference(reference, stringEntryObject) {
    reference_entry_loop: for (const referenceEntry of Object.entries(
      reference
    )) {
      const [referenceKey, referenceValue] = referenceEntry;
      const stringEntryObjectValue = stringEntryObject[referenceKey];
      if (referenceValue == void 0) return false;
      if (referenceValue[0] == "-") {
        const strippedReferenceValue = referenceValue.substring(1);
        if (strippedReferenceValue == "" && stringEntryObjectValue != void 0 && stringEntryObjectValue != "") {
          return false;
        }
        if (stringEntryObjectValue == strippedReferenceValue) {
          return false;
        }
      } else {
        if (referenceValue == "" && (stringEntryObjectValue == void 0 || stringEntryObjectValue == "")) {
          return false;
        } else if (referenceValue == "") {
          continue reference_entry_loop;
        }
        if (stringEntryObjectValue != referenceValue) {
          return false;
        }
      }
    }
    return true;
  }
  function collectObjectValuesForKey(key, converter, objects) {
    const values = /* @__PURE__ */ new Set();
    for (const object of objects) {
      const stringEntryObject = converter(object);
      const stringEntryObjectValue = stringEntryObject[key];
      if (stringEntryObjectValue == void 0 || stringEntryObjectValue == "")
        continue;
      values.add(stringEntryObjectValue);
    }
    return [...values.values()];
  }
  function checkDoesObjectMatchSearch(query, getStringsOfObject, object) {
    if (query == "") return true;
    const stringsInObject = getStringsOfObject(object);
    const wordsInObject = [];
    for (const string of stringsInObject) {
      const lowercaseWordsInString = string.toLocaleLowerCase().split(" ").filter((word) => word != "");
      wordsInObject.push(...lowercaseWordsInString);
    }
    const lowercaseWordsInQuery = query.toLowerCase().split(" ").filter((word) => word != "");
    for (const queryWord of lowercaseWordsInQuery) {
      if (queryWord[0] == "-") {
        const wordContent = queryWord.substring(1);
        if (wordsInObject.includes(wordContent)) {
          return false;
        }
      } else {
        if (wordsInObject.includes(queryWord) == false) {
          return false;
        }
      }
    }
    return true;
  }
  var HandlerManager = class {
    handlers = /* @__PURE__ */ new Set();
    // manage
    addHandler = (handler) => {
      this.handlers.add(handler);
    };
    deleteHandler = (handler) => {
      this.handlers.delete(handler);
    };
    // trigger
    trigger = (item) => {
      for (const handler of this.handlers) {
        handler(item);
      }
    };
  };
  var IndexManager = class {
    itemToString;
    sortedStrings = [];
    // methods
    update = (items) => {
      this.sortedStrings = [];
      let strings = [];
      for (const item of items) {
        const string = this.itemToString(item);
        strings.push(string);
      }
      this.sortedStrings = strings.sort(localeCompare);
    };
    getIndex = (item) => {
      const string = this.itemToString(item);
      const index = this.sortedStrings.indexOf(string);
      return index;
    };
    // init
    constructor(itemToString) {
      this.itemToString = itemToString;
    }
  };
  function stringify(data) {
    return JSON.stringify(data, null, 4);
  }
  function padZero(string, length) {
    return (string ?? "").padStart(length, "0");
  }
  function parse(string) {
    try {
      return JSON.parse(string);
    } catch {
      return {};
    }
  }
  function parseValidObject(string, reference) {
    const parsed = parse(string);
    if (checkIsValidObject(parsed) == false) return null;
    const doesMatchReference = checkMatchesObjectStructure(
      parsed,
      reference
    );
    if (doesMatchReference == false) return null;
    return parsed;
  }
  function localeCompare(a, b) {
    return a.localeCompare(b);
  }

  // src/Model/Global/storageModel.ts
  var PATH_COMPONENT_SEPARATOR = "\\";
  var StorageModel = class _StorageModel {
    storageEntryTree = {};
    // read
    read = (pathComponents) => {
      const pathString = _StorageModel.pathComponentsToString(
        ...pathComponents
      );
      return localStorage.getItem(pathString);
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
    // write
    write = (pathComponents, value) => {
      const pathString = _StorageModel.pathComponentsToString(
        ...pathComponents
      );
      localStorage.setItem(pathString, value);
      this.updateTree(...pathComponents);
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
    removeRecursively = (pathComponents) => {
      loop_over_files: for (const key of Object.keys(localStorage)) {
        const pathComponentsOfCurrentEntity = _StorageModel.stringToPathComponents(key);
        loop_over_path_components: for (let i = 0; i < pathComponents.length; i++) {
          if (!pathComponentsOfCurrentEntity[i]) continue loop_over_files;
          if (pathComponentsOfCurrentEntity[i] != pathComponents[i])
            continue loop_over_files;
        }
        this.remove(pathComponentsOfCurrentEntity, false);
      }
      this.initializeTree();
    };
    rename = (sourcePathComponents, destinationPathComponents, shouldInitialize = true) => {
      const content = this.read(sourcePathComponents);
      if (content == null) return false;
      this.write(destinationPathComponents, content);
      this.remove(sourcePathComponents);
      if (shouldInitialize == true) {
        this.initializeTree();
      }
      return true;
    };
    renameRecursively = (sourcePathComponents, destinationPathComponents) => {
      loop_over_files: for (const key of Object.keys(localStorage)) {
        const originalPathComponentsOfCurrentEntity = _StorageModel.stringToPathComponents(key);
        loop_over_path_components: for (let i = 0; i < sourcePathComponents.length; i++) {
          if (!originalPathComponentsOfCurrentEntity[i]) continue loop_over_files;
          if (originalPathComponentsOfCurrentEntity[i] != sourcePathComponents[i])
            continue loop_over_files;
        }
        const relativePathOfCurrentEntity = originalPathComponentsOfCurrentEntity.slice(
          sourcePathComponents.length
        );
        const destinationPathComponentsOfCurrentEntity = [
          ...destinationPathComponents,
          ...relativePathOfCurrentEntity
        ];
        this.rename(
          originalPathComponentsOfCurrentEntity,
          destinationPathComponentsOfCurrentEntity,
          false
        );
      }
      this.initializeTree();
    };
    // stringifiable
    writeStringifiable = (pathComponents, value) => {
      const valueString = stringify(value);
      this.write(pathComponents, valueString);
    };
    readStringifiable = (pathComponents, reference) => {
      const valueString = this.read(pathComponents);
      if (!valueString) return null;
      const object = parseValidObject(valueString, reference);
      if (object == null) return null;
      return object;
    };
    // tree
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
    // init
    constructor() {
      this.initializeTree();
    }
    // utility
    static getFileName = (pathComponents) => {
      return pathComponents[pathComponents.length - 1] || "\\";
    };
    static getFileNameFromString = (pathString) => {
      const pathComponents = this.stringToPathComponents(pathString);
      return pathComponents[pathComponents.length - 1] || "\\";
    };
    static pathComponentsToString = (...pathComponents) => {
      return pathComponents.filter((x) => x != "").join(PATH_COMPONENT_SEPARATOR);
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
    static getPath(locationName, filePath) {
      return [DATA_VERSION, locationName, ...filePath];
    }
  };
  var filePaths = {
    connectionModel: {
      socketAddress: ["socket-address"],
      reconnectAddress: ["reconnect-address"],
      outbox: ["outbox"],
      mailboxes: ["mailboxes"],
      previousAddresses: ["previous-addresses"]
    },
    chat: {
      base: [],
      chatBase: (id) => [id],
      info: (id) => [...filePaths.chat.chatBase(id), "info"],
      color: (id) => [...filePaths.chat.chatBase(id), "color"],
      messages: (id) => [...filePaths.chat.chatBase(id), "messages"],
      lastUsedPage: (id) => [
        ...filePaths.chat.chatBase(id),
        "last-used-page"
      ],
      files: (id) => [...filePaths.chat.chatBase(id), "files"]
    },
    settingsModel: {
      username: ["user-name"],
      firstDayOfWeek: ["first-day-of-week"]
    }
  };

  // src/Model/Files/calendarModel.ts
  var CalendarModel = class _CalendarModel {
    storageModel;
    fileModel;
    settingsModel;
    // paths
    getBasePath = () => {
      return this.fileModel.getModelContainerPath("calendar" /* ModelCalendar */);
    };
    getViewPath = () => {
      return [...this.getBasePath(), "view" /* ModelView */];
    };
    getMonthContainerPath = () => {
      return [...this.getBasePath(), "months" /* Months */];
    };
    getMonthPath = (monthString) => {
      return [...this.getMonthContainerPath(), monthString];
    };
    // main
    storeTaskReference = (taskFileContent) => {
      if (taskFileContent.date == void 0) return;
      const monthString = _CalendarModel.isoToMonthString(
        taskFileContent.date
      );
      const monthPath = this.getMonthPath(monthString);
      const referencePath = [...monthPath, taskFileContent.fileId];
      this.storageModel.write(referencePath, "");
    };
    listTaskIds = (monthString) => {
      const monthPath = this.getMonthPath(monthString);
      return this.storageModel.list(monthPath);
    };
    generateMonthGrid = (year, month, defaultValueCreator) => {
      const date = /* @__PURE__ */ new Date();
      date.setFullYear(year);
      date.setMonth(month - 1);
      date.setDate(1);
      const offset = date.getDay() - parseInt(this.settingsModel.firstDayOfWeek);
      date.setMonth(month);
      date.setDate(-1);
      const daysInMonth = date.getDate() + 1;
      const grid = {
        offset,
        days: {}
      };
      for (let i = 0; i < daysInMonth; i++) {
        grid.days[i + 1] = defaultValueCreator();
      }
      return grid;
    };
    // init
    constructor(storageModel2, settingsModel2, fileModel) {
      this.storageModel = storageModel2;
      this.settingsModel = settingsModel2;
      this.fileModel = fileModel;
    }
    // utility
    static isoToMonthString = (dateISOString) => {
      const [year, month, _] = dateISOString.split("-");
      return _CalendarModel.getMonthString(year, month);
    };
    static isoToDateString = (dateISOString) => {
      const [year, month, date, _] = dateISOString.split("-");
      return date;
    };
    static getMonthString = (year = "", month = "") => {
      const paddedYear = year.padStart(4, "0");
      const paddedMonth = month.padStart(2, "0");
      return `${paddedYear}-${paddedMonth}`;
    };
  };

  // src/colors.ts
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

  // src/Model/Files/boardsAndTasksModel.ts
  var BoardsAndTasksModel = class _BoardsAndTasksModel {
    storageModel;
    settingsModel;
    chatModel;
    fileModel;
    calendarModel;
    // data
    boardHandlerManager = new HandlerManager();
    taskHandlerManager = new HandlerManager();
    // paths
    getBasePath = () => {
      return this.fileModel.getModelContainerPath("tasks" /* ModelTask */);
    };
    getViewPath = () => {
      return [...this.getBasePath(), "view" /* ModelView */];
    };
    getBoardFilePath = (boardId) => {
      return [...this.fileModel.getFilePath(boardId)];
    };
    getTaskFilePath = (taskId) => {
      return [...this.fileModel.getFilePath(taskId)];
    };
    getBoardContainerPath = () => {
      return [...this.getBasePath(), "boards" /* Boards */];
    };
    getBoardDirectoryPath = (boardId) => {
      return [...this.getBoardContainerPath(), boardId];
    };
    getTaskContainerPath = (boardId) => {
      return [
        ...this.getBoardDirectoryPath(boardId),
        "tasks" /* BoardTasks */
      ];
    };
    getTaskReferencePath = (boardId, fileId) => {
      return [...this.getTaskContainerPath(boardId), fileId];
    };
    // handlers
    handleFileContent = (fileContent) => {
      if (checkMatchesObjectStructure(fileContent, BoardInfoFileContentReference) == true) {
        this.handleBoard(fileContent);
      } else if (checkMatchesObjectStructure(fileContent, TaskFileContentReference) == true) {
        this.handleTask(fileContent);
      }
    };
    handleBoard = (boardInfoFileContent) => {
      this.updateBoard(boardInfoFileContent);
    };
    handleTask = (taskFileContent) => {
      this.updateTask(taskFileContent);
    };
    // boards
    createBoard = (name) => {
      const boardInfoFileContent = _BoardsAndTasksModel.createBoardInfoFileContent(
        v4_default(),
        name,
        "standard" /* Standard */
      );
      return boardInfoFileContent;
    };
    updateBoard = (boardInfoFileContent) => {
      this.storeBoard(boardInfoFileContent);
      this.boardHandlerManager.trigger(boardInfoFileContent);
    };
    updateBoardAndSend = (boardInfoFileContent) => {
      this.updateBoard(boardInfoFileContent);
      this.chatModel.sendMessage("", boardInfoFileContent);
    };
    storeBoard = (boardInfoFileContent) => {
      this.fileModel.storeFileContent(boardInfoFileContent);
      const boardDirectoryPath = this.getBoardDirectoryPath(
        boardInfoFileContent.fileId
      );
      this.storageModel.write(boardDirectoryPath, "");
    };
    deleteBoard = (boardId) => {
      const boardFilePath = this.getBoardFilePath(boardId);
      const boardDirectoryPath = this.getBoardDirectoryPath(boardId);
      this.storageModel.removeRecursively(boardFilePath);
      this.storageModel.removeRecursively(boardDirectoryPath);
    };
    listBoardIds = () => {
      const boardContainerPath = this.getBoardContainerPath();
      const boardIds = this.storageModel.list(boardContainerPath);
      return boardIds;
    };
    getBoardInfo = (fileId) => {
      const boardInfoFileContentOrNull = this.fileModel.getLatestFileContent(
        fileId,
        BoardInfoFileContentReference
      );
      return boardInfoFileContentOrNull;
    };
    //tasks
    createTask = (boardId) => {
      const taskFileContent = _BoardsAndTasksModel.createTaskFileContent(v4_default(), "", boardId);
      return taskFileContent;
    };
    updateTask = (taskFileContent) => {
      this.storeTask(taskFileContent);
      this.taskHandlerManager.trigger(taskFileContent);
    };
    updateTaskAndSend = (taskFileContent) => {
      this.updateTask(taskFileContent);
      this.chatModel.sendMessage("", taskFileContent);
    };
    storeTask = (taskFileContent) => {
      this.fileModel.storeFileContent(taskFileContent);
      const taskReferencePath = this.getTaskReferencePath(
        taskFileContent.boardId,
        taskFileContent.fileId
      );
      this.storageModel.write(taskReferencePath, "");
      this.calendarModel.storeTaskReference(taskFileContent);
    };
    listTaskIds = (boardId) => {
      const taskContainerPath = this.getTaskContainerPath(boardId);
      const fileIds = this.storageModel.list(taskContainerPath);
      return fileIds;
    };
    listTaskVersionIds = (taskId) => {
      const versionIds = this.fileModel.listFileContentIds(taskId);
      return versionIds;
    };
    getLatestTaskFileContent = (taskId) => {
      const taskFileContentOrNull = this.fileModel.getLatestFileContent(taskId, TaskFileContentReference);
      return taskFileContentOrNull;
    };
    getSpecificTaskFileContent = (taskId, versionId) => {
      const taskFileContentOrNull = this.fileModel.getFileContent(
        taskId,
        versionId,
        TaskFileContentReference
      );
      return taskFileContentOrNull;
    };
    deleteTask = (boardId, taskId) => {
      const taskFilePath = this.getTaskFilePath(taskId);
      this.storageModel.removeRecursively(taskFilePath);
      this.deleteTaskReference(boardId, taskId);
    };
    deleteTaskReference = (boardId, taskId) => {
      const taskReferencePath = this.getTaskReferencePath(
        boardId,
        taskId
      );
      this.storageModel.removeRecursively(taskReferencePath);
    };
    // init
    constructor(storageModel2, settingsModel2, chatModel, fileModel) {
      this.storageModel = storageModel2;
      this.settingsModel = settingsModel2;
      this.chatModel = chatModel;
      this.fileModel = fileModel;
      this.calendarModel = new CalendarModel(
        this.storageModel,
        this.settingsModel,
        this.fileModel
      );
    }
    // utility
    static createBoardInfoFileContent = (fileId, name, color) => {
      const fileContent = FileModel2.createFileContent(
        fileId,
        "board-info"
      );
      return {
        ...fileContent,
        name,
        color
      };
    };
    static createTaskFileContent = (fileId, name, boardId) => {
      const fileContent = FileModel2.createFileContent(
        fileId,
        "task"
      );
      return {
        ...fileContent,
        name,
        boardId
      };
    };
  };
  var BoardInfoFileContentReference = {
    dataVersion: DATA_VERSION,
    fileId: "string",
    fileContentId: "",
    creationDate: "",
    type: "board-info",
    name: "",
    color: ""
  };
  var TaskFileContentReference = {
    dataVersion: DATA_VERSION,
    fileId: "string",
    fileContentId: "",
    creationDate: "",
    type: "task",
    name: "",
    boardId: ""
  };

  // src/Model/Files/fileModel.ts
  var FileModel2 = class _FileModel {
    storageModel;
    settingsModel;
    chatModel;
    boardsAndTasksModel;
    // paths
    getBasePath = () => {
      return StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.files(this.chatModel.id)
      );
    };
    getFileContainerPath = () => {
      return [...this.getBasePath(), "data" /* Data */];
    };
    getModelContainerPath = (modelName) => {
      return [...this.getBasePath(), "model" /* Model */, modelName];
    };
    getFilePath = (fileId) => {
      return [...this.getFileContainerPath(), fileId];
    };
    getFileContentPath = (fileId, fileContentId) => {
      const filePath = this.getFilePath(fileId);
      return [...filePath, fileContentId];
    };
    // handlers
    handleStringifiedFileContent = (stringifiedFileContent) => {
      const fileContent = parseValidObject(
        stringifiedFileContent,
        FileContentReference
      );
      if (fileContent == null) return;
      this.handleFileContent(fileContent);
    };
    handleFileContent = (fileContent) => {
      const didStore = this.storeFileContent(fileContent);
      if (didStore == false) return;
      this.boardsAndTasksModel.handleFileContent(fileContent);
    };
    // methods
    addFileContentAndSend = (fileContent) => {
      this.handleFileContent(fileContent);
      this.chatModel.sendMessage("", fileContent);
    };
    // storage
    storeFileContent = (fileContent) => {
      const fileContentPath = this.getFileContentPath(
        fileContent.fileId,
        fileContent.fileContentId
      );
      const existingFileContent = this.storageModel.read(fileContentPath);
      if (existingFileContent != null) return false;
      const stringifiedContent = stringify(fileContent);
      this.storageModel.write(fileContentPath, stringifiedContent);
      return true;
    };
    listFileIds = () => {
      return this.storageModel.list(this.getBasePath());
    };
    listFileContentIds = (fileId) => {
      const filePath = this.getFilePath(fileId);
      return this.storageModel.list(filePath);
    };
    selectLatestFileContentId = (fileContentIds) => {
      return fileContentIds[fileContentIds.length - 1];
    };
    getFileContent = (fileId, fileContentName, reference) => {
      const filePath = this.getFileContentPath(fileId, fileContentName);
      const fileContentOrNull = this.storageModel.readStringifiable(
        filePath,
        reference
      );
      return fileContentOrNull;
    };
    getLatestFileContent = (fileId, reference) => {
      const fileContentsIds = this.listFileContentIds(fileId);
      const latestFileContentId = this.selectLatestFileContentId(fileContentsIds);
      if (latestFileContentId == void 0) return null;
      const fileContent = this.getFileContent(
        fileId,
        latestFileContentId,
        reference
      );
      return fileContent;
    };
    // init
    constructor(storageModel2, settingsModel2, chatModel) {
      this.chatModel = chatModel;
      this.settingsModel = settingsModel2;
      this.storageModel = storageModel2;
      this.boardsAndTasksModel = new BoardsAndTasksModel(
        this.storageModel,
        this.settingsModel,
        chatModel,
        this
      );
    }
    // utility
    static generateFileContentId = (creationDate) => {
      return creationDate + v4_default();
    };
    static createFileContent = (fileId, type) => {
      const creationDate = createTimestamp();
      const fileContentId = _FileModel.generateFileContentId(creationDate);
      return {
        dataVersion: DATA_VERSION,
        fileId,
        fileContentId,
        creationDate,
        type
      };
    };
  };
  var FileContentReference = {
    dataVersion: DATA_VERSION,
    fileId: "",
    fileContentId: "",
    creationDate: "",
    type: ""
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

  // src/Model/Chat/chatModel.ts
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
    chatMessageHandlerManager = new HandlerManager();
    get secondaryChannels() {
      return this.info.secondaryChannels.sort(localeCompare);
    }
    // paths
    getBasePath = () => {
      return StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.chatBase(this.id)
      );
    };
    getInfoPath = () => {
      return StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.info(this.id)
      );
    };
    getColorPath = () => {
      return StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.color(this.id)
      );
    };
    getMessageDirPath = () => {
      return StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.messages(this.id)
      );
    };
    getMessagePath = (id) => {
      return [...this.getMessageDirPath(), id];
    };
    // handlers
    handleMessage = (body) => {
      const chatMessage = parseValidObject(
        body,
        ChatMessageReference
      );
      if (chatMessage == null) return;
      chatMessage.status = "received" /* Received */;
      this.addMessage(chatMessage);
    };
    handleMessageSent = (chatMessage) => {
      chatMessage.status = "sent" /* Sent */;
      this.addMessage(chatMessage);
    };
    // settings
    setPrimaryChannel = (primaryChannel) => {
      this.info.primaryChannel = primaryChannel;
      this.storeInfo();
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
    // messaging
    addMessage = async (chatMessage) => {
      await this.decryptMessage(chatMessage);
      if (chatMessage.body != "") {
        const messagePath = this.getMessagePath(chatMessage.id);
        this.storageModel.writeStringifiable(messagePath, chatMessage);
        this.chatMessageHandlerManager.trigger(chatMessage);
      }
      this.fileModel.handleStringifiedFileContent(chatMessage.stringifiedFile);
    };
    sendMessage = async (body, fileContent) => {
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
        fileContent
      );
      this.addMessage(chatMessage);
      this.connectionModel.sendMessageOrStore(chatMessage);
      return true;
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
    subscribe = () => {
      this.connectionModel.addChannel(this.info.primaryChannel);
    };
    // storage
    storeInfo = () => {
      this.storageModel.writeStringifiable(this.getInfoPath(), this.info);
    };
    storeColor = () => {
      this.storageModel.write(this.getColorPath(), this.color);
    };
    delete = () => {
      this.chatListModel.untrackChat(this);
      const dirPath = this.getBasePath();
      this.storageModel.removeRecursively(dirPath);
    };
    // load
    loadInfo = () => {
      const info = this.storageModel.readStringifiable(
        this.getInfoPath(),
        ChatInfoReference
      );
      if (info != null) {
        this.info = info;
      } else {
        this.info = _ChatModel.generateChatInfo("0");
      }
    };
    loadColor = () => {
      const path = this.getColorPath();
      const color = this.storageModel.read(path);
      if (!color) {
        this.color = "standard" /* Standard */;
      } else {
        this.color = color;
      }
    };
    get messages() {
      const messageIds = this.storageModel.list(
        this.getMessageDirPath()
      );
      if (!Array.isArray(messageIds)) return [];
      const chatMessages = [];
      for (const messageId of messageIds) {
        const messagePath = this.getMessagePath(messageId);
        const chatMessage = this.storageModel.readStringifiable(messagePath, ChatMessageReference);
        chatMessages.push(chatMessage);
      }
      const sorted = chatMessages.sort(
        (a, b) => a.dateSent.localeCompare(b.dateSent)
      );
      return sorted;
    }
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
      this.fileModel = new FileModel2(this.storageModel, this.settingsModel, this);
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
    static createChatMessage = async (channel, sender, encryptionKey, body, fileContent) => {
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
      if (fileContent != void 0) {
        const stringifiedFile = stringify(fileContent);
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
  var ChatInfoReference = {
    dataVersion: DATA_VERSION,
    primaryChannel: "",
    secondaryChannels: [""],
    encryptionKey: "",
    hasUnreadMessages: true
  };
  var ChatMessageReference = {
    dataVersion: DATA_VERSION,
    id: "",
    channel: "",
    sender: "",
    body: "",
    dateSent: "",
    status: "",
    stringifiedFile: ""
  };

  // src/Model/Chat/chatListModel.ts
  var ChatListModel = class {
    storageModel;
    settingsModel;
    connectionModel;
    // data
    chatModels = /* @__PURE__ */ new Set();
    // handlers
    messageHandler = (data) => {
      const channel = data.messageChannel;
      const body = data.messageBody;
      if (channel == void 0) return;
      if (body == void 0) return;
      this.routeMessageToCorrectChatModel(
        channel,
        (chatModel) => chatModel.handleMessage(body)
      );
    };
    messageSentHandler = (chatMessage) => {
      const channel = chatMessage.channel;
      this.routeMessageToCorrectChatModel(
        channel,
        (chatModel) => chatModel.handleMessageSent(chatMessage)
      );
    };
    // methods
    routeMessageToCorrectChatModel = (channel, fn) => {
      const allChannels = channel.split("/");
      for (const chatModel of this.chatModels) {
        for (const channel2 of allChannels) {
          if (channel2 != chatModel.info.primaryChannel) continue;
          fn(chatModel);
          break;
        }
      }
    };
    // storage
    addChatModel = (chatModel) => {
      this.chatModels.add(chatModel);
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
    };
    // load
    loadChats = () => {
      const chatDir = StorageModel.getPath("chat" /* Chat */, filePaths.chat.base);
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
      connectionModel2.messageHandlerManager.addHandler(this.messageHandler);
      connectionModel2.messageSentHandlerManager.addHandler(
        this.messageSentHandler
      );
    }
  };

  // src/View/utility.ts
  function allowDrop(event) {
    event.preventDefault();
  }
  function allowDrag(event) {
    event.dataTransfer?.setData("text", "");
  }

  // src/ViewModel/Pages/taskViewModel.ts
  var TaskViewModel = class {
    // init
    constructor(coreViewModel, boardsAndTasksModel, boardViewModel, calendarPageViewModel, taskFileContent) {
      this.coreViewModel = coreViewModel;
      this.boardsAndTasksModel = boardsAndTasksModel;
      this.boardViewModel = boardViewModel;
      this.calendarPageViewModel = calendarPageViewModel;
      this.task = taskFileContent;
      this.loadAllData();
      this.selectedVersionId.subscribeSilent((selectedVersionId) => {
        this.switchVersion(selectedVersionId);
      });
    }
    boardsAndTasksModel;
    boardViewModel;
    calendarPageViewModel;
    // data
    task;
    get sortingString() {
      const splitDate = this.date.value.split("-");
      const year = padZero(splitDate[0], 4);
      const month = padZero(splitDate[1], 2);
      const date = padZero(splitDate[2], 2);
      const splitTime = this.time.value.split(":");
      const hour = padZero(splitTime[0], 2);
      const minute = padZero(splitTime[1], 2);
      const priorityNumber = parseInt(this.priority.value);
      const invertedPriority = 100 - priorityNumber;
      return year + month + date + hour + minute + invertedPriority + this.name.value;
    }
    // paths
    getFilePath = () => {
      return this.boardsAndTasksModel.getTaskFilePath(this.task.fileId);
    };
    // state
    index = new State(0);
    boardId = new State("");
    name = new State("");
    description = new State("");
    category = new State("");
    status = new State("");
    priority = new State("");
    date = new State("");
    time = new State("");
    selectedVersionId = new State("");
    versionIds = new ListState();
    // methods
    dragStart = (event) => {
      allowDrag(event);
      this.coreViewModel.draggedObject.value = this;
    };
    setCategoryAndStatus = (category, status) => {
      if (category != void 0) this.category.value = category;
      if (status != void 0) this.status.value = status;
      this.save();
    };
    setBoardId = (boardId) => {
      this.boardId.value = boardId;
      this.save();
    };
    // view
    open = () => {
      this.boardViewModel?.selectTask(this);
    };
    close = () => {
      this.boardViewModel?.closeTask();
    };
    closeAndSave = () => {
      this.close();
      this.save();
    };
    updateIndex = () => {
      if (this.boardViewModel == null) return;
      const index = this.boardViewModel.taskIndexManager.getIndex(this);
      this.index.value = index;
    };
    // settings
    save = () => {
      const newTaskFileContent = BoardsAndTasksModel.createTaskFileContent(
        this.task.fileId,
        this.name.value,
        this.task.boardId
      );
      newTaskFileContent.boardId = this.boardId.value;
      newTaskFileContent.description = this.description.value;
      newTaskFileContent.status = this.status.value;
      newTaskFileContent.category = this.category.value;
      newTaskFileContent.priority = this.priority.value;
      newTaskFileContent.date = this.date.value;
      newTaskFileContent.time = this.time.value;
      this.boardsAndTasksModel.updateTaskAndSend(newTaskFileContent);
      if (this.boardViewModel != null) {
        this.boardViewModel.showTaskInList(newTaskFileContent);
        this.boardViewModel.updateTaskIndices();
      }
      if (this.calendarPageViewModel != null) {
      }
    };
    deleteTask = () => {
      this.close();
      this.boardsAndTasksModel.deleteTask(this.task.boardId, this.task.fileId);
      if (this.boardViewModel != null) {
        this.boardViewModel.removeTaskFromList(this.task.fileId);
      }
      if (this.calendarPageViewModel != null) {
      }
    };
    // load
    loadVersionIds = () => {
      const versionIds = this.boardsAndTasksModel.listTaskVersionIds(
        this.task.fileId
      );
      const sortedVersionIds = versionIds.sort(localeCompare).reverse();
      this.versionIds.clear();
      this.versionIds.add(...sortedVersionIds);
    };
    switchVersion = (versionId) => {
      const taskFileContent = this.boardsAndTasksModel.getSpecificTaskFileContent(
        this.task.fileId,
        versionId
      );
      if (taskFileContent == null) return;
      this.task = taskFileContent;
      this.loadTaskData();
    };
    loadAllData = () => {
      this.loadTaskData();
      this.loadVersionIds();
    };
    loadTaskData = () => {
      this.boardId.value = this.task.boardId;
      this.name.value = this.task.name;
      this.description.value = this.task.description ?? "";
      this.category.value = this.task.category ?? "";
      this.status.value = this.task.status ?? "";
      this.priority.value = this.task.priority ?? "";
      this.date.value = this.task.date ?? "";
      this.time.value = this.task.time ?? "";
      this.selectedVersionId.value = this.task.fileContentId;
    };
    // utility
    static getStringsForFilter = (taskViewModel) => {
      return [
        taskViewModel.task.name,
        taskViewModel.task.description ?? "",
        taskViewModel.task.category ?? "",
        taskViewModel.task.status ?? "",
        taskViewModel.task.priority ?? "",
        taskViewModel.task.date ?? "",
        taskViewModel.task.time ?? ""
      ];
    };
  };

  // src/ViewModel/Pages/calendarPageViewModel.ts
  var CalendarPageViewModel = class {
    // init
    constructor(coreViewModel, storageModel2, calendarModel, boardAndTasksModel) {
      this.coreViewModel = coreViewModel;
      this.storageModel = storageModel2;
      this.calendarModel = calendarModel;
      this.boardsAndTasksModel = boardAndTasksModel;
      bulkSubscribe([this.selectedYear, this.selectedMonth], () => {
        this.loadTasks();
      });
    }
    storageModel;
    calendarModel;
    boardsAndTasksModel;
    // data
    get monthString() {
      return CalendarModel.getMonthString(
        this.selectedYear.value.toString(),
        this.selectedMonth.value.toString()
      );
    }
    // paths
    getBasePath = () => {
      return [...this.calendarModel.getViewPath()];
    };
    // state
    selectedYear = new State(0);
    selectedMonth = new State(0);
    monthGrid = new State(void 0);
    // view
    getTaskMapState = (taskFileContent) => {
      if (this.monthGrid.value == null) return null;
      const dateString = CalendarModel.isoToDateString(
        taskFileContent.date ?? ""
      );
      if (dateString == void 0) return null;
      return this.monthGrid.value.days[dateString];
    };
    showTask = (taskFileContent) => {
      const taskViewModel = new TaskViewModel(
        this.coreViewModel,
        this.boardsAndTasksModel,
        null,
        this,
        taskFileContent
      );
      const mapState = this.getTaskMapState(taskFileContent);
      mapState?.set(taskFileContent.fileId, taskViewModel);
    };
    removeTaskFromList = (taskFileContent) => {
      const mapState = this.getTaskMapState(taskFileContent);
      mapState?.remove(taskFileContent.fileId);
    };
    showToday = () => {
      const today = /* @__PURE__ */ new Date();
      this.selectedYear.value = today.getFullYear();
      this.selectedMonth.value = today.getMonth() + 1;
    };
    showPreviousMonth = () => {
      this.selectedMonth.value -= 1;
      if (this.selectedMonth.value <= 0) {
        this.selectedYear.value -= 1;
        this.selectedMonth.value = 12;
      }
    };
    showNextMonth = () => {
      this.selectedMonth.value += 1;
      if (this.selectedMonth.value >= 13) {
        this.selectedYear.value += 1;
        this.selectedMonth.value = 1;
      }
    };
    // storage
    // load
    loadTasks = () => {
      this.monthGrid.value = this.calendarModel.generateMonthGrid(
        this.selectedYear.value,
        this.selectedMonth.value,
        () => new MapState()
      );
      const taskIds = this.calendarModel.listTaskIds(this.monthString);
      for (const taskId of taskIds) {
        const taskFileContent = this.boardsAndTasksModel.getLatestTaskFileContent(taskId);
        if (taskFileContent == null) continue;
        this.showTask(taskFileContent);
      }
    };
    loadData = () => {
      this.loadTasks();
      this.showToday();
    };
  };

  // src/ViewModel/Chat/chatMessageViewModel.ts
  var ChatMessageViewModel = class {
    // init
    constructor(coreViewModel, messagePageViewModel, chatMessage, sentByUser) {
      this.coreViewModel = coreViewModel;
      this.messagePageViewModel = messagePageViewModel;
      this.chatMessage = chatMessage;
      this.sentByUser = sentByUser;
      this.loadData();
    }
    messagePageViewModel;
    // data
    chatMessage;
    channel;
    sender;
    dateSent;
    body = new State("");
    status = new State(
      void 0
    );
    sentByUser;
    // state
    isPresentingInfoModal = new State(false);
    // methods
    copyMessage = () => {
      navigator.clipboard.writeText(this.body.value);
    };
    resendMessage = () => {
      this.messagePageViewModel.sendMessageFromBody(this.body.value);
    };
    decryptMessage = () => {
      this.messagePageViewModel.decryptMessage(this);
    };
    // view
    showInfoModal = () => {
      this.isPresentingInfoModal.value = true;
    };
    hideInfoModal = () => {
      this.isPresentingInfoModal.value = false;
    };
    // load
    loadData = () => {
      this.channel = this.chatMessage.channel;
      this.sender = this.chatMessage.sender;
      this.dateSent = new Date(this.chatMessage.dateSent).toLocaleString();
      this.body.value = this.chatMessage.body;
      this.status.value = this.chatMessage.status;
    };
  };

  // src/ViewModel/Pages/messagePageViewModel.ts
  var MessagePageViewModel = class {
    // init
    constructor(coreViewModel, chatViewModel) {
      this.coreViewModel = coreViewModel;
      this.chatViewModel = chatViewModel;
      this.cannotSendMessage = createProxyState(
        [this.chatViewModel.settingsViewModel.username, this.composingMessage],
        () => this.chatViewModel.settingsViewModel.username.value == "" || this.composingMessage.value == ""
      );
    }
    chatViewModel;
    // state
    chatMessageViewModels = new MapState();
    composingMessage = new State("");
    // guards
    cannotSendMessage;
    // methods
    sendMessage = () => {
      if (this.cannotSendMessage.value == true) return;
      this.sendMessageFromBody(this.composingMessage.value);
      this.composingMessage.value = "";
    };
    sendMessageFromBody = (body) => {
      this.chatViewModel.chatModel.sendMessage(body);
    };
    decryptMessage = async (messageViewModel) => {
      const chatMessage = messageViewModel.chatMessage;
      await this.chatViewModel.chatModel.decryptMessage(chatMessage);
      this.chatViewModel.chatModel.addMessage(chatMessage);
      messageViewModel.loadData();
    };
    // view
    showChatMessage = (chatMessage) => {
      const chatMessageModel = new ChatMessageViewModel(
        this.coreViewModel,
        this,
        chatMessage,
        chatMessage.sender == this.chatViewModel.settingsViewModel.username.value
      );
      const existingChatMessageViewModel = this.chatMessageViewModels.value.get(chatMessage.id);
      if (existingChatMessageViewModel != void 0) {
        existingChatMessageViewModel.body.value = chatMessage.body;
        existingChatMessageViewModel.status.value = chatMessage.status;
      } else {
        this.chatMessageViewModels.set(chatMessage.id, chatMessageModel);
      }
    };
    // load
    loadData = () => {
      for (const chatMessage of this.chatViewModel.chatModel.messages) {
        this.showChatMessage(chatMessage);
      }
    };
  };

  // src/ViewModel/Pages/settingsPageViewModel.ts
  var SettingsPageViewModel = class {
    // init
    constructor(coreViewModel, chatViewModel) {
      this.coreViewModel = coreViewModel;
      this.chatViewModel = chatViewModel;
      this.loadListRelevantData();
      this.cannotSetEncryptionKey = createProxyState(
        [this.encryptionKeyInput],
        () => this.encryptionKeyInput.value == this.chatViewModel.chatModel.info.encryptionKey
      );
      this.color.subscribe((newColor) => {
        this.applyColor(newColor);
      });
    }
    chatViewModel;
    // state
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
    // methods
    setPrimaryChannel = () => {
      this.chatViewModel.chatModel.setPrimaryChannel(
        this.primaryChannelInput.value
      );
      this.primaryChannel.value = this.chatViewModel.chatModel.info.primaryChannel;
      this.chatViewModel.chatListViewModel.updateIndices();
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
      this.chatViewModel.chatModel.setSecondaryChannels([
        ...this.secondaryChannels.value.values()
      ]);
    };
    setEncryptionKey = () => {
      this.chatViewModel.chatModel.setEncryptionKey(
        this.encryptionKeyInput.value
      );
      this.encryptionKeyInput.callSubscriptions();
    };
    applyColor = (newColor) => {
      this.chatViewModel.setColor(newColor);
    };
    remove = () => {
      this.chatViewModel.close();
      this.chatViewModel.chatModel.delete();
      this.chatViewModel.chatListViewModel.untrackChat(this.chatViewModel);
    };
    // load
    loadListRelevantData = () => {
      this.primaryChannel.value = this.chatViewModel.chatModel.info.primaryChannel;
      this.color.value = this.chatViewModel.chatModel.color;
    };
    loadData = () => {
      this.primaryChannelInput.value = this.chatViewModel.chatModel.info.primaryChannel;
      this.loadSecondaryChannels();
      this.encryptionKeyInput.value = this.chatViewModel.chatModel.info.encryptionKey;
    };
    loadSecondaryChannels = () => {
      this.secondaryChannels.clear();
      for (const secondaryChannel of this.chatViewModel.chatModel.secondaryChannels) {
        this.secondaryChannels.add(secondaryChannel);
      }
    };
  };

  // src/ViewModel/Pages/boardViewModel.ts
  var BoardViewModel = class {
    // init
    constructor(coreViewModel, storageModel2, boardModel, taskPageViewModel, boardInfo) {
      this.coreViewModel = coreViewModel;
      this.storageModel = storageModel2;
      this.boardsAndTasksModel = boardModel;
      this.taskPageViewModel = taskPageViewModel;
      this.boardInfo = boardInfo;
      this.loadListRelevantData();
      this.isSelected = createProxyState(
        [this.taskPageViewModel.selectedBoardId],
        () => this.taskPageViewModel.selectedBoardId.value == this.boardInfo.fileId
      );
      this.color.subscribe(() => {
        if (this.isSelected.value == false) return;
        this.applyColor();
      });
      this.selectedPage.subscribeSilent(() => {
        this.storeLastUsedView();
      });
      boardModel.taskHandlerManager.addHandler(
        (taskFileContent) => {
          if (taskFileContent.boardId != this.boardInfo.fileId) return;
          this.showTaskInList(taskFileContent);
          this.updateTaskIndices();
        }
      );
    }
    storageModel;
    boardsAndTasksModel;
    taskPageViewModel;
    // data
    boardInfo;
    taskIndexManager = new IndexManager(
      (taskViewModel) => taskViewModel.sortingString
    );
    // state
    name = new State("");
    color = new State("standard" /* Standard */);
    index = new State(0);
    selectedPage = new State(
      "list" /* List */
    );
    selectedTaskViewModel = new State(void 0);
    isSelected;
    isPresentingSettingsModal = new State(false);
    isPresentingFilterModal = new State(false);
    taskViewModels = new MapState();
    filteredTaskViewModels = new ListState();
    // paths
    getBasePath = () => {
      return [...this.taskPageViewModel.getBoardViewPath(this.boardInfo.fileId)];
    };
    getLastUsedBoardPath = () => {
      return [...this.getBasePath(), "last-used-view" /* LastUsedView */];
    };
    // settings
    saveSettings = () => {
      const newBoardInfoFileContent = BoardsAndTasksModel.createBoardInfoFileContent(
        this.boardInfo.fileId,
        this.name.value,
        this.color.value
      );
      this.taskPageViewModel.updateBoard(newBoardInfoFileContent);
    };
    applyColor = () => {
      this.taskPageViewModel.chatViewModel.setDisplayedColor(this.color.value);
    };
    deleteBoard = () => {
      this.taskPageViewModel.deleteBoard(this.boardInfo);
      this.close();
    };
    // methods
    createTask = () => {
      const taskFileContent = this.boardsAndTasksModel.createTask(this.boardInfo.fileId);
      const taskViewModel = new TaskViewModel(
        this.coreViewModel,
        this.boardsAndTasksModel,
        this,
        null,
        taskFileContent
      );
      this.selectTask(taskViewModel);
      this.updateTaskIndices();
    };
    removeTaskFromList = (taskId) => {
      this.taskViewModels.remove(taskId);
      this.updateIndex();
    };
    handleDropWithinBoard = (category, status) => {
      const draggedObject = this.coreViewModel.draggedObject.value;
      if (draggedObject instanceof TaskViewModel == false) return;
      draggedObject.setCategoryAndStatus(category, status);
    };
    handleDropBetweenBoards = () => {
      const draggedObject = this.coreViewModel.draggedObject.value;
      if (draggedObject instanceof TaskViewModel == false) return;
      draggedObject.setBoardId(this.boardInfo.fileId);
    };
    // storage
    storeLastUsedView = () => {
      const path = this.getLastUsedBoardPath();
      const lastUsedView = this.selectedPage.value;
      this.storageModel.write(path, lastUsedView);
    };
    restoreLastUsedView = () => {
      const path = this.getLastUsedBoardPath();
      const lastUsedView = this.storageModel.read(path);
      if (lastUsedView == null) return;
      this.selectedPage.value = lastUsedView;
    };
    // view
    showTaskInList = (taskFileContent) => {
      if (taskFileContent.boardId != this.boardInfo.fileId) {
        this.boardsAndTasksModel.deleteTaskReference(
          this.boardInfo.fileId,
          taskFileContent.fileId
        );
        this.removeTaskFromList(taskFileContent.fileId);
        return;
      }
      const taskViewModel = new TaskViewModel(
        this.coreViewModel,
        this.boardsAndTasksModel,
        this,
        null,
        taskFileContent
      );
      this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
    };
    select = () => {
      this.taskPageViewModel.selectBoard(this);
    };
    close = () => {
      this.taskPageViewModel.closeBoard();
      this.taskViewModels.clear();
    };
    showSettings = () => {
      this.isPresentingSettingsModal.value = true;
    };
    hideSettings = () => {
      this.saveSettings();
      this.isPresentingSettingsModal.value = false;
    };
    showFilterModal = () => {
      this.isPresentingFilterModal.value = true;
    };
    hideFilterModal = () => {
      this.isPresentingFilterModal.value = false;
    };
    selectTask = (selectedTask) => {
      this.selectedTaskViewModel.value = selectedTask;
    };
    closeTask = () => {
      this.selectedTaskViewModel.value = void 0;
    };
    updateIndex = () => {
      const index = this.taskPageViewModel.boardIndexManager.getIndex(this);
      this.index.value = index;
    };
    updateTaskIndices = () => {
      this.taskIndexManager.update([...this.taskViewModels.value.values()]);
      for (const boardViewModel of this.taskViewModels.value.values()) {
        boardViewModel.updateIndex();
      }
    };
    // load
    loadListRelevantData = () => {
      this.name.value = this.boardInfo.name;
      this.color.value = this.boardInfo.color;
    };
    loadTasks = () => {
      const taskIds = this.boardsAndTasksModel.listTaskIds(
        this.boardInfo.fileId
      );
      for (const taskId of taskIds) {
        if (this.taskViewModels.value.has(taskId)) return;
        const taskFileContent = this.boardsAndTasksModel.getLatestTaskFileContent(taskId);
        if (taskFileContent == null) continue;
        const taskViewModel = new TaskViewModel(
          this.coreViewModel,
          this.boardsAndTasksModel,
          this,
          null,
          taskFileContent
        );
        this.taskViewModels.set(taskFileContent.fileId, taskViewModel);
      }
      this.updateTaskIndices();
    };
    loadData = () => {
      this.restoreLastUsedView();
      this.loadTasks();
    };
  };

  // src/ViewModel/Pages/taskPageViewModel.ts
  var TaskPageViewModel = class {
    // init
    constructor(coreViewModel, storageModel2, boardModel, chatViewModel) {
      this.coreViewModel = coreViewModel;
      this.storageModel = storageModel2;
      this.boardsAndTasksModel = boardModel;
      this.chatViewModel = chatViewModel;
      boardModel.boardHandlerManager.addHandler(
        (boardInfoFileContent) => {
          this.showBoardInList(boardInfoFileContent);
          this.updateBoardIndices();
        }
      );
    }
    storageModel;
    boardsAndTasksModel;
    chatViewModel;
    // data
    boardIndexManager = new IndexManager(
      (boardViewModel) => boardViewModel.name.value
    );
    // paths
    getBasePath = () => {
      return [...this.boardsAndTasksModel.getViewPath()];
    };
    getBoardViewPath = (boardId) => {
      return [...this.getBasePath(), boardId];
    };
    getLastUsedBoardPath = () => {
      return [...this.getBasePath(), "last-used-board" /* LastUsedBoard */];
    };
    // state
    newBoardNameInput = new State("");
    boardViewModels = new MapState();
    selectedBoardId = new State(
      void 0
    );
    // guards
    cannotCreateBoard = createProxyState(
      [this.newBoardNameInput],
      () => this.newBoardNameInput.value == ""
    );
    // methods
    createBoard = () => {
      if (this.cannotCreateBoard.value == true) return;
      const boardInfoFileContent = this.boardsAndTasksModel.createBoard(this.newBoardNameInput.value);
      this.newBoardNameInput.value = "";
      this.showBoardInList(boardInfoFileContent);
      this.boardsAndTasksModel.updateBoardAndSend(boardInfoFileContent);
      this.updateBoardIndices();
    };
    updateBoard = (boardInfoFileContent) => {
      this.boardsAndTasksModel.updateBoardAndSend(boardInfoFileContent);
      this.updateBoardIndices();
    };
    deleteBoard = (boardInfoFileContent) => {
      this.boardsAndTasksModel.deleteBoard(boardInfoFileContent.fileId);
      this.boardViewModels.remove(boardInfoFileContent.fileId);
      this.updateBoardIndices();
    };
    // view
    showBoardInList = (boardInfo) => {
      const boardViewModel = new BoardViewModel(
        this.coreViewModel,
        this.storageModel,
        this.boardsAndTasksModel,
        this,
        boardInfo
      );
      this.boardViewModels.set(boardInfo.fileId, boardViewModel);
    };
    selectBoard = (boardViewModel) => {
      this.selectedBoardId.value = boardViewModel.boardInfo.fileId;
      this.chatViewModel.displayedColor.value = boardViewModel.color.value;
      this.storeLastUsedBoard();
    };
    closeBoard = () => {
      this.selectedBoardId.value = void 0;
      this.chatViewModel.resetColor();
      this.storeLastUsedBoard();
    };
    updateBoardIndices = () => {
      this.boardIndexManager.update([...this.boardViewModels.value.values()]);
      for (const boardViewModel of this.boardViewModels.value.values()) {
        boardViewModel.updateIndex();
      }
    };
    // storage
    storeLastUsedBoard = () => {
      const path = this.getLastUsedBoardPath();
      const lastUsedBoardId = this.selectedBoardId.value ?? "";
      this.storageModel.write(path, lastUsedBoardId);
    };
    openLastUsedBoard = () => {
      const path = this.getLastUsedBoardPath();
      const lastUsedBoardId = this.storageModel.read(path);
      if (lastUsedBoardId == null) return;
      const boardViewModel = this.boardViewModels.value.get(lastUsedBoardId);
      if (boardViewModel == void 0) return;
      this.selectBoard(boardViewModel);
    };
    // load
    loadData = () => {
      this.boardViewModels.clear();
      const boardIds = this.boardsAndTasksModel.listBoardIds();
      for (const boardId of boardIds) {
        const boardInfo = this.boardsAndTasksModel.getBoardInfo(boardId);
        if (boardInfo == null) continue;
        this.showBoardInList(boardInfo);
      }
      this.updateBoardIndices();
      this.openLastUsedBoard();
    };
  };

  // src/ViewModel/Chat/chatViewModel.ts
  var ChatViewModel = class {
    // init
    constructor(coreViewModel, storageModel2, chatModel, settingsViewModel2, chatListViewModel2) {
      this.coreViewModel = coreViewModel;
      this.storageModel = storageModel2;
      this.chatModel = chatModel;
      this.settingsViewModel = settingsViewModel2;
      this.chatListViewModel = chatListViewModel2;
      this.calendarViewModel = new CalendarPageViewModel(
        coreViewModel,
        this.storageModel,
        this.chatModel.fileModel.boardsAndTasksModel.calendarModel,
        this.chatModel.fileModel.boardsAndTasksModel
      );
      this.taskPageViewModel = new TaskPageViewModel(
        this.coreViewModel,
        this.storageModel,
        this.chatModel.fileModel.boardsAndTasksModel,
        this
      );
      this.messagePageViewModel = new MessagePageViewModel(
        this.coreViewModel,
        this
      );
      this.settingsPageViewModel = new SettingsPageViewModel(
        this.coreViewModel,
        this
      );
      chatModel.chatMessageHandlerManager.addHandler(
        (chatMessage) => {
          this.messagePageViewModel.showChatMessage(chatMessage);
        }
      );
      this.loadPageSelection();
      this.resetColor();
    }
    chatModel;
    storageModel;
    settingsViewModel;
    chatListViewModel;
    calendarViewModel;
    taskPageViewModel;
    messagePageViewModel;
    settingsPageViewModel;
    // state
    displayedColor = new State("standard" /* Standard */);
    selectedPage = new State(
      "messages" /* Messages */
    );
    index = new State(0);
    // view
    open = () => {
      this.chatListViewModel.openChat(this);
    };
    close = () => {
      this.chatListViewModel.closeChat();
    };
    closeSubPages = () => {
    };
    setColor = (color) => {
      this.setDisplayedColor(color);
      this.chatModel.setColor(color);
    };
    setDisplayedColor = (color) => {
      this.displayedColor.value = color;
    };
    resetColor = () => {
      this.displayedColor.value = this.settingsPageViewModel.color.value;
    };
    updateIndex = () => {
      const index = this.chatListViewModel.chatIndexManager.getIndex(this);
      this.index.value = index;
    };
    // load
    loadPageSelection = () => {
      const path = StorageModel.getPath(
        "chat" /* Chat */,
        filePaths.chat.lastUsedPage(this.chatModel.id)
      );
      const lastUsedPage = this.storageModel.read(path);
      if (lastUsedPage != null) {
        this.selectedPage.value = lastUsedPage;
      }
      this.selectedPage.subscribeSilent((newPage) => {
        this.storageModel.write(path, newPage);
        this.resetColor();
      });
    };
  };

  // src/ViewModel/Chat/chatListViewModel.ts
  var ChatListViewModel = class {
    // init
    constructor(coreViewModel, storageModel2, chatListModel2, settingsViewModel2) {
      this.coreViewModel = coreViewModel;
      this.storageModel = storageModel2;
      this.chatListModel = chatListModel2;
      this.settingsViewModel = settingsViewModel2;
      this.loadChats();
    }
    storageModel;
    chatListModel;
    settingsViewModel;
    // data
    chatIndexManager = new IndexManager(
      (chatViewModel) => chatViewModel.settingsPageViewModel.primaryChannel.value
    );
    // state
    newChatPrimaryChannel = new State("");
    chatViewModels = new ListState();
    selectedChat = new State(
      void 0
    );
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
      this.trackChat(chatViewModel);
      this.updateIndices();
    };
    trackChat = (chatViewModel) => {
      this.chatViewModels.add(chatViewModel);
    };
    untrackChat = (chatViewModel) => {
      this.chatListModel.untrackChat(chatViewModel.chatModel);
      this.chatViewModels.remove(chatViewModel);
    };
    createChatViewModel = (chatModel) => {
      return new ChatViewModel(
        this.coreViewModel,
        this.storageModel,
        chatModel,
        this.settingsViewModel,
        this
      );
    };
    updateIndices = () => {
      this.chatIndexManager.update([...this.chatViewModels.value.values()]);
      for (const chatViewModel of this.chatViewModels.value) {
        chatViewModel.updateIndex();
      }
    };
    // view
    openChat = (chatViewModel) => {
      this.selectedChat.value = chatViewModel;
    };
    closeChat = () => {
      this.selectedChat.value = void 0;
    };
    // load
    loadChats = () => {
      this.chatViewModels.clear();
      for (const chatModel of this.chatListModel.chatModels.values()) {
        const chatViewModel = this.createChatViewModel(chatModel);
        this.trackChat(chatViewModel);
      }
      this.updateIndices();
    };
  };

  // src/View/Components/monthGrid.tsx
  function MonthGrid2(monthGrid) {
    const offsetElements = [];
    for (let i = 0; i < monthGrid.offset; i++) {
      offsetElements.push(/* @__PURE__ */ createElement("div", null));
    }
    const converter = (taskViewModel) => {
      return /* @__PURE__ */ createElement("span", { class: "ellipsis secondary" }, taskViewModel.task.name);
    };
    return /* @__PURE__ */ createElement("div", { class: "month-grid-wrapper" }, ...offsetElements, ...Object.entries(monthGrid.days).map((entry) => {
      const [date, mapState] = entry;
      return /* @__PURE__ */ createElement("button", { class: "tile" }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", null, date), /* @__PURE__ */ createElement(
        "div",
        {
          class: "flex-column gap clip",
          "children:append": [mapState, converter]
        }
      )));
    }));
  }

  // src/View/translations.ts
  var englishTranslations = {
    general: {
      deleteItemButtonAudioLabel: "delete item",
      searchButtonAudioLabel: "search",
      abortButton: "Abort",
      closeButton: "Close",
      confirmButton: "Confirm",
      saveButton: "Save",
      setButton: "Set",
      fileVersionLabel: "Version",
      searchLabel: "Search"
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
        tasks: "Tasks",
        calendar: "Calendar"
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
        messagesHeadline: "Messages",
        ///
        composerInputPlaceholder: "Type a message...",
        sendMessageButtonAudioLabel: "send message",
        ///
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
      },
      task: {
        newBoardNamePlaceholder: "Create a board",
        createBoardButtonAudioLabel: "create board",
        ///
        noBoardSelected: "No board selected",
        boardNotFound: "Board not found",
        ///
        closeBoard: "close board",
        showBoardSettingsButtonAudioLabel: "show board settigns",
        listViewButtonAudioLabel: "list view",
        kanbanViewButtonAudioLabel: "kanban view",
        statusViewButtonAudioLabel: "status grid view",
        filterTasksButtonAudioLabel: "filter tasks",
        createTaskButtonAudioLabel: "create new task",
        ///
        boardSettingsHeadline: "Board Settings",
        boardNameInputLabel: "Board name",
        deleteBoardButton: "Delete board and all tasks",
        ///
        taskSettingsHeadline: "Edit Task",
        taskNameLabel: "Title",
        taskCategoryLabel: "Category",
        taskStatusLabel: "Status",
        taskPriorityLabel: "Priority",
        taskDescriptionLabel: "Description",
        taskDateLabel: "Date",
        taskTimeLabel: "Time",
        deleteTaskButton: "Delete task",
        ///
        filterTasksHeadline: "Filter Tasks",
        ///
        renameCategoryInputPlaceholder: "Rename category,"
      },
      calendar: {
        todayButtonAudioLabel: "go to today",
        previousMonthButtonAudioLabel: "previous month",
        nextMonthButtonAudioLabel: "next month",
        yearInputAudioLabel: "year",
        monthInputAudioLabel: "month",
        yearInputPlaceholder: "2000",
        monthInputPlaceholder: "01"
      }
    }
  };
  var allTranslations = {
    en: englishTranslations
  };
  var language = navigator.language.substring(0, 2);
  var translations = allTranslations[language] || allTranslations.en;

  // src/View/ChatPages/calendarPage.tsx
  function CalendarPage(calendarPageViewModel) {
    calendarPageViewModel.loadData();
    const mainContent = createProxyState(
      [calendarPageViewModel.monthGrid],
      () => {
        if (calendarPageViewModel.monthGrid.value == void 0) {
          return /* @__PURE__ */ createElement("div", null);
        } else {
          return MonthGrid2(calendarPageViewModel.monthGrid.value);
        }
      }
    );
    return /* @__PURE__ */ createElement("div", { id: "calendar-page" }, /* @__PURE__ */ createElement("div", { class: "pane-wrapper" }, /* @__PURE__ */ createElement("div", { class: "pane" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.calendar.todayButtonAudioLabel,
        "on:click": calendarPageViewModel.showToday
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "today")
    )), /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.calendar.previousMonthButtonAudioLabel,
        "on:click": calendarPageViewModel.showPreviousMonth
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_back")
    ), /* @__PURE__ */ createElement("span", { class: "input-wrapper" }, /* @__PURE__ */ createElement(
      "input",
      {
        class: "year-input",
        type: "number",
        "aria-label": translations.chatPage.calendar.yearInputAudioLabel,
        placeholder: translations.chatPage.calendar.yearInputPlaceholder,
        "bind:value": calendarPageViewModel.selectedYear
      }
    ), /* @__PURE__ */ createElement(
      "input",
      {
        class: "month-input",
        type: "number",
        "aria-label": translations.chatPage.calendar.monthInputAudioLabel,
        placeholder: translations.chatPage.calendar.monthInputPlaceholder,
        "bind:value": calendarPageViewModel.selectedMonth
      }
    )), /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.calendar.nextMonthButtonAudioLabel,
        "on:click": calendarPageViewModel.showNextMonth
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_forward")
    )), /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.task.createTaskButtonAudioLabel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    ))), /* @__PURE__ */ createElement("div", { class: "content", "children:set": mainContent }))));
  }

  // src/View/Components/ribbonButton.tsx
  function RibbonButton(label, icon, isSelected, select) {
    return /* @__PURE__ */ createElement(
      "button",
      {
        class: "ribbon-button",
        "aria-label": label,
        "toggle:selected": isSelected,
        "on:click": select
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, icon)
    );
  }

  // src/View/Components/chatViewToggleButton.tsx
  function ChatViewToggleButton(label, icon, page, chatViewModel) {
    function select() {
      chatViewModel.selectedPage.value = page;
    }
    const isSelected = createProxyState(
      [chatViewModel.selectedPage],
      () => chatViewModel.selectedPage.value == page
    );
    return RibbonButton(label, icon, isSelected, select);
  }

  // src/View/Modals/chatMessageInfoModal.tsx
  function ChatMessageInfoModal(chatMessageViewModel) {
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": chatMessageViewModel.isPresentingInfoModal }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translations.chatPage.message.messageInfoHeadline), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "account_circle"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.sentBy), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.sender))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "schedule"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.timeSent), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.dateSent))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.channel), /* @__PURE__ */ createElement("b", { class: "break-word" }, chatMessageViewModel.channel))), /* @__PURE__ */ createElement("div", { class: "tile" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "description"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.message.messageContent), /* @__PURE__ */ createElement(
      "b",
      {
        class: "break-word",
        "subscribe:innerText": chatMessageViewModel.body
      }
    )))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-column gap" }, /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.copyMessage }, translations.chatPage.message.copyMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "content_copy")), /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.resendMessage }, translations.chatPage.message.resendMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "redo")), /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.decryptMessage }, translations.chatPage.message.decryptMessageButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "key")))), /* @__PURE__ */ createElement("button", { "on:click": chatMessageViewModel.hideInfoModal }, translations.general.closeButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/View/Components/chatMessage.tsx
  function ChatMessage2(chatMessageViewModel) {
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
          "on:click": chatMessageViewModel.showInfoModal,
          "aria-label": translations.chatPage.message.showMessageInfoButtonAudioLabel
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "info")
      ))),
      ChatMessageInfoModal(chatMessageViewModel)
    );
  }
  var ChatMessageViewModelToView = (chatMessageViewModel) => {
    return ChatMessage2(chatMessageViewModel);
  };

  // src/View/ChatPages/messagePage.tsx
  function MessagePage(messagePageViewModel) {
    messagePageViewModel.loadData();
    const messageContainer = /* @__PURE__ */ createElement(
      "div",
      {
        id: "message-container",
        "children:append": [
          messagePageViewModel.chatMessageViewModels,
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
    messagePageViewModel.chatMessageViewModels.subscribeSilent(
      scrollDownIfApplicable
    );
    setTimeout(() => scrollDown(), 100);
    return /* @__PURE__ */ createElement("div", { id: "message-page" }, /* @__PURE__ */ createElement("div", { class: "pane-wrapper" }, /* @__PURE__ */ createElement("div", { class: "pane" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", { class: "title" }, translations.chatPage.message.messagesHeadline)), /* @__PURE__ */ createElement("div", { class: "content" }, messageContainer, /* @__PURE__ */ createElement("div", { id: "composer" }, /* @__PURE__ */ createElement("div", { class: "content-width-constraint" }, /* @__PURE__ */ createElement("div", { class: "input-width-constraint" }, /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": messagePageViewModel.composingMessage,
        "on:enter": messagePageViewModel.sendMessage,
        placeholder: translations.chatPage.message.composerInputPlaceholder
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.chatPage.message.sendMessageButtonAudioLabel,
        "on:click": messagePageViewModel.sendMessage,
        "toggle:disabled": messagePageViewModel.cannotSendMessage
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "send")
    ))))))));
  }

  // src/View/Components/colorPicker.tsx
  function ColorPicker(selectedColor) {
    return /* @__PURE__ */ createElement("div", { class: "flex-row gap width-input" }, ...Object.values(Color).map((color) => {
      const isSelected = createProxyState(
        [selectedColor],
        () => selectedColor.value == color
      );
      function setColor() {
        selectedColor.value = color;
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
    }));
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
  function SettingsPage(settingsPageViewModel) {
    settingsPageViewModel.loadData();
    const secondaryChannelConverter = (secondaryChannel) => {
      return DeletableListItem(secondaryChannel, /* @__PURE__ */ createElement("span", null), () => {
        settingsPageViewModel.removeSecondaryChannel(secondaryChannel);
      });
    };
    return /* @__PURE__ */ createElement("div", { id: "settings-page" }, /* @__PURE__ */ createElement("div", { class: "pane-wrapper" }, /* @__PURE__ */ createElement("div", { class: "pane" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", { class: "title" }, translations.chatPage.settings.settingsHeadline)), /* @__PURE__ */ createElement("div", { class: "content" }, /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.settings.primaryChannelLabel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": settingsPageViewModel.primaryChannelInput,
        "on:enter": settingsPageViewModel.setPrimaryChannel
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "aria-label": translations.chatPage.settings.setPrimaryChannelButtonAudioLabel,
        "on:click": settingsPageViewModel.setPrimaryChannel,
        "toggle:disabled": settingsPageViewModel.cannotSetPrimaryChannel
      },
      translations.general.setButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "flex-row width-input margin-bottom" }, /* @__PURE__ */ createElement(
      "input",
      {
        "aria-label": translations.chatPage.settings.newSecondaryChannelAudioLabel,
        placeholder: translations.chatPage.settings.newSecondaryChannelPlaceholder,
        "bind:value": settingsPageViewModel.newSecondaryChannelInput,
        "on:enter": settingsPageViewModel.addSecondaryChannel
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.chatPage.settings.addSecondaryChannelButtonAudioLabel,
        "on:click": settingsPageViewModel.addSecondaryChannel,
        "toggle:disabled": settingsPageViewModel.cannotAddSecondaryChannel
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    )), /* @__PURE__ */ createElement(
      "div",
      {
        class: "flex-column gap width-input",
        "children:append": [
          settingsPageViewModel.secondaryChannels,
          secondaryChannelConverter
        ]
      }
    ), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "key"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.settings.encryptionKeyLabel), /* @__PURE__ */ createElement(
      "input",
      {
        "bind:value": settingsPageViewModel.encryptionKeyInput,
        "on:enter": settingsPageViewModel.setEncryptionKey,
        "set:type": settingsPageViewModel.encryptionKeyInputType
      }
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row justify-end width-input" }, /* @__PURE__ */ createElement(
      "button",
      {
        class: "width-50",
        "aria-label": translations.chatPage.settings.setEncryptionKeyButtonAudioLabel,
        "on:click": settingsPageViewModel.setEncryptionKey,
        "toggle:disabled": settingsPageViewModel.cannotSetEncryptionKey
      },
      translations.general.setButton,
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )), /* @__PURE__ */ createElement("label", { class: "inline" }, /* @__PURE__ */ createElement(
      "input",
      {
        type: "checkbox",
        "bind:checked": settingsPageViewModel.shouldShowEncryptionKey
      }
    ), translations.chatPage.settings.showEncryptionKey), /* @__PURE__ */ createElement("hr", null), ColorPicker(settingsPageViewModel.color), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "width-input" }, DangerousActionButton(
      translations.chatPage.settings.deleteChatButton,
      "chat_error",
      settingsPageViewModel.remove
    ))))));
  }

  // src/View/Components/propertyValueList.tsx
  function PropertyValueList(propertyKey, stringEntryObjectConverter, objects, viewBuilder) {
    const propertyValues = new ListState();
    const sortedPropertyValues = createSortedPropertyValueState(propertyValues);
    objects.subscribe(() => {
      collectPropertyValuesToState(
        propertyKey,
        stringEntryObjectConverter,
        objects,
        propertyValues
      );
    });
    return viewBuilder(propertyValues, sortedPropertyValues);
  }
  function collectPropertyValuesToState(propertyKey, stringEntryObjectConverter, objects, propertyValues) {
    const values = collectObjectValuesForKey(
      propertyKey,
      stringEntryObjectConverter,
      [...objects.value.values()]
    );
    for (const existingValue of values) {
      if (propertyValues.value.has(existingValue)) continue;
      propertyValues.add(existingValue);
    }
    for (const displayedValue of propertyValues.value.values()) {
      if (values.includes(displayedValue) == false) {
        propertyValues.remove(displayedValue);
      }
    }
  }
  function createSortedPropertyValueState(propertyValues) {
    return createProxyState(
      [propertyValues],
      () => [...propertyValues.value.values()].sort(localeCompare)
    );
  }
  function createPropertyValueIndexState(sortedKeys, key) {
    return createProxyState(
      [sortedKeys],
      () => sortedKeys.value.indexOf(key)
    );
  }

  // src/View/Components/filteredList.tsx
  function FilteredList(reference, stringEntryObjectConverter, objects, viewBuilder) {
    const matchingObjects = new ListState();
    objects.handleAddition((newObject) => {
      const doesMatch = checkDoesObjectMatchReference(
        reference,
        stringEntryObjectConverter(newObject)
      );
      if (doesMatch == false) return;
      matchingObjects.add(newObject);
      objects.handleRemoval(newObject, () => {
        matchingObjects.remove(newObject);
      });
    });
    return viewBuilder(matchingObjects);
  }

  // src/ViewModel/Utility/taskPropertyBulkChangeViewModel.ts
  var TaskPropertyBulkChangeViewModel = class {
    taskViewModels;
    // state
    inputValue = new State("");
    // guards
    cannotSet;
    // methods
    set = () => {
      if (this.cannotSet.value == true) return;
      this.taskViewModels.value.forEach((taskViewModel) => {
        this.setValue(this.inputValue.value, taskViewModel);
      });
    };
    setValue;
    // init
    constructor(taskViewModels, valueSetter, initialValue) {
      this.taskViewModels = taskViewModels;
      this.inputValue.value = initialValue;
      this.setValue = valueSetter;
      this.cannotSet = createProxyState(
        [this.inputValue],
        () => this.inputValue.value == "" || this.inputValue.value == initialValue
      );
    }
  };
  var TaskCategoryBulkChangeViewModel = class extends TaskPropertyBulkChangeViewModel {
    constructor(taskViewModels, initialValue) {
      super(
        taskViewModels,
        (newCategory, taskViewModel) => {
          taskViewModel.category.value = newCategory;
          taskViewModel.save();
        },
        initialValue
      );
    }
  };
  var TaskStatusBulkChangeViewModel = class extends TaskPropertyBulkChangeViewModel {
    constructor(taskViewModels, initialValue) {
      super(
        taskViewModels,
        (newStatus, taskViewModel) => {
          taskViewModel.status.value = newStatus;
          taskViewModel.save();
        },
        initialValue
      );
    }
  };

  // src/View/Components/taskEntry.tsx
  function TaskEntry(taskViewModel) {
    const details = {
      description: taskViewModel.description.value || "---",
      priority_high: taskViewModel.priority.value || "---",
      category: taskViewModel.category.value || "---",
      clock_loader_40: taskViewModel.status.value || "---",
      calendar_month: taskViewModel.date.value || "---",
      schedule: taskViewModel.time.value || "---"
    };
    const view = /* @__PURE__ */ createElement(
      "button",
      {
        draggable: "true",
        class: "tile flex-no",
        style: "user-select: none; -webkit-user-select: none",
        "on:click": taskViewModel.open,
        "on:dragstart": taskViewModel.dragStart
      },
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("b", { "subscribe:innerText": taskViewModel.name }), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
        "div",
        {
          class: "grid secondary",
          style: "grid-template-columns: repeat(2, 1fr); column-gap: 1rem;  row-gap: .5rem"
        },
        ...Object.entries(details).map((entry) => /* @__PURE__ */ createElement(
          "span",
          {
            class: "flex-row align-center width-100 flex-no clip",
            style: "gap: 1rem"
          },
          /* @__PURE__ */ createElement("span", { class: "icon", style: "font-size: 1.1rem" }, entry[0]),
          /* @__PURE__ */ createElement("span", { class: "ellipsis" }, entry[1])
        ))
      ))
    );
    taskViewModel.index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });
    return view;
  }
  var TaskViewModelToEntry = (taskViewModel) => {
    return TaskEntry(taskViewModel);
  };

  // src/View/ChatPages/boardKanbanPage.tsx
  function BoardKanbanPage(boardViewModel) {
    return PropertyValueList(
      "category",
      (taskViewModel) => taskViewModel.task,
      boardViewModel.taskViewModels,
      (categories, sortedCategories) => {
        const categoryNameConverter = (categoryName) => {
          const index = createPropertyValueIndexState(
            sortedCategories,
            categoryName
          );
          return KanbanBoard(categoryName, index, boardViewModel);
        };
        return /* @__PURE__ */ createElement(
          "div",
          {
            class: "kanban-board-wrapper",
            "children:append": [categories, categoryNameConverter]
          }
        );
      }
    );
  }
  function KanbanBoard(categoryName, index, boardViewModel) {
    return FilteredList(
      { category: categoryName },
      (taskViewModel) => taskViewModel.task,
      boardViewModel.filteredTaskViewModels,
      (taskViewModels) => {
        const viewModel = new TaskCategoryBulkChangeViewModel(taskViewModels, categoryName);
        function drop() {
          boardViewModel.handleDropWithinBoard(categoryName);
        }
        const view = /* @__PURE__ */ createElement("div", { class: "flex-column flex-no", "on:dragover": allowDrop, "on:drop": drop }, /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
          "input",
          {
            placeholder: translations.chatPage.task.renameCategoryInputPlaceholder,
            "bind:value": viewModel.inputValue,
            "on:enter": viewModel.set
          }
        ), /* @__PURE__ */ createElement(
          "button",
          {
            class: "primary",
            "on:click": viewModel.set,
            "toggle:disabled": viewModel.cannotSet
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
        )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
          "div",
          {
            class: "kanban-column",
            "children:append": [taskViewModels, TaskViewModelToEntry]
          }
        ));
        index.subscribe((newIndex) => {
          view.style.order = newIndex;
        });
        return view;
      }
    );
  }

  // src/View/Modals/boardSettingsModal.tsx
  function BoardSettingsModal(boardViewModel) {
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": boardViewModel.isPresentingSettingsModal }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translations.chatPage.task.boardSettingsHeadline), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "label"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.boardNameInputLabel), /* @__PURE__ */ createElement(
      "input",
      {
        "on:enter": boardViewModel.saveSettings,
        "bind:value": boardViewModel.name
      }
    ))), /* @__PURE__ */ createElement("hr", null), ColorPicker(boardViewModel.color), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "width-input" }, DangerousActionButton(
      translations.chatPage.task.deleteBoardButton,
      "delete_forever",
      boardViewModel.deleteBoard
    ))), /* @__PURE__ */ createElement("button", { "on:click": boardViewModel.hideSettings }, translations.general.closeButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/View/ChatPages/boardStatusGridPage.tsx
  function BoardStatusGridPage(boardViewModel) {
    const statuses = new ListState();
    const sortedStatuses = createSortedPropertyValueState(statuses);
    boardViewModel.taskViewModels.subscribe(() => {
      collectPropertyValuesToState(
        "status",
        (taskViewModel) => taskViewModel.task,
        boardViewModel.taskViewModels,
        statuses
      );
    });
    const statusNameCellConverter = (statusName) => {
      const index = createPropertyValueIndexState(sortedStatuses, statusName);
      return StatusNameCell(statusName, index, boardViewModel);
    };
    return /* @__PURE__ */ createElement("div", { class: "status-page-content" }, /* @__PURE__ */ createElement(
      "div",
      {
        class: "status-name-row",
        "children:append": [statuses, statusNameCellConverter]
      }
    ), PropertyValueList(
      "category",
      (taskViewModel) => taskViewModel.task,
      boardViewModel.filteredTaskViewModels,
      (categories, sortedCategories) => {
        const categoryRowConverter = (categoryName) => {
          const index = createPropertyValueIndexState(
            sortedCategories,
            categoryName
          );
          return CategoryRow(
            categoryName,
            index,
            statuses,
            sortedStatuses,
            boardViewModel
          );
        };
        return /* @__PURE__ */ createElement(
          "div",
          {
            class: "status-grid-wrapper",
            "children:append": [categories, categoryRowConverter]
          }
        );
      }
    ));
  }
  function StatusNameCell(statusName, index, boardViewModel) {
    const taskViewModelsWithMatchingStatus = new ListState();
    boardViewModel.taskViewModels.handleAddition(
      (taskViewModel) => {
        const doesMatchStatus = taskViewModel.task.status == statusName;
        if (doesMatchStatus == false) return;
        taskViewModelsWithMatchingStatus.add(taskViewModel);
        boardViewModel.taskViewModels.handleRemoval(taskViewModel, () => {
          taskViewModelsWithMatchingStatus.remove(taskViewModel);
        });
      }
    );
    const viewModel = new TaskStatusBulkChangeViewModel(
      taskViewModelsWithMatchingStatus,
      statusName
    );
    const view = /* @__PURE__ */ createElement("div", { class: "flex-row" }, /* @__PURE__ */ createElement("div", { class: "property-input-wrapper" }, /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translations.chatPage.task.renameCategoryInputPlaceholder,
        "bind:value": viewModel.inputValue,
        "on:enter": viewModel.set
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "on:click": viewModel.set,
        "toggle:disabled": viewModel.cannotSet
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
    )));
    index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });
    return view;
  }
  function CategoryRow(categoryName, index, allStatuses, sortedStatuses, boardViewModel) {
    return FilteredList(
      { category: categoryName },
      (taskViewModel) => taskViewModel.task,
      boardViewModel.taskViewModels,
      (taskViewModels) => {
        const statusNameConverter = (statusName) => {
          const index2 = createPropertyValueIndexState(sortedStatuses, statusName);
          return CategoryStatusColumn(
            categoryName,
            statusName,
            index2,
            boardViewModel,
            taskViewModels
          );
        };
        const viewModel = new TaskCategoryBulkChangeViewModel(taskViewModels, categoryName);
        const view = /* @__PURE__ */ createElement("div", { class: "flex-row flex-no large-gap" }, /* @__PURE__ */ createElement("div", { class: "property-input-wrapper" }, /* @__PURE__ */ createElement(
          "input",
          {
            placeholder: translations.chatPage.task.renameCategoryInputPlaceholder,
            "bind:value": viewModel.inputValue,
            "on:enter": viewModel.set
          }
        ), /* @__PURE__ */ createElement(
          "button",
          {
            class: "primary",
            "on:click": viewModel.set,
            "toggle:disabled": viewModel.cannotSet
          },
          /* @__PURE__ */ createElement("span", { class: "icon" }, "check")
        )), /* @__PURE__ */ createElement(
          "div",
          {
            class: "flex-row large-gap padding-right",
            "children:append": [allStatuses, statusNameConverter]
          }
        ));
        index.subscribe((newIndex) => {
          view.style.order = newIndex;
        });
        return view;
      }
    );
  }
  function CategoryStatusColumn(categoryName, statusName, index, boardViewModel, taskViewModelsWithMatchingCategory) {
    const taskViewModels = new ListState();
    taskViewModelsWithMatchingCategory.handleAddition((taskViewModel) => {
      const doesMatchStatus = taskViewModel.status.value == statusName;
      if (doesMatchStatus == false) return;
      taskViewModels.add(taskViewModel);
      taskViewModelsWithMatchingCategory.handleRemoval(taskViewModel, () => {
        taskViewModels.remove(taskViewModel);
      });
    });
    function drop() {
      boardViewModel.handleDropWithinBoard(categoryName, statusName);
    }
    const view = /* @__PURE__ */ createElement(
      "div",
      {
        class: "status-column gap",
        "on:dragover": allowDrop,
        "on:drop": drop,
        "children:append": [taskViewModels, TaskViewModelToEntry]
      }
    );
    index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });
    return view;
  }

  // src/View/Components/boardViewToggleButton.tsx
  function BoardViewToggleButton(label, icon, page, boardViewModel) {
    function select() {
      boardViewModel.selectedPage.value = page;
    }
    const isSelected = createProxyState(
      [boardViewModel.selectedPage],
      () => boardViewModel.selectedPage.value == page
    );
    return RibbonButton(label, icon, isSelected, select);
  }

  // src/ViewModel/Utility/searchViewModel.ts
  var SearchViewModel = class {
    // data
    allObjects;
    getStringsOfObject;
    // state
    appliedQuery = new State("");
    searchInput = new State("");
    matchingObjects;
    // guards
    cannotApplySearch = createProxyState(
      [this.searchInput, this.appliedQuery],
      () => this.searchInput.value == this.appliedQuery.value
    );
    // methods
    applySearch = () => {
      this.appliedQuery.value = this.searchInput.value;
      console.log("applying search");
      this.matchingObjects.clear();
      for (const object of this.allObjects.value.values()) {
        const doesMatch = this.checkDoesMatchSearch(object);
        if (doesMatch == false) continue;
        this.matchingObjects.add(object);
      }
    };
    // init
    constructor(allObjects, matchingObjects, getStringsOfObject) {
      this.allObjects = allObjects;
      this.matchingObjects = matchingObjects;
      this.getStringsOfObject = getStringsOfObject;
      this.allObjects.handleAddition((newObject) => {
        const doesMatch = this.checkDoesMatchSearch(newObject);
        if (doesMatch == false) {
          this.matchingObjects.remove(newObject);
        } else {
          if (this.matchingObjects.value.has(newObject)) return;
          this.matchingObjects.add(newObject);
          this.allObjects.handleRemoval(newObject, () => {
            this.matchingObjects.remove(newObject);
          });
        }
      });
    }
    // utility
    checkDoesMatchSearch = (object) => {
      return checkDoesObjectMatchSearch(
        this.appliedQuery.value,
        this.getStringsOfObject,
        object
      );
    };
  };

  // src/View/Modals/searchModal.tsx
  function SearchModal(headline, allObjects, filteredObjects, converter, getStringsOfObject, isOpen) {
    const viewModel = new SearchViewModel(
      allObjects,
      filteredObjects,
      getStringsOfObject
    );
    function close() {
      isOpen.value = false;
    }
    return /* @__PURE__ */ createElement("div", { class: "modal", "toggle:open": isOpen }, /* @__PURE__ */ createElement("div", { style: "max-width: 64rem" }, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, headline), /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
      "input",
      {
        placeholder: translations.general.searchLabel,
        "bind:value": viewModel.searchInput,
        "on:enter": viewModel.applySearch
      }
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "primary",
        "aria-label": translations.general.searchButtonAudioLabel,
        "on:click": viewModel.applySearch,
        "toggle:disabled": viewModel.cannotApplySearch
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "search")
    )), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement(
      "div",
      {
        class: "grid gap",
        "children:append": [filteredObjects, converter]
      }
    )), /* @__PURE__ */ createElement("button", { "on:click": close }, translations.general.closeButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "close"))));
  }

  // src/View/Components/option.tsx
  function Option(text, value, selectedOnCreate) {
    return /* @__PURE__ */ createElement("option", { value, "toggle:selected": selectedOnCreate }, text);
  }
  var StringToOption = (string) => {
    return Option(string, string, false);
  };
  var VersionIdToOption = (versionId) => {
    const [date, rest] = versionId.split("T");
    const [time] = rest.split(".");
    const readableName = `${date} ${time}`;
    return Option(readableName, versionId, false);
  };

  // src/View/Modals/taskSettingsModal.tsx
  function TaskSettingsModal(taskViewModel) {
    return /* @__PURE__ */ createElement("div", { class: "modal", open: true }, /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("main", null, /* @__PURE__ */ createElement("h2", null, translations.chatPage.task.taskSettingsHeadline), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "history"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.general.fileVersionLabel), /* @__PURE__ */ createElement(
      "select",
      {
        "bind:value": taskViewModel.selectedVersionId,
        "children:append": [taskViewModel.versionIds, VersionIdToOption]
      }
    ), /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_drop_down"))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "label"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskNameLabel), /* @__PURE__ */ createElement("input", { "bind:value": taskViewModel.name }))), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "description"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskDescriptionLabel), /* @__PURE__ */ createElement(
      "textarea",
      {
        rows: "10",
        "bind:value": taskViewModel.description
      }
    ))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "category"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskCategoryLabel), /* @__PURE__ */ createElement("input", { "bind:value": taskViewModel.category }))), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "clock_loader_40"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskStatusLabel), /* @__PURE__ */ createElement("input", { "bind:value": taskViewModel.status }))), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "priority_high"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskPriorityLabel), /* @__PURE__ */ createElement("input", { type: "number", "bind:value": taskViewModel.priority }))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "calendar_month"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskDateLabel), /* @__PURE__ */ createElement("input", { type: "date", "bind:value": taskViewModel.date }))), /* @__PURE__ */ createElement("label", { class: "tile flex-no" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "schedule"), /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("span", null, translations.chatPage.task.taskTimeLabel), /* @__PURE__ */ createElement("input", { type: "time", "bind:value": taskViewModel.time }))), /* @__PURE__ */ createElement("hr", null), /* @__PURE__ */ createElement("div", { class: "width-input" }, DangerousActionButton(
      translations.chatPage.task.deleteTaskButton,
      "delete_forever",
      taskViewModel.deleteTask
    ))), /* @__PURE__ */ createElement("div", { class: "flex-row width-100" }, /* @__PURE__ */ createElement("button", { class: "flex", "on:click": taskViewModel.close }, translations.general.closeButton), /* @__PURE__ */ createElement("button", { class: "flex primary", "on:click": taskViewModel.closeAndSave }, translations.general.saveButton, /* @__PURE__ */ createElement("span", { class: "icon" }, "save")))));
  }

  // src/View/ChatPages/boardPage.tsx
  function BoardPage(boardViewModel) {
    boardViewModel.loadData();
    const mainContent = createProxyState(
      [boardViewModel.selectedPage],
      () => {
        switch (boardViewModel.selectedPage.value) {
          case "kanban" /* Kanban */: {
            return BoardKanbanPage(boardViewModel);
          }
          case "status-grid" /* StatusGrid */: {
            return BoardStatusGridPage(boardViewModel);
          }
          default: {
            return /* @__PURE__ */ createElement(
              "div",
              {
                class: "task-grid",
                "children:append": [
                  boardViewModel.filteredTaskViewModels,
                  TaskViewModelToEntry
                ]
              }
            );
          }
        }
      }
    );
    const taskSettingsModal = createProxyState(
      [boardViewModel.selectedTaskViewModel],
      () => {
        if (boardViewModel.selectedTaskViewModel.value == void 0) {
          return /* @__PURE__ */ createElement("div", null);
        } else {
          return TaskSettingsModal(boardViewModel.selectedTaskViewModel.value);
        }
      }
    );
    return /* @__PURE__ */ createElement("div", { class: "pane" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.task.closeBoard,
        "on:click": boardViewModel.close
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "arrow_back")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.task.boardSettingsHeadline,
        "on:click": boardViewModel.showSettings
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "settings")
    )), /* @__PURE__ */ createElement("span", { class: "scroll-h ribbon" }, BoardViewToggleButton(
      translations.chatPage.task.listViewButtonAudioLabel,
      "view_list",
      "list" /* List */,
      boardViewModel
    ), BoardViewToggleButton(
      translations.chatPage.task.kanbanViewButtonAudioLabel,
      "view_kanban",
      "kanban" /* Kanban */,
      boardViewModel
    ), BoardViewToggleButton(
      translations.chatPage.task.statusViewButtonAudioLabel,
      "grid_view",
      "status-grid" /* StatusGrid */,
      boardViewModel
    )), /* @__PURE__ */ createElement("span", null, /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.task.filterTasksButtonAudioLabel,
        "on:click": boardViewModel.showFilterModal
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "filter_alt")
    ), /* @__PURE__ */ createElement(
      "button",
      {
        class: "ghost",
        "aria-label": translations.chatPage.task.createTaskButtonAudioLabel,
        "on:click": boardViewModel.createTask
      },
      /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
    ))), /* @__PURE__ */ createElement("div", { class: "content main-content", "children:set": mainContent }), BoardSettingsModal(boardViewModel), SearchModal(
      translations.chatPage.task.filterTasksHeadline,
      boardViewModel.taskViewModels,
      boardViewModel.filteredTaskViewModels,
      TaskViewModelToEntry,
      TaskViewModel.getStringsForFilter,
      boardViewModel.isPresentingFilterModal
    ), /* @__PURE__ */ createElement("div", { "children:set": taskSettingsModal }));
  }

  // src/View/Components/boardEntry.tsx
  function BoardEntry(boardViewModel) {
    const view = /* @__PURE__ */ createElement(
      "button",
      {
        "set:color": boardViewModel.color,
        class: "tile colored-tile",
        "toggle:selected": boardViewModel.isSelected,
        "on:click": boardViewModel.select,
        "on:dragover": allowDrop,
        "on:drop": boardViewModel.handleDropBetweenBoards
      },
      /* @__PURE__ */ createElement("span", { class: "shadow", "subscribe:innerText": boardViewModel.name }),
      /* @__PURE__ */ createElement("b", { "subscribe:innerText": boardViewModel.name })
    );
    boardViewModel.index.subscribe((newIndex) => {
      view.style.order = newIndex;
    });
    return view;
  }
  var BoardViewModelToEntry = (boardViewModel) => {
    return BoardEntry(boardViewModel);
  };

  // src/View/ChatPages/taskPage.tsx
  function TaskPage(taskPageViewModel) {
    taskPageViewModel.loadData();
    const isShowingBoard = createProxyState(
      [taskPageViewModel.selectedBoardId],
      () => taskPageViewModel.selectedBoardId.value != void 0
    );
    const paneContent = createProxyState(
      [taskPageViewModel.selectedBoardId],
      () => {
        const selectedBoardId = taskPageViewModel.selectedBoardId.value;
        if (selectedBoardId == void 0) {
          return /* @__PURE__ */ createElement("div", { class: "pane align-center justify-center" }, /* @__PURE__ */ createElement("span", { class: "secondary" }, translations.chatPage.task.noBoardSelected));
        }
        const selectedBoard = taskPageViewModel.boardViewModels.value.get(selectedBoardId);
        if (selectedBoard == void 0) {
          return /* @__PURE__ */ createElement("div", { class: "pane align-center justify-center" }, /* @__PURE__ */ createElement("span", { class: "secondary" }, translations.chatPage.task.boardNotFound));
        }
        return BoardPage(selectedBoard);
      }
    );
    return /* @__PURE__ */ createElement("div", { id: "task-page", "toggle:isshowingboard": isShowingBoard }, /* @__PURE__ */ createElement(
      "div",
      {
        id: "board-list",
        class: "pane-wrapper side background",
        "set:color": taskPageViewModel.chatViewModel.displayedColor
      },
      /* @__PURE__ */ createElement("div", { class: "pane" }, /* @__PURE__ */ createElement("div", { class: "toolbar" }, /* @__PURE__ */ createElement("div", { class: "flex-row width-input" }, /* @__PURE__ */ createElement(
        "input",
        {
          "bind:value": taskPageViewModel.newBoardNameInput,
          "on:enter": taskPageViewModel.createBoard,
          placeholder: translations.chatPage.task.newBoardNamePlaceholder
        }
      ), /* @__PURE__ */ createElement(
        "button",
        {
          class: "primary",
          "aria-label": translations.chatPage.task.createBoardButtonAudioLabel,
          "on:click": taskPageViewModel.createBoard,
          "toggle:disabled": taskPageViewModel.cannotCreateBoard
        },
        /* @__PURE__ */ createElement("span", { class: "icon" }, "add")
      ))), /* @__PURE__ */ createElement("div", { class: "content" }, /* @__PURE__ */ createElement(
        "div",
        {
          class: "grid gap",
          style: "grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr))",
          "children:append": [
            taskPageViewModel.boardViewModels,
            BoardViewModelToEntry
          ]
        }
      )))
    ), /* @__PURE__ */ createElement("div", { id: "board-content", class: "pane-wrapper", "children:set": paneContent }));
  }

  // src/View/chatPage.tsx
  function ChatPage(chatViewModel) {
    const mainContent = createProxyState(
      [chatViewModel.selectedPage],
      () => {
        chatViewModel.closeSubPages();
        switch (chatViewModel.selectedPage.value) {
          case "settings" /* Settings */: {
            return SettingsPage(chatViewModel.settingsPageViewModel);
          }
          case "tasks" /* Tasks */: {
            return TaskPage(chatViewModel.taskPageViewModel);
          }
          case "calendar" /* Calendar */: {
            return CalendarPage(chatViewModel.calendarViewModel);
          }
          default: {
            return MessagePage(chatViewModel.messagePageViewModel);
          }
        }
      }
    );
    return /* @__PURE__ */ createElement(
      "article",
      {
        id: "chat-page",
        "set:color": chatViewModel.displayedColor,
        class: "subtle-background"
      },
      /* @__PURE__ */ createElement("div", null, /* @__PURE__ */ createElement("div", { id: "ribbon" }, /* @__PURE__ */ createElement(
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
        translations.chatPage.pages.tasks,
        "task_alt",
        "tasks" /* Tasks */,
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
      ))), /* @__PURE__ */ createElement("div", { id: "main", "children:set": mainContent }))
    );
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

  // src/Model/Global/connectionModel.ts
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
    connectionChangeHandlerManager = new HandlerManager();
    messageHandlerManager = new HandlerManager();
    messageSentHandlerManager = new HandlerManager();
    channelsToSubscribe = /* @__PURE__ */ new Set();
    // handlers
    handleMessage = (data) => {
      this.messageHandlerManager.trigger(data);
    };
    handleConnectionChange = () => {
      console.log("connection status:", this.isConnected, this.address);
      this.connectionChangeHandlerManager.trigger();
      if (this.isConnected == false) return;
      if (this.address == void 0) return;
      this.storeAddress(this.address);
      this.sendSubscriptionRequest();
      this.sendMessagesInOutbox();
    };
    // connection
    connect = (address) => {
      this.udn.connect(address);
    };
    disconnect = () => {
      this.udn.disconnect();
      const reconnectAddressPath = StorageModel.getPath(
        "connection" /* ConnectionModel */,
        filePaths.connectionModel.reconnectAddress
      );
      this.storageModel.remove(reconnectAddressPath);
    };
    // mailbox
    getMailboxPath = (address) => {
      const mailboxDirPath = StorageModel.getPath(
        "connection" /* ConnectionModel */,
        filePaths.connectionModel.mailboxes
      );
      const mailboxFilePath = [...mailboxDirPath, address];
      return mailboxFilePath;
    };
    requestNewMailbox = () => {
      console.log("requesting new mailbox");
      this.udn.requestMailbox();
    };
    connectMailbox = () => {
      if (this.address == void 0) return;
      const mailboxId = this.storageModel.read(this.getMailboxPath(this.address));
      console.log("connecting mailbox", mailboxId);
      if (mailboxId == null) return this.requestNewMailbox();
      this.udn.connectMailbox(mailboxId);
    };
    storeMailbox = (mailboxId) => {
      if (this.address == void 0) return;
      this.storageModel.write(this.getMailboxPath(this.address), mailboxId);
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
    getOutboxPath = () => {
      return StorageModel.getPath(
        "connection" /* ConnectionModel */,
        filePaths.connectionModel.outbox
      );
    };
    getOutboxMessags = () => {
      const outboxPath = this.getOutboxPath();
      const messageIds = this.storageModel.list(outboxPath);
      let chatMessages = [];
      for (const messageId of messageIds) {
        const chatMessage = this.storageModel.readStringifiable(
          [...outboxPath, messageId],
          ChatMessageReference
        );
        if (chatMessage == null) continue;
        chatMessages.push(chatMessage);
      }
      return chatMessages;
    };
    addToOutbox = (chatMessage) => {
      const messagePath = [...this.getOutboxPath(), chatMessage.id];
      this.storageModel.writeStringifiable(messagePath, chatMessage);
    };
    removeFromOutbox = (chatMessage) => {
      const messagePath = [...this.getOutboxPath(), chatMessage.id];
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
      if (isSent) this.messageSentHandlerManager.trigger(chatMessage);
      return isSent;
    };
    // storage
    getPreviousAddressPath = () => {
      return StorageModel.getPath(
        "connection" /* ConnectionModel */,
        filePaths.connectionModel.previousAddresses
      );
    };
    getAddressPath = (address) => {
      const dirPath = this.getPreviousAddressPath();
      return [...dirPath, address];
    };
    getReconnectAddressPath = () => {
      return StorageModel.getPath(
        "connection" /* ConnectionModel */,
        filePaths.connectionModel.reconnectAddress
      );
    };
    storeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.write(addressPath, "");
      const reconnectAddressPath = this.getReconnectAddressPath();
      this.storageModel.write(reconnectAddressPath, address);
    };
    removeAddress = (address) => {
      const addressPath = this.getAddressPath(address);
      this.storageModel.remove(addressPath);
    };
    get addresses() {
      const dirPath = this.getPreviousAddressPath();
      return this.storageModel.list(dirPath);
    }
    // init
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
      const reconnectAddressPath = this.getReconnectAddressPath();
      const reconnectAddress = storageModel2.read(reconnectAddressPath);
      if (reconnectAddress != null) {
        this.connect(reconnectAddress);
      }
    }
  };

  // src/ViewModel/Global/connectionViewModel.ts
  var ConnectionViewModel = class {
    // init
    constructor(coreViewModel, connectionModel2) {
      this.coreViewModel = coreViewModel;
      this.connectionModel = connectionModel2;
      this.updatePreviousAddresses();
      connectionModel2.connectionChangeHandlerManager.addHandler(
        this.connectionChangeHandler
      );
    }
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
    // view
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
  };

  // src/ViewModel/Global/coreViewModel.ts
  var CoreViewModel = class {
    draggedObject = new State(void 0);
  };

  // src/View/Components/chatEntry.tsx
  function ChatEntry(chatViewModel) {
    const view = /* @__PURE__ */ createElement(
      "button",
      {
        class: "tile colored-tile",
        "set:color": chatViewModel.settingsPageViewModel.color,
        style: "height: 8rem",
        "on:click": chatViewModel.open
      },
      /* @__PURE__ */ createElement(
        "span",
        {
          class: "shadow",
          "subscribe:innerText": chatViewModel.settingsPageViewModel.primaryChannel
        }
      ),
      /* @__PURE__ */ createElement(
        "h2",
        {
          "subscribe:innerText": chatViewModel.settingsPageViewModel.primaryChannel
        }
      )
    );
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
        i.toString() == settingsViewModel2.firstDayOfWeekInput.value
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

  // src/Model/Global/settingsModel.ts
  var SettingsModel = class {
    storageModel;
    // data
    username;
    firstDayOfWeek;
    // storage
    setName(newValue) {
      this.username = newValue;
      const path = StorageModel.getPath(
        "settings" /* SettingsModel */,
        filePaths.settingsModel.username
      );
      this.storageModel.write(path, newValue);
    }
    setFirstDayOfWeek(newValue) {
      this.firstDayOfWeek = newValue;
      const path = StorageModel.getPath(
        "settings" /* SettingsModel */,
        filePaths.settingsModel.firstDayOfWeek
      );
      this.storageModel.write(path, newValue);
    }
    // load
    loadUsernam() {
      const path = StorageModel.getPath(
        "settings" /* SettingsModel */,
        filePaths.settingsModel.username
      );
      const content = this.storageModel.read(path);
      this.username = content ?? "";
    }
    loadFirstDayofWeek() {
      const path = StorageModel.getPath(
        "settings" /* SettingsModel */,
        filePaths.settingsModel.firstDayOfWeek
      );
      const content = this.storageModel.read(path);
      this.firstDayOfWeek = content ?? "0";
    }
    // init
    constructor(storageModel2) {
      this.storageModel = storageModel2;
      this.loadUsernam();
      this.loadFirstDayofWeek();
    }
  };

  // src/ViewModel/Global/settingsViewModel.ts
  var SettingsViewModel = class {
    // init
    constructor(coreViewModel, settingsModel2) {
      this.coreViewModel = coreViewModel;
      this.settingsModel = settingsModel2;
      this.username.value = settingsModel2.username;
      this.usernameInput.value = settingsModel2.username;
      this.firstDayOfWeekInput.value = settingsModel2.firstDayOfWeek;
      this.firstDayOfWeekInput.subscribe(this.setFirstDayofWeek);
    }
    settingsModel;
    // state
    username = new State("");
    usernameInput = new State("");
    firstDayOfWeekInput = new State("0");
    // guards
    cannotSetName = createProxyState(
      [this.usernameInput],
      () => this.usernameInput.value == "" || this.usernameInput.value == this.settingsModel.username
    );
    // methods
    setName = () => {
      this.settingsModel.setName(this.usernameInput.value);
      this.username.value = this.settingsModel.username;
      this.usernameInput.callSubscriptions();
    };
    setFirstDayofWeek = () => {
      this.settingsModel.setFirstDayOfWeek(this.firstDayOfWeekInput.value);
    };
  };

  // src/View/Components/directoryItemList.tsx
  function DirectoryItemList(storageViewModel2, pathString = PATH_COMPONENT_SEPARATOR) {
    const StringToDirectoryItemList = (pathString2) => DirectoryItemList(storageViewModel2, pathString2);
    const path = StorageModel.stringToPathComponents(pathString);
    const fileName = StorageModel.getFileName(path);
    const items = new ListState();
    const style = `text-indent: ${path.length}rem`;
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

  // src/ViewModel/Global/storageViewModel.ts
  var StorageViewModel = class {
    // init
    constructor(coreViewModel, storageModel2) {
      this.coreViewModel = coreViewModel;
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
      this.storageModel.removeRecursively(path);
      this.didMakeChanges.value = true;
    };
    // view
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
  var coreVieWModel = new CoreViewModel();
  var storageViewModel = new StorageViewModel(coreVieWModel, storageModel);
  var settingsViewModel = new SettingsViewModel(coreVieWModel, settingsModel);
  var connectionViewModel = new ConnectionViewModel(
    coreVieWModel,
    connectionModel
  );
  var chatListViewModel = new ChatListViewModel(
    coreVieWModel,
    storageModel,
    chatListModel,
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
})();
