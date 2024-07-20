import * as React from "bloatless-react";

import ConnectionModel from "../Model/connectionModel";
import { Message } from "udn-frontend";

export default class ConnectionViewModel {
  connectionModel: ConnectionModel;

  // state
  serverAddressInput: React.State<string> = new React.State("");
  isConnected: React.State<boolean> = new React.State(false);

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
    if (this.connectionModel.address) {
      this.serverAddressInput.value = this.connectionModel.address;
    }
  };

  messageHandler = (data: Message): void => {};

  // methods
  connect = (): void => {
    this.connectionModel.connect(this.serverAddressInput.value);
  };

  disconnect = (): void => {
    this.connectionModel.disconnect();
  };

  // init
  constructor() {
    const connectionModel = new ConnectionModel({
      connectionChangeHandler: this.connectionChangeHandler,
      messageHandler: this.messageHandler,
    });
    this.connectionModel = connectionModel;
  }
}
