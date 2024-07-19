// this file is responsible for managing UDN connections.

import UDNFrontend, { Message } from "udn-frontend";

import { ChatMessage } from "./chatTypes";
import { stringify } from "../utility";

export default class ConnectionModel {
  // basic
  udn: UDNFrontend;

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

  handleConnectionChange = () => {
    console.log("connection status:", this.isConnected, this.address);
  };

  // messaging
  sendChatMessage = (chatMessage: ChatMessage): boolean => {
    const stringifiedBody = stringify(chatMessage);
    return this.udn.sendMessage(chatMessage.channel, stringifiedBody);
  };

  // setup
  constructor(configuration: ConnectionModelConfiguration) {
    // create frontend
    this.udn = new UDNFrontend();

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
  connectionChangeHandler: () => void;
  messageHandler: (data: Message) => void;
}
