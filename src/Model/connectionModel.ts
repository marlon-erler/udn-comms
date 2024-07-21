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

  connectionChangeHandler: () => void = () => {};
  messageHandler: (data: Message) => void = () => {};
  messageSentHandler: (chatMessage: ChatMessage) => void = () => {};

  channelsToSubscribe: Set<string> = new Set();

  // connection
  connect = (address: string): void => {
    this.udn.connect(address);
  };

  disconnect = (): void => {
    this.udn.disconnect();

    // do not reconnect
    const reconnectAddressPath: string[] = storageKeys.reconnectAddress;
    this.storageModel.remove(reconnectAddressPath);
  };

  handleMessage = (data: Message): void => {
    this.messageHandler(data);
  };

  handleConnectionChange = (): void => {
    console.log("connection status:", this.isConnected, this.address);
    this.connectionChangeHandler();

    if (this.isConnected == false) return;
    if (!this.address) return;

    this.connectMailbox();
    this.storeAddress(this.address);
    this.sendSubscriptionRequest();
    this.sendMessagesInOutbox();
  };

  // mailbox
  requestNewMailbox = (): void => {
    console.trace("requesting mailbox");
    this.udn.requestMailbox();
  };

  connectMailbox = (): void => {
    if (this.address == undefined) return;
    const path = [...storageKeys.mailboxes, this.address];
    const mailboxId = this.storageModel.restore(path);
    console.log("connecting mailbox", mailboxId)
    if (mailboxId == null) return this.requestNewMailbox();

    this.udn.connectMailbox(mailboxId);
  };

  storeMailbox = (mailboxId: string): void => {
    if (this.address == undefined) return;
    const path = [...storageKeys.mailboxes, this.address];
    this.storageModel.store(path, mailboxId);
  };

  // subscription
  addChannel = (channel: string): void => {
    this.channelsToSubscribe.add(channel);
    this.sendSubscriptionRequest();
  };

  sendSubscriptionRequest = (): void => {
    if (this.isConnected == false) return;

    for (const channel of this.channelsToSubscribe) {
      this.udn.subscribe(channel);
    }
    // update mailbox
    this.connectMailbox();
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

      messages.push(message);
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
      const isSent: boolean = this.tryToSendMessage(message);
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
    const isSent: boolean = this.udn.sendMessage(
      chatMessage.channel,
      stringifiedBody
    );
    if (isSent) this.messageSentHandler(chatMessage);
    return isSent;
  };

  // storage
  private getAddressPath = (address: string): string[] => {
    const dirPath = storageKeys.previousAddresses;
    return [...dirPath, address];
  };

  storeAddress = (address: string): void => {
    // history
    const addressPath = this.getAddressPath(address);
    this.storageModel.store(addressPath, "");

    // reconnect
    const reconnectAddressPath: string[] = storageKeys.reconnectAddress;
    this.storageModel.store(reconnectAddressPath, address);
  };

  removeAddress = (address: string): void => {
    const addressPath = this.getAddressPath(address);
    this.storageModel.remove(addressPath);
  };

  get addresses(): string[] {
    const dirPath = storageKeys.previousAddresses;
    return this.storageModel.list(dirPath);
  }

  // handlers
  setConnectionChangeHandler = (handler: () => void): void => {
    this.connectionChangeHandler = handler;
  };

  setMessageHandler = (handler: (data: Message) => void): void => {
    this.messageHandler = handler;
  };

  setMessageSentHandler = (
    handler: (chatMessage: ChatMessage) => void
  ): void => {
    this.messageSentHandler = handler;
  };

  // setup
  constructor(storageModel: StorageModel) {
    // create frontend
    this.udn = new UDNFrontend();
    this.storageModel = storageModel;

    // setup handlers
    this.udn.onmessage = (data: Message) => {
      this.handleMessage(data);
    };
    this.udn.onconnect = () => {
      this.handleConnectionChange();
    };
    this.udn.ondisconnect = () => {
      this.handleConnectionChange();
    };

    this.udn.onmailboxcreate = (mailboxId: string) => {
      console.log("created mailbox", mailboxId);
      this.storeMailbox(mailboxId);
      this.connectMailbox();
    };
    this.udn.onmailboxdelete = (mailboxId: string) => {
      console.log(`mailbox ${mailboxId} deleted`);
      this.requestNewMailbox();
    };
    this.udn.onmailboxconnect = (mailboxId: string) => {
      console.log(`using mailbox ${mailboxId}`);
    };

    // reconnect
    const reconnectAddressPath: string[] = storageKeys.reconnectAddress;
    const reconnectAddress: string | null =
      storageModel.restore(reconnectAddressPath);
    if (reconnectAddress != null) {
      this.connect(reconnectAddress);
    }
  }
}
