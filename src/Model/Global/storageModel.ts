// this file is responsible for reading and writing persistent data.

import {
  DATA_VERSION,
  ValidObject,
  checkMatchesObjectStructure,
} from "../Utility/typeSafety";
import { localeCompare, parseValidObject, stringify } from "../Utility/utility";

export const PATH_COMPONENT_SEPARATOR = "\\";

export default class StorageModel {
  storageEntryTree: StorageEntry = {};

  // basic
  write = (pathComponents: string[], value: string): void => {
    const pathString: string = StorageModel.pathComponentsToString(
      ...pathComponents
    );
    localStorage.setItem(pathString, value);
    this.updateTree(...pathComponents);
  };

  read = (pathComponents: string[]): string | null => {
    const pathString: string = StorageModel.pathComponentsToString(
      ...pathComponents
    );
    return localStorage.getItem(pathString);
  };

  remove = (
    pathComponents: string[],
    shouldInitialize: boolean = true
  ): void => {
    const pathString: string = StorageModel.pathComponentsToString(
      ...pathComponents
    );
    localStorage.removeItem(pathString);

    if (shouldInitialize == true) {
      this.initializeTree();
    }
  };

  removeRecursively = (pathComponentsOfEntityToDelete: string[]): void => {
    a: for (const key of Object.keys(localStorage)) {
      const pathComponentsOfCurrentEntity: string[] =
        StorageModel.stringToPathComponents(key);

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

    return [...Object.keys(currentParent).sort(localeCompare)];
  };

  // stringifiable
  writeStringifiable = (pathComponents: string[], value: ValidObject): void => {
    const valueString: string = stringify(value);
    this.write(pathComponents, valueString);
  };

  readStringifiable = <T extends ValidObject>(
    pathComponents: string[],
    reference: T
  ): T | null => {
    const valueString: string | null = this.read(pathComponents);
    if (!valueString) return null;

    const object: any | null = parseValidObject(valueString, reference);
    if (object == null) return null;

    return object;
  };

  // tree
  initializeTree = (): void => {
    console.log("initializing tree");

    this.storageEntryTree = {};
    for (const key of Object.keys(localStorage)) {
      const components: string[] = StorageModel.stringToPathComponents(key);
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

  printTree = (): string => {
    return stringify(this.storageEntryTree);
  };

  // init
  constructor() {
    this.initializeTree();
  }

  // utility
  static getFileName = (pathComponents: string[]): string => {
    return pathComponents[pathComponents.length - 1] || "\\";
  };

  static getFileNameFromString = (pathString: string): string => {
    const pathComponents: string[] = this.stringToPathComponents(pathString);
    return pathComponents[pathComponents.length - 1] || "\\";
  };

  static pathComponentsToString = (...pathComponents: string[]): string => {
    return pathComponents.join(PATH_COMPONENT_SEPARATOR);
  };

  static stringToPathComponents = (string: string): string[] => {
    return string.split(PATH_COMPONENT_SEPARATOR).filter((x) => x != "");
  };

  static join = (...items: string[]): string => {
    let allComponents: string[] = [];
    for (const item of items) {
      const parts = this.stringToPathComponents(item);
      allComponents.push(...parts);
    }
    return StorageModel.pathComponentsToString(...allComponents);
  };

  static getPath(
    locationName: keyof typeof storageLocations,
    filePath: string[]
  ): string[] {
    return [DATA_VERSION, storageLocations[locationName], ...filePath];
  }
}

// types
export type StorageEntry = { [key: string]: StorageEntry };

// locations
const storageLocations = {
  connectionModel: "connection",

  chat: "chat",

  settingsModel: "settings",
};

export const filePaths = {
  connectionModel: {
    socketAddress: ["socket-address"],
    reconnectAddress: ["reconnect-address"],
    outbox: ["outbox"],
    mailboxes: ["mailboxes"],

    previousAddresses: ["previous-addresses"],
  },

  chat: {
    base: [],
    chatBase: (id: string) => [id],
    info: (id: string) => [...filePaths.chat.chatBase(id), "info"],
    color: (id: string) => [...filePaths.chat.chatBase(id), "color"],
    messages: (id: string) => [...filePaths.chat.chatBase(id), "messages"],
    files: (id: string) => [...filePaths.chat.chatBase(id), "files"],
    lastUsedPage: (id: string) => [
      ...filePaths.chat.chatBase(id),
      "last-used-page",
    ],
  },

  settingsModel: {
    username: ["user-name"],
    firstDayOfWeek: ["first-day-of-week"],
  },
};