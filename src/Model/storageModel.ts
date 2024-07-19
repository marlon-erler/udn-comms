// this file is responsible for reading and writing persistent data; all storage shall be handled by this file.

import { parse, stringify } from "../utility";

export default class StorageModel {
  storageEntryTree: StorageEntry = {};

  // basic
  store = (key: string, value: string): void => {
    localStorage.setItem(key, value);
    const pathComponents = this.keyToPathComponents(key);
    this.updateTree(...pathComponents);
  };

  restore = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  remove = (key: string): void => {
    localStorage.removeItem(key);
  };

  list = (key: string): string[] => {
    const pathComponents = this.keyToPathComponents(key);
    
    let currentParent = this.storageEntryTree;
    for (const component of pathComponents) {
      currentParent = currentParent[component];
    }

    return [...Object.keys(currentParent)];
  };

  // stringifiable
  storeStringifiable = (key: string, value: any[]): void => {
    const valueString = stringify(value);
    this.store(key, valueString);
  };

  restoreStringifiable = (key: string): any | null => {
    const valueString = this.restore(key);
    if (!valueString) return null;

    return parse(valueString);
  };

  // init
  constructor() {
    for (const key of Object.keys(localStorage)) {
      const components = this.keyToPathComponents(key);
      this.updateTree(...components);
    }
  }

  // utility
  updateTree = (...pathComponents: string[]) => {
    let currentParent = this.storageEntryTree;
    for (const pathPart of pathComponents) {
      if (!currentParent[pathPart]) {
        currentParent[pathPart] = {};
      }

      currentParent = currentParent[pathPart];
    }
  };

  pathComponentsToKey = (...pathComponents: string[]): string => {
    return pathComponents.join("/");
  };

  keyToPathComponents = (key: string): string[] => {
    return key.split("/");
  };
}

// types
export type StorageEntry = { [key: string]: StorageEntry };

// keys
export const storageKeys = {
  // connection
  socketAddress: "v2/connection/socket-address",

  // settings
  userName: "v2/settings/user-name",
  firstDayOfWeek: "v2/settings/first-day-of-week",

  // history
  previousAddresses: "v2/history/previous-addresses",
  previousObjectCategories: "v2/history/object-categories",
  previousObjectStatuses: "v2/history/object-statuses",
  previousObjectFilters: "v2/history/object-filters",

  // chat etc
  chatInfo: (id: string) => `v2/chat/${id}/info`,
  chatMessages: (id: string) => `v2/chat/${id}/messages`,
  chatObjects: (id: string) => `v2/chat/${id}/objects`,
  chatOutbox: (id: string) => `v2/chat/${id}/outbox`,
};
