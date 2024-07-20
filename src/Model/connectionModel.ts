// this file is responsible for managing UDN connections.

import StorageModel, { storageKeys } from "./storageModel";
import UDNFrontend, { Message } from "udn-frontend";

import { ChatMessage } from "./chatModel";
import { checkIsValidObject } from "./Utility/typeSafety";
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

  // outbox
  getOutboxMessags = (): ChatMessage[] => {
    const outboxPath: string[] = storageKeys.outbox;
    const messageIds: string[] = this.storageModel.list(outboxPath);

    let messages: ChatMessage[] = [];
    for (const messageId of messageIds) {
      const message: any = this.storageModel.restoreStringifiable([
        ...outboxPath,
        messageId,
      ]);
      if (message == undefined) continue;
      if (checkIsValidObject(message) == false) continue;

      message.push(message);
    }

    return messages;
  };

  addToOutbox = (chatMessage: ChatMessage): void => {
    const messagePath: string[] = [...storageKeys.outbox, chatMessage.id];
    this.storageModel.storeStringifiable(messagePath, chatMessage);
  };

  removeFromOutbox = (chatMessage: ChatMessage): void => {
    const messagePath: string[] = [...storageKeys.outbox, chatMessage.id];
    this.storageModel.remove(messagePath);
  };

  sendMessagesInOutbox = (): void => {
    const messages: ChatMessage[] = this.getOutboxMessags();

    for (const message of messages) {
      const isSent = this.tryToSendMessage(message);
      if (isSent == false) return;

      this.removeFromOutbox(message);
    }
  };

  // messaging
  sendMessageOrStore = (chatMessage: ChatMessage): void => {
    const isSent = this.tryToSendMessage(chatMessage);
    if (isSent == true) return;

    this.addToOutbox(chatMessage);
  };

  tryToSendMessage = (chatMessage: ChatMessage): boolean => {
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

  get addresses(): string[] {
    const dirPath = storageKeys.previousAddresses;
    return this.storageModel.list(dirPath);
  }

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
