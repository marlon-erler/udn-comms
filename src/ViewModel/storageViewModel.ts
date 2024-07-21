import * as React from "bloatless-react";

import StorageModel, { PATH_COMPONENT_SEPARATOR } from "../Model/storageModel";

export default class StorageViewModel {
  storageModel: StorageModel;

  // state
  isShowingStorageModal: React.State<boolean> = new React.State(false);
  selectedPath: React.State<string> = new React.State(PATH_COMPONENT_SEPARATOR);
  didMakeChanges: React.State<boolean> = new React.State(false);

  // view methods
  showStorageModal = (): void => {
    this.isShowingStorageModal.value = true;
  };

  hideStorageModal = (): void => {
    if (this.didMakeChanges.value == true) {
      window.location.reload();
    }
    this.isShowingStorageModal.value = false;
  };

  // init
  constructor(storageModel: StorageModel) {
    this.storageModel = storageModel;
  }
}
