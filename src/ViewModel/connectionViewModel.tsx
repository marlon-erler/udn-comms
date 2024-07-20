import * as React from "bloatless-react";

import ConnectionModel from "../Model/connectionModel";
import { Message } from "udn-frontend";
import StorageModel from "../Model/storageModel";

export default class ConnectionViewModel {
  connectionModel: ConnectionModel;

  // state
  serverAddressInput: React.State<string> = new React.State("");
  isConnected: React.State<boolean> = new React.State(false);

  isShowingConnectionModal: React.State<boolean> = new React.State(false);

  previousAddresses: React.ListState<string> = new React.ListState();

  // toggles
  cannotConnect: React.State<boolean> = React.createProxyState(
    [this.serverAddressInput, this.isConnected],
    () =>
      (this.isConnected.value == true &&
        this.serverAddressInput.value == this.connectionModel.address) ||
      this.serverAddressInput.value == ""
  );
  cannotDisonnect: React.State<boolean> = React.createProxyState(
    [this.isConnected],
    () => this.isConnected.value == false
  );

  // handlers
  connectionChangeHandler = (): void => {
    this.isConnected.value = this.connectionModel.isConnected;
    if (this.connectionModel.isConnected == false) return;

    if (this.connectionModel.address) {
      this.serverAddressInput.value = this.connectionModel.address;
    }
    this.updatePreviousAddresses();
  };

  messageHandler = (data: Message): void => {};

  // methods
  connect = (): void => {
    this.connectToAddress(this.serverAddressInput.value);
  };
  
  connectToAddress = (address: string): void => {
    this.connectionModel.connect(address);
  }
  
  disconnect = (): void => {
    this.connectionModel.disconnect();
  };

  removePreviousAddress = (address: string): void => {
    this.connectionModel.removeAddress(address);
    this.updatePreviousAddresses();
  }

  // view methods
  showConnectionModal = (): void => {
    this.isShowingConnectionModal.value = true;
  };

  hideConnectionModal = (): void => {
    this.isShowingConnectionModal.value = false;
  };

  updatePreviousAddresses = (): void => {
    this.previousAddresses.clear();
    this.previousAddresses.add(...this.connectionModel.addresses);
  }

  // init
  constructor(storageModel: StorageModel) {
    const connectionModel = new ConnectionModel({
      storageModel,
      connectionChangeHandler: this.connectionChangeHandler,
      messageHandler: this.messageHandler,
    });
    this.connectionModel = connectionModel;

    this.updatePreviousAddresses();
  }
}
