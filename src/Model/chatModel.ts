import * as React from "bloatless-react";

import { UDN, isConnected } from "./model";
import { decryptString, encryptString } from "../cryptUtility";

import { senderName } from "./viewModel";
import { storageKeys } from "../utility";

// TYPES
// message
export interface Message {
  channel: string;
  sender: string;
  body: string;
  isoDate: string;
}

export class Message {
  constructor(
    public channel: string,
    public sender: string,
    public body: string,
    public isoDate: string
  ) {}
}

// chat
export class Chat {
  id: string;

  primaryChannel: React.State<string>;
  secondaryChannels: React.ListState<string>;

  encryptionKey: React.State<string>;
  messages: React.ListState<Message>;

  composingMessage: React.State<string>;
  cannotSendMessage: React.State<boolean>;

  newSecondaryChannelName: React.State<string>;
  cannotAddSecondaryChannel: React.State<boolean>;

  // init
  constructor(id: string = React.UUID()) {
    this.primaryChannel = React.restoreState(
      storageKeys.primaryChannel(id),
      ""
    );
    this.secondaryChannels = React.restoreListState(
      storageKeys.secondaryChannels(id)
    );

    this.encryptionKey = React.restoreState(storageKeys.encyptionKey(id), "");
    this.messages = React.restoreListState(storageKeys.messages(id));

    this.composingMessage = React.restoreState(
      storageKeys.composingMessage(id),
      ""
    );
    this.newSecondaryChannelName = new React.State("");

    this.cannotSendMessage = React.createProxyState(
      [this.primaryChannel, this.composingMessage, isConnected],
      () =>
        this.primaryChannel.value == "" ||
        this.composingMessage.value == "" ||
        isConnected.value == false
    );
    this.cannotAddSecondaryChannel = React.createProxyState(
      [this.newSecondaryChannelName],
      () => this.newSecondaryChannelName.value == ""
    );
  }

  // messages
  async sendMessage(): Promise<void> {
    if (this.cannotSendMessage.value == true) return;

    // get channels
    const secondaryChannelNames: string[] = [
      ...this.secondaryChannels.value.values(),
    ].map((channel) => channel);
    const allChannelNames: string[] = [
      this.primaryChannel.value,
      ...secondaryChannelNames,
    ];

    // encrypt
    const encrypted =
      (await encryptString(
        this.composingMessage.value,
        this.encryptionKey.value
      )) || this.composingMessage.value;
    if (encrypted == undefined) return;

    // create object
    const joinedChannelName = allChannelNames.join("/");
    const messageObject = new Message(
      joinedChannelName,
      senderName.value,
      encrypted,
      new Date().toISOString()
    );
    const messageString = JSON.stringify(messageObject);

    // send
    UDN.sendMessage(joinedChannelName, messageString);

    // clear
    this.composingMessage.value = "";
  }

  clearMessages(): void {
    this.messages.clear();
  }

  deleteMessage(message: Message): void {
    this.messages.remove(message);
  }

  async decryptReceivedMessage(message: Message): Promise<void> {
    message.body = await decryptString(message.body, this.encryptionKey.value);
    this.messages.callSubscriptions();
  }

  // channel
  setChannel(): void {}

  addSecondaryChannel(): void {
    if (this.cannotAddSecondaryChannel.value == true) return;

    this.secondaryChannels.add(this.newSecondaryChannelName.value);
    this.newSecondaryChannelName.value = "";
  }

  removeSecondaryChannel(channel: string): void {
    this.secondaryChannels.remove(channel);
  }
}

// INIT
const chatIds = React.restoreListState<string>("chat-ids");
const chatArray = [...chatIds.value.values()].map((id) => new Chat(id));
export const chats = new React.ListState<Chat>(chatArray);

// METHODS
export function createChatWithName(name: string): void {
  const newChat = new Chat();
  newChat.primaryChannel.value = name;
  chatIds.add(newChat.id);
}

export function removeChat(chat: Chat): void {
  Object.values(storageKeys).forEach((cb) => {
    localStorage.removeItem(cb(chat.id));
  });

  chats.remove(chat);
  chatIds.remove(chat.id);
}
