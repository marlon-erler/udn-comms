import * as React from "bloatless-react";

import { UDN, isConnected } from "./model";
import { decryptString, encryptString } from "../cryptUtility";

import { Message } from "udn-frontend";
import { senderName } from "./viewModel";
import { storageKeys } from "../utility";

// TYPES
// message
export interface ChatMessage {
  channel: string;
  sender: string;
  body: string;
  isoDate: string;
}

// chat
export class Chat {
  id: string;

  isSubscribed = new React.State(false);
  currentChannel = new React.State("");

  primaryChannelInput: React.State<string>;
  secondaryChannels: React.ListState<string>;

  encryptionKey: React.State<string>;
  messages: React.ListState<ChatMessage>;

  composingMessage: React.State<string>;
  newSecondaryChannelName: React.State<string>;

  cannotSendMessage: React.State<boolean>;
  cannotAddSecondaryChannel: React.State<boolean>;
  cannotSetChannel: React.State<boolean>;

  // init
  constructor(id: string = React.UUID()) {
    this.primaryChannelInput = React.restoreState(
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
      [
        this.primaryChannelInput,
        this.composingMessage,
        this.isSubscribed,
        isConnected,
      ],
      () =>
        this.primaryChannelInput.value == "" ||
        this.composingMessage.value == "" ||
        this.isSubscribed.value == false ||
        isConnected.value == false
    );
    this.cannotAddSecondaryChannel = React.createProxyState(
      [this.newSecondaryChannelName],
      () => this.newSecondaryChannelName.value == ""
    );
    this.cannotSetChannel = React.createProxyState(
      [this.primaryChannelInput, this.currentChannel],
      () =>
        this.primaryChannelInput.value == "" ||
        this.primaryChannelInput.value == this.currentChannel.value
    );
  }

  // handlers
  onmessage(data: Message): void {
    if (data.messageChannel && data.messageChannel != this.currentChannel.value)
      return;

    if (data.subscribed != undefined) this.handleSubscription(data.subscribed);

    if (!data.messageBody) return;
    const { sender, body, channel, isoDate } = JSON.parse(data.messageBody);
    this.handleMessage({ sender, body, channel, isoDate });
  }

  handleSubscription(isSubscribed: boolean): void {
    this.isSubscribed.value = isSubscribed;
  }

  handleMessage(chatMessage: ChatMessage): void {
    this.messages.add(chatMessage);
  }

  // messages
  async sendMessage(): Promise<void> {
    if (this.cannotSendMessage.value == true) return;

    // get channels
    const secondaryChannelNames: string[] = [
      ...this.secondaryChannels.value.values(),
    ].map((channel) => channel);
    const allChannelNames: string[] = [
      this.primaryChannelInput.value,
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
    const messageObject: ChatMessage = {
      channel: joinedChannelName,
      sender: senderName.value,
      body: encrypted,
      isoDate: new Date().toISOString(),
    };
    const messageString = JSON.stringify(messageObject);

    // send
    UDN.sendMessage(joinedChannelName, messageString);

    // clear
    this.composingMessage.value = "";
  }

  clearMessages(): void {
    this.messages.clear();
  }

  deleteMessage(message: ChatMessage): void {
    this.messages.remove(message);
  }

  async decryptReceivedMessage(message: ChatMessage): Promise<void> {
    message.body = await decryptString(message.body, this.encryptionKey.value);
    this.messages.callSubscriptions();
  }

  // channel
  setChannel(): void {
    if (this.cannotSetChannel.value == true) return;
    this.currentChannel.value = this.primaryChannelInput.value;
    UDN.subscribe(this.currentChannel.value);
  }

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
  newChat.primaryChannelInput.value = name;
  chatIds.add(newChat.id);
}

export function removeChat(chat: Chat): void {
  Object.values(storageKeys).forEach((cb) => {
    localStorage.removeItem(cb(chat.id));
  });

  chats.remove(chat);
  chatIds.remove(chat.id);
}
