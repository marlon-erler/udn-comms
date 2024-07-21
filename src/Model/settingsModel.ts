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
    this.storageModel.write(path, newValue);
  }

  setFirstDayOfWeek(newValue: number): void {
    this.firstDayOfWeek = newValue;
    const path = storageKeys.firstDayOfWeek;
    this.storageModel.writeStringifiable(path, newValue);
  }

  // load
  loadUsernam(): void {
    const path = storageKeys.username;
    const content = this.storageModel.read(path);
    this.username = content ?? "";
  }

  loadFirstDayofWeek(): void {
    const path = storageKeys.firstDayOfWeek;
    const content = this.storageModel.readStringifiable(path);
    this.firstDayOfWeek = content ?? 0;
  }

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;

    this.loadUsernam();
    this.loadFirstDayofWeek();
  }
}
