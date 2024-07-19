// this file is responsible for reading and writing persistent data; all storage shall be handled by this file.

import { parse, stringify } from "../utility";

export default class StorageModel {
  storageEntryTree: StorageEntry = {}; // basic
  store = (directoryNames: string[], key: string, value: string): void => {
    const unifiedPath = this.directoryNamesToKey(...directoryNames, key);
    localStorage.setItem(unifiedPath, value);
    this.updateTree(...directoryNames, key);
  };

  restore = (directoryNames: string[], key: string): string | null => {
    const unifiedPath = this.directoryNamesToKey(...directoryNames, key);
    return localStorage.getItem(unifiedPath);
  };

  remove = (directoryNames: string[], key: string): void => {
    const unifiedPath = this.directoryNamesToKey(...directoryNames, key);
    localStorage.removeItem(unifiedPath);
  };

  list = (...directoryNames: string[]): string[] => {
    let currentParent = this.storageEntryTree;
    for (const directoryName of directoryNames) {
      currentParent = currentParent[directoryName];
    }

    return [...Object.keys(currentParent)];
  };

  // array
  storeArray = (directoryNames: string[], key: string, value: any[]): void => {
    const valueString = stringify(value);
    this.store(directoryNames, key, valueString);
  };

  restoreArray = (directoryNames: string[], key: string): any[] | null => {
    const valueString = this.restore(directoryNames, key);
    if (!valueString) return null;

    const parsed = parse(valueString);
    if (!Array.isArray(parsed)) return null;

    return parsed;
  };

  // init
  constructor() {
    for (const key of Object.keys(localStorage)) {
      const directoryNames = this.keyToDirectoryNames(key);
      this.updateTree(...directoryNames);
    }
  }

  // utility
  updateTree = (...pathParts: string[]) => {
    let currentParent = this.storageEntryTree;
    for (const pathPart of pathParts) {
      if (!currentParent[pathPart]) {
        currentParent[pathPart] = {};
      }

      currentParent = currentParent[pathPart];
    }
  };

  directoryNamesToKey = (...directoryNames: string[]): string => {
    return directoryNames.join("/");
  };

  keyToDirectoryNames = (key: string): string[] => {
    return key.split("/");
  };
}

// types
export type StorageEntry = { [key: string]: StorageEntry };

// keys
export enum storageKeys {
  // current
  socketAddress = "v2-socket-address",

  // settings
  userName = "v2-user-name",
  firstDayOfWeek = "v2-first-day-of-week",

  // history
  previousAddresses = "v2-previous-addresses",
  previousObjectCategories = "v2-object-categories",
  previousObjectStatuses = "v2-object-statuses",
  previousObjectFilters = "v2-object-filters",
}
