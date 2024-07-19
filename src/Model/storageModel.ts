// this file is responsible for reading and writing persistent data; all storage shall be handled by this file.

import { parse, stringify } from "../utility";

import { DATA_VERSION } from "../typeSafety";

export default class StorageModel {
  storageEntryTree: StorageEntry = {};

  // basic
  store = (key: string, value: string): void => {
    localStorage.setItem(key, value);
    const pathComponents: string[] = StorageModel.keyToPathComponents(key);
    this.updateTree(...pathComponents);
  };

  restore = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  remove = (key: string): void => {
    localStorage.removeItem(key);
  };

  list = (key: string): string[] => {
    const pathComponents: string[] = StorageModel.keyToPathComponents(key);

    let currentParent: StorageEntry = this.storageEntryTree;
    for (const component of pathComponents) {
      currentParent = currentParent[component];
    }

    return [...Object.keys(currentParent)];
  };

  // stringifiable
  storeStringifiable = (key: string, value: any): void => {
    const valueString: string = stringify(value);
    this.store(key, valueString);
  };

  restoreStringifiable = (key: string): any | null => {
    const valueString: string | null = this.restore(key);
    if (!valueString) return null;

    return parse(valueString);
  };

  // init
  constructor() {
    for (const key of Object.keys(localStorage)) {
      const components: string[] = StorageModel.keyToPathComponents(key);
      this.updateTree(...components);
    }
  }

  // utility
  updateTree = (...pathComponents: string[]) => {
    let currentParent: StorageEntry = this.storageEntryTree;
    for (const pathPart of pathComponents) {
      if (!currentParent[pathPart]) {
        currentParent[pathPart] = {};
      }

      currentParent = currentParent[pathPart];
    }
  };

  static pathComponentsToKey = (...pathComponents: string[]): string => {
    return pathComponents.join("/");
  };

  static keyToPathComponents = (key: string): string[] => {
    return key.split("/");
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
  socketAddress: `${DATA_VERSION}/connection/socket-address`,

  // settings
  userName: `${DATA_VERSION}/settings/user-name`,
  firstDayOfWeek: `${DATA_VERSION}/settings/first-day-of-week`,

  // history
  previousAddresses: `${DATA_VERSION}/history/previous-addresses`,
  previousObjectCategories: `${DATA_VERSION}/history/object-categories`,
  previousObjectStatuses: `${DATA_VERSION}/history/object-statuses`,
  previousObjectFilters: `${DATA_VERSION}/history/object-filters`,

  // chat etc
  chatInfo: (id: string) => `${DATA_VERSION}/chat/${id}/info`,
  chatMessages: (id: string) => `${DATA_VERSION}/chat/${id}/messages`,
  chatObjects: (id: string) => `${DATA_VERSION}/chat/${id}/objects`,
  chatOutbox: (id: string) => `${DATA_VERSION}/chat/${id}/outbox`,
};
