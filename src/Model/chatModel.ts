import * as React from "bloatless-react";

import {
  UDN,
  chatIds,
  chats,
  isConnected,
  selectedChat,
  senderName,
  updateMailbox,
} from "../Model/model";
import { decryptString, encryptString } from "../cryptUtility";

import { Message } from "udn-frontend";
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
  primaryChannel = new React.State("");
  hasUnreadMessages: React.State<boolean>;
  secondaryChannels: React.ListState<string>;

  encryptionKey: React.State<string>;
  messages: React.ListState<ChatMessage>;

  composingMessage: React.State<string>;
  primaryChannelInput: React.State<string>;
  newSecondaryChannelName: React.State<string>;

  cannotSendMessage: React.State<boolean>;
  cannotResendMessage: React.State<boolean>;
  cannotAddSecondaryChannel: React.State<boolean>;
  cannotSetChannel: React.State<boolean>;
  cannotUndoChannel: React.State<boolean>;
  cannotClearMessages: React.State<boolean>;

  // init
  constructor(id: string = React.UUID()) {
    this.id = id;

    // channels
    this.primaryChannel = React.restoreState(
      storageKeys.primaryChannel(id),
      ""
    );
    this.secondaryChannels = React.restoreListState(
      storageKeys.secondaryChannels(id)
    );

    // messaging
    this.hasUnreadMessages = React.restoreState(
      storageKeys.hasUnread(id),
      false
    );
    this.encryptionKey = React.restoreState(storageKeys.encyptionKey(id), "");
    this.messages = React.restoreListState(storageKeys.messages(id));

    // inputs
    this.composingMessage = React.restoreState(
      storageKeys.composingMessage(id),
      ""
    );
    this.newSecondaryChannelName = new React.State("");
    this.primaryChannelInput = new React.State(this.primaryChannel.value);

    // guards
    this.cannotSendMessage = React.createProxyState(
      [
        this.primaryChannel,
        this.composingMessage,
        this.isSubscribed,
        isConnected,
        senderName,
      ],
      () =>
        this.primaryChannel.value == "" ||
        this.composingMessage.value == "" ||
        senderName.value == "" ||
        this.isSubscribed.value == false ||
        isConnected.value == false
    );
    this.cannotResendMessage = React.createProxyState(
      [this.primaryChannel, this.isSubscribed, isConnected, senderName],
      () =>
        this.primaryChannel.value == "" ||
        senderName.value == "" ||
        this.isSubscribed.value == false ||
        isConnected.value == false
    );
    this.cannotAddSecondaryChannel = React.createProxyState(
      [this.newSecondaryChannelName],
      () => this.newSecondaryChannelName.value == ""
    );
    this.cannotSetChannel = React.createProxyState(
      [this.primaryChannelInput, this.primaryChannel],
      () =>
        this.primaryChannelInput.value == "" ||
        this.primaryChannelInput.value == this.primaryChannel.value
    );
    this.cannotUndoChannel = React.createProxyState(
      [this.primaryChannelInput, this.primaryChannel],
      () => this.primaryChannelInput.value == this.primaryChannel.value
    );
    this.cannotClearMessages = React.createProxyState(
      [this.messages],
      () => this.messages.value.size == 0
    );
  }

  // general
  deleteSelf = () => {
    Object.values(storageKeys).forEach((storageKey) => {
      localStorage.removeItem(storageKey(this.id));
    });

    chats.remove(this);
    chatIds.remove(this.id);
  };

  // handlers
  onmessage = async (data: Message): Promise<void> => {
    if (!data.messageChannel) return;
    const channels = data.messageChannel.split("/");
    if (channels.indexOf(this.primaryChannel.value) == -1) return;

    if (data.subscribed != undefined) this.handleSubscription(data.subscribed);

    if (!data.messageBody) return;
    const { sender, body, channel, isoDate } = JSON.parse(data.messageBody);
    this.handleMessage({
      sender,
      body: await decryptString(body, this.encryptionKey.value),
      channel,
      isoDate,
    });
  };

  handleSubscription = (isSubscribed: boolean): void => {
    this.isSubscribed.value = isSubscribed;
  };

  handleMessage = (chatMessage: ChatMessage): void => {
    this.messages.add(chatMessage);
    if (selectedChat.value != this) this.hasUnreadMessages.value = true;
  };

  // messages
  sendNewMessage = async (): Promise<void> => {
    if (this.cannotSendMessage.value == true) return;

    this.sendMessageText(this.composingMessage.value);
    this.composingMessage.value = "";
  };

  resendMessage = (message: ChatMessage) => {
    if (this.cannotResendMessage.value == true) return;
    this.sendMessageText(message.body);
  };

  sendMessageText = async (messageText: string): Promise<void> => {
    // get channels
    const secondaryChannelNames: string[] = [
      ...this.secondaryChannels.value.values(),
    ];
    const allChannelNames: string[] = [
      this.primaryChannel.value,
      ...secondaryChannelNames,
    ];

    // encrypt
    const encrypted =
      this.encryptionKey.value == ""
        ? messageText
        : await encryptString(messageText, this.encryptionKey.value);

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
  };

  clearMessages = (): void => {
    this.messages.clear();
  };

  deleteMessage = (message: ChatMessage): void => {
    this.messages.remove(message);
  };

  decryptReceivedMessage = async (message: ChatMessage): Promise<void> => {
    message.body = await decryptString(message.body, this.encryptionKey.value);
    this.messages.callSubscriptions();
  };

  // channel
  setChannel = (): void => {
    if (this.cannotSetChannel.value == true) return;
    this.primaryChannel.value = this.primaryChannelInput.value;
    UDN.subscribe(this.primaryChannel.value);
    updateMailbox();
  };

  undoChannelChange = (): void => {
    this.primaryChannelInput.value = this.primaryChannel.value;
  };

  addSecondaryChannel = (): void => {
    if (this.cannotAddSecondaryChannel.value == true) return;

    this.secondaryChannels.add(this.newSecondaryChannelName.value);
    this.newSecondaryChannelName.value = "";
  };

  removeSecondaryChannel = (channel: string): void => {
    this.secondaryChannels.remove(channel);
  };
}

// METHODS
export function createChatWithName(name: string): void {
  const newChat = new Chat();
  chats.add(newChat);

  newChat.primaryChannel.value = name;
  newChat.primaryChannelInput.value = name;
  chatIds.add(newChat.id);

  UDN.subscribe(name);
  updateMailbox();
}
