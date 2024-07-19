// this file is responsible for all settings.

import StorageModel, { storageKeys } from "./storageModel";

export default class SettingsModel {
  storageModel: StorageModel;

  username: string;
  firstDayOfWeek: number;

  // set
  setName(newValue: string): void {
    this.username = newValue;
    const path = storageKeys.username;
    this.storageModel.store(path, newValue);
  }

  setFirstDayOfWeek(newValue: number): void {
    this.firstDayOfWeek = newValue;
    const path = storageKeys.firstDayOfWeek;
    this.storageModel.storeStringifiable(path, newValue);
  }

  // restore
  restoreUsername(): void {
    const path = storageKeys.username;
    const content = this.storageModel.restore(path);
    this.username == content ?? "";
  }

  restoreFirstDayofWeek(): void {
    const path = storageKeys.firstDayOfWeek;
    const content = this.storageModel.restoreStringifiable(path);
    this.firstDayOfWeek == content ?? 0;
  }

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;

    this.restoreUsername();
    this.restoreFirstDayofWeek();
  }
}
