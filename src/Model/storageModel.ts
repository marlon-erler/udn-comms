// this file is responsible for reading and writing persistent data; all storage shall be handled by this file.

import { parse, stringify } from "./Utility/utility";

import { DATA_VERSION } from "./Utility/typeSafety";

const PATH_COMPONENT_SEPARATOR = "\\";

export default class StorageModel {
  storageEntryTree: StorageEntry = {};

  // basic
  store = (pathComponents: string[], value: string): void => {
    const key: string = StorageModel.pathComponentsToKey(...pathComponents);
    localStorage.setItem(key, value);
    this.updateTree(...pathComponents);
  };

  restore = (pathComponents: string[]): string | null => {
    const key: string = StorageModel.pathComponentsToKey(...pathComponents);
    return localStorage.getItem(key);
  };

  remove = (
    pathComponents: string[],
    shouldInitialize: boolean = true
  ): void => {
    const key: string = StorageModel.pathComponentsToKey(...pathComponents);
    localStorage.removeItem(key);

    if (shouldInitialize == true) {
      this.initializeTree();
    }
  };

  removeRecursive = (pathComponentsOfEntityToDelete: string[]): void => {
    a: for (const key of Object.keys(localStorage)) {
      const pathComponentsOfCurrentEntity: string[] =
        StorageModel.keyToPathComponents(key);

      for (let i = 0; i < pathComponentsOfEntityToDelete.length; i++) {
        if (!pathComponentsOfCurrentEntity[i]) continue a;
        if (
          pathComponentsOfCurrentEntity[i] != pathComponentsOfEntityToDelete[i]
        )
          continue a;
      }

      this.remove(pathComponentsOfCurrentEntity, false);
    }
    this.initializeTree();
  };

  list = (pathComponents: string[]): string[] => {
    let currentParent: StorageEntry = this.storageEntryTree;
    for (const component of pathComponents) {
      const nextParent: StorageEntry | undefined = currentParent[component];
      if (nextParent == undefined) return [];
      currentParent = nextParent;
    }

    return [...Object.keys(currentParent)];
  };

  // stringifiable
  storeStringifiable = (pathComponents: string[], value: any): void => {
    const valueString: string = stringify(value);
    this.store(pathComponents, valueString);
  };

  restoreStringifiable = (pathComponents: string[]): any | null => {
    const valueString: string | null = this.restore(pathComponents);
    if (!valueString) return null;

    return parse(valueString);
  };

  // init
  constructor() {
    this.initializeTree();
  }

  // utility
  initializeTree = (): void => {
    console.log("initializing tree");

    this.storageEntryTree = {};
    for (const key of Object.keys(localStorage)) {
      const components: string[] = StorageModel.keyToPathComponents(key);
      this.updateTree(...components);
    }
  };

  updateTree = (...pathComponents: string[]): void => {
    let currentParent: StorageEntry = this.storageEntryTree;
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

  static pathComponentsToKey = (...pathComponents: string[]): string => {
    return pathComponents.join(PATH_COMPONENT_SEPARATOR);
  };

  static keyToPathComponents = (key: string): string[] => {
    return key.split(PATH_COMPONENT_SEPARATOR);
  };

  static join = (...items: string[]): string => {
    let allComponents: string[] = [];
    for (const item of items) {
      const parts = this.keyToPathComponents(item);
      allComponents.push(...parts);
    }
    return StorageModel.pathComponentsToKey(...allComponents);
  };
}

// types
export type StorageEntry = { [key: string]: StorageEntry };

// keys
export const storageKeys = {
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
  chatInfo: (id: string) => [DATA_VERSION, "chat", id, "info"],
  chatLastUsedPage: (id: string) => [DATA_VERSION, "chat", id, "last-used-page"],
  chatMessages: (id: string) => [DATA_VERSION, "chat", id, "messages"],
  chatObjects: (id: string) => [DATA_VERSION, "chat", id, "objects"],
  chatOutbox: (id: string) => [DATA_VERSION, "chat", id, "outbox"],
};
