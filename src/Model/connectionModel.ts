// this file is responsible for managing UDN connections.

import StorageModel, { storageKeys } from "./storageModel";
import UDNFrontend, { Message } from "udn-frontend";

import { ChatMessage } from "./chatModel";
import { stringify } from "./Utility/utility";

export default class ConnectionModel {
  udn: UDNFrontend;
  storageModel: StorageModel;

  // data
  get isConnected(): boolean {
    return this.udn.ws != undefined && this.udn.ws.readyState == 1;
  }

  get address(): string | undefined {
    return this.udn.ws?.url;
  }

  // connection
  connect = (address: string): void => {
    this.udn.connect(address);
  };

  disconnect = (): void => {
    this.udn.disconnect();
  };

  handleConnectionChange = (): void => {
    console.log("connection status:", this.isConnected, this.address);
    if (this.isConnected == false) return;

    if (this.address) {
      this.storeAddress(this.address);
    }
  };

  // messaging
  sendChatMessage = (chatMessage: ChatMessage): boolean => {
    const stringifiedBody: string = stringify(chatMessage);
    return this.udn.sendMessage(chatMessage.channel, stringifiedBody);
  };

  // storage
  private getAddressPath = (address: string): string[] => {
    const dirPath = storageKeys.previousAddresses;
    return [...dirPath, address];
  };

  storeAddress = (address: string): void => {
    const addressPath = this.getAddressPath(address);
    this.storageModel.store(addressPath, "");
  };

  removeAddress = (address: string): void => {
    const addressPath = this.getAddressPath(address);
    this.storageModel.remove(addressPath);
  };

  getAddresses = (): string[] => {
    const dirPath = storageKeys.previousAddresses;
    return this.storageModel.list(dirPath);
  };

  // setup
  constructor(configuration: ConnectionModelConfiguration) {
    // create frontend
    this.udn = new UDNFrontend();
    this.storageModel = configuration.storageModel;

    // setup handlers
    this.udn.onmessage = (data: Message) => {
      configuration.messageHandler(data);
    };
    this.udn.onconnect = () => {
      this.handleConnectionChange();
      configuration.connectionChangeHandler();
    };
    this.udn.ondisconnect = () => {
      this.handleConnectionChange();
      configuration.connectionChangeHandler();
    };
  }
}

// types
export interface ConnectionModelConfiguration {
  storageModel: StorageModel;

  connectionChangeHandler: () => void;
  messageHandler: (data: Message) => void;
}
