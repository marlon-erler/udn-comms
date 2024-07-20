import * as React from "bloatless-react";

import SettingsModel from "../Model/settingsModel";
import StorageModel from "../Model/storageModel";

export default class SettingsViewModel {
  settingsModel: SettingsModel;

  // state
  nameInput: React.State<string> = new React.State("");
  firstDayOfWeekInput: React.State<number> = new React.State(0);

  // toggles
  cannotSetName: React.State<boolean> = React.createProxyState(
    [this.nameInput],
    () =>
      this.nameInput.value == "" ||
      this.nameInput.value == this.settingsModel.username
  );

  // set
  setName = (): void => {
    this.settingsModel.setName(this.nameInput.value);
    this.nameInput.callSubscriptions();
  };

  setFirstDayofWeek = (): void => {
    this.settingsModel.setFirstDayOfWeek(this.firstDayOfWeekInput.value);
  };

  // init
  constructor(storageModel: StorageModel) {
    const settingsModel = new SettingsModel(storageModel);
    this.settingsModel = settingsModel;

    this.nameInput.value = settingsModel.username;
    this.firstDayOfWeekInput.value = settingsModel.firstDayOfWeek;

    // subscriptions
    this.firstDayOfWeekInput.subscribe(this.setFirstDayofWeek);
  }
}
