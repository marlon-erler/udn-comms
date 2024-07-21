import * as React from "bloatless-react";

import StorageModel from "../Model/storageModel";

export default class StorageViewModel {
  storageModel: StorageModel;

  // state
  isShowingStorageModal: React.State<boolean> = new React.State(false);
  selectedPath: React.State<string> = new React.State("\\");

  // view methods
  showStorageModal = (): void => {
    this.isShowingStorageModal.value = true;
  }

  hideStorageModal = (): void => {
    this.isShowingStorageModal.value = false;
  }

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;
  }
}
