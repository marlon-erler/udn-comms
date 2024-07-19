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

  get url(): string | undefined {
    return this.udn.ws?.url;
  }

  // connection
  connect(address: string): void {
    this.udn.connect(address);
  }

  disconnect(): void {
    this.udn.disconnect();
  }

  handleDisconnect() {}

  // messaging
  sendChatMessage(chatMessage: ChatMessage): boolean {
    const stringifiedBody = stringify(chatMessage);
    return this.udn.sendMessage(chatMessage.channel, stringifiedBody);
  }

  handleMessage(data: Message) {}

  // setup
  constructor() {
    this.udn = new UDNFrontend();
    this.udn.onmessage = this.handleMessage;
    this.udn.ondisconnect = this.handleDisconnect;
  }
}
